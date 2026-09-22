import { test, expect } from '@playwright/test';
import { EvidenceCollector } from './helpers/evidence.helper';
import { loginAs, TEST_USERS } from './helpers/auth.helper';

test.describe('Suite 4: Batch Import/Export CSV & XLSX with Staging & Elimination', () => {

  test.beforeEach(async ({ page }) => {
    // Authenticate as Admin Unit
    await loginAs(page, TEST_USERS.admin);
  });

  test('01. Rekap & Mass Balance: Verified No Runtime TypeError and Export Available', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/rekap');
    await page.waitForLoadState('networkidle');

    // Verify page loaded without any Next.js Runtime TypeError dialog
    await expect(page.locator('h1').first()).toContainText(/Rekap & Neraca Massa/i);
    await expect(page.locator('dialog:has-text("Runtime TypeError")')).toBeHidden();

    // Verify charts and tables rendered properly
    await expect(page.locator('text=Komposisi Material Terpilah')).toBeVisible();
    await expect(page.locator('text=Tren Neraca Massa 6-Bulan')).toBeVisible();
    await expect(page.locator('text=Rincian Neraca Massa & Poin Material')).toBeVisible();

    // Verify CSV and Excel export buttons are available
    await expect(page.locator('button:has-text("Ekspor CSV")')).toBeVisible();
    await expect(page.locator('button:has-text("Excel")')).toBeVisible();

    await EvidenceCollector.capture(
      page,
      'Admin_Rekap_Fix',
      1,
      'Rekap_Page_Clean_Render',
      'Rekap page rendering safely with material breakdown charts and export buttons'
    );
  });

  test('02. Kategori Sampah: Batch Import Staging Modal, Row Elimination & Inline Edit', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/kategoris');
    await page.waitForLoadState('networkidle');

    // Click "Impor CSV / XLSX" button
    const importBtn = page.locator('button:has-text("Impor CSV / XLSX")');
    await expect(importBtn).toBeVisible();
    await importBtn.click();

    // Wait for DataImportModal to appear
    await page.waitForSelector('text=Impor Kategori Sampah dari Spreadsheet');
    await expect(page.locator('text=Mendukung format .CSV, .XLSX, dan .XLS')).toBeVisible();
    await expect(page.locator('button:has-text("Unduh CSV")')).toBeVisible();
    await expect(page.locator('button:has-text("Unduh Excel (.xlsx)")')).toBeVisible();

    await EvidenceCollector.capture(
      page,
      'Admin_Import_Export',
      2,
      'Kategori_Import_Dropzone_Modal',
      'Batch Import modal dropzone with template download buttons'
    );

    const testTimestamp = Date.now().toString().slice(-4);
    const catName = `Tutup Botol HDPE ${testTimestamp}`;

    // Create a mock CSV buffer and simulate upload via file input
    const csvContent = `Nama Kategori,Jenis Material,Harga per kg (Rp),Poin per kg,Deskripsi
${catName},plastik,3500,35,Tutup botol air mineral dan galon
Kardus Arsip Putih ${testTimestamp},kertas,2800,28,Kertas arsip kantor dan dokumen
Beling Botol Sirup Cacat ${testTimestamp},kaca,1200,12,Pecahan botol sirup yang akan dieliminasi`;

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'batch_kategori.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(csvContent, 'utf-8'),
    });

    // Wait for Staging Preview Table to render
    await page.waitForSelector('text=3 dari 3 baris dipilih');

    await EvidenceCollector.capture(
      page,
      'Admin_Import_Export',
      3,
      'Kategori_Import_Staging_Parsed',
      'Staging table showing 3 parsed category rows with checkboxes and inline inputs'
    );

    // 1. Eliminate row 3 using the trash button
    const deleteButtons = page.locator('button[title*="eliminasi"]');
    await expect(deleteButtons).toHaveCount(3);
    await deleteButtons.nth(2).click(); // delete 3rd row

    // Assert row count decreased to 2
    await page.waitForSelector('text=2 dari 2 baris dipilih');
    await expect(deleteButtons).toHaveCount(2);

    // 2. Inline edit row 1 price from 3500 to 3800
    const priceInputs = page.locator('table input[type="number"]');
    await priceInputs.first().fill('3800');

    // 3. Deselect row 2 to test partial selection
    const checkboxes = page.locator('table tbody input[type="checkbox"]');
    await checkboxes.nth(1).uncheck();
    await page.waitForSelector('text=1 dari 2 baris dipilih');

    await EvidenceCollector.capture(
      page,
      'Admin_Import_Export',
      4,
      'Kategori_Import_Staging_Modified',
      'Staging table after eliminating row 3, editing price in row 1, and selecting 1 row'
    );

    // 4. Confirm Import
    const confirmBtn = page.locator('button:has-text("Impor 1 Data Terpilih")');
    await confirmBtn.click();

    // Verify modal closed
    await expect(page.locator('text=Impor Kategori Sampah dari Spreadsheet')).toBeHidden({ timeout: 6000 });

    // Search for newly imported category
    const searchInput = page.locator('input[placeholder*="Cari nama atau deskripsi"]');
    await searchInput.fill(catName);
    await page.waitForTimeout(400);

    await expect(page.locator(`text=${catName}`).first()).toBeVisible({ timeout: 6000 });

    await EvidenceCollector.capture(
      page,
      'Admin_Import_Export',
      5,
      'Kategori_Import_Success_Updated_Table',
      'Kategori table successfully updated with newly imported category'
    );
  });

  test('03. Hadiah Catalog: Batch Import Staging Modal & Template Downloads', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/hadiahs');
    await page.waitForLoadState('networkidle');

    // Click "Impor CSV / XLSX" button
    const importBtn = page.locator('button:has-text("Impor CSV / XLSX")');
    await expect(importBtn).toBeVisible();
    await importBtn.click();

    // Verify Hadiah import modal
    await page.waitForSelector('text=Impor Katalog Hadiah dari Spreadsheet');
    await expect(page.locator('button:has-text("Unduh CSV")')).toBeVisible();
    await expect(page.locator('button:has-text("Unduh Excel (.xlsx)")')).toBeVisible();

    const testTimestamp = Date.now().toString().slice(-4);
    const rewardName = `Kopi Bubuk ${testTimestamp}`;

    const csvContent = `Nama Hadiah,Poin Dibutuhkan,Jumlah Stok,Deskripsi
${rewardName},90,30,Kopi robusta sangrai kemasan 250 gram
Teh Celup Box ${testTimestamp},60,40,Teh celup isi 25 kantong`;

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'batch_hadiah.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(csvContent, 'utf-8'),
    });

    // Verify parsed rows
    await page.waitForSelector('text=2 dari 2 baris dipilih');

    await EvidenceCollector.capture(
      page,
      'Admin_Import_Export',
      6,
      'Hadiah_Import_Staging_Table',
      'Hadiah batch import staging preview with 2 items'
    );

    // Confirm import
    const confirmBtn = page.locator('button:has-text("Impor 2 Data Terpilih")');
    await confirmBtn.click();

    // Verify modal closed
    await expect(page.locator('text=Impor Katalog Hadiah dari Spreadsheet')).toBeHidden({ timeout: 6000 });

    // Search for newly imported reward item
    const searchInput = page.locator('input[placeholder*="Cari nama atau deskripsi"]');
    await searchInput.fill(rewardName);
    await page.waitForTimeout(400);

    await expect(page.locator(`text=${rewardName}`).first()).toBeVisible({ timeout: 6000 });

    await EvidenceCollector.capture(
      page,
      'Admin_Import_Export',
      7,
      'Hadiah_Import_Success_Catalog',
      'Rewards catalog successfully updated with batch imported rewards'
    );
  });
});
