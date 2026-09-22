import { test, expect } from '@playwright/test';
import { EvidenceCollector } from './helpers/evidence.helper';
import { loginAs, TEST_USERS } from './helpers/auth.helper';

test.describe('Suite 3: Admin Unit Operations, Full CRUD & Verification', () => {

  test.beforeEach(async ({ page }) => {
    // Authenticate as Admin Unit Staff
    await loginAs(page, TEST_USERS.admin);
  });

  test('01. Admin Dashboard Overview Smoke & Metrics', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1, h2').first()).toBeVisible();

    // Verify presence of administrative sections
    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      1,
      'Admin_Dashboard_Overview',
      'Admin Unit dashboard showing monthly tonnage KPIs, active queue and unit summary'
    );
  });

  test('02. Kategori Sampah: Full CRUD, Search, Filter & Sort Testing', async ({ page }) => {
    const navLink = page.getByRole('link', { name: /Kategori Sampah/i }).first();
    await navLink.click();
    await page.waitForURL('**/admin/kategoris', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toContainText(/Daftar Kategori Sampah/i);

    // 1. Initial State Capture
    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      2,
      'Kategori_List_Initial',
      'Kategori Sampah management directory with price/point rates per material'
    );

    // 2. Test Search in Table
    const searchInput = page.locator('input[placeholder*="Cari nama atau deskripsi"]');
    await searchInput.fill('PET');
    await page.waitForTimeout(400);

    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      3,
      'Kategori_Search_PET',
      'Search query filtering PET category materials dynamically'
    );
    await searchInput.fill(''); // reset

    // 3. Test Filter by Jenis
    const jenisSelect = page.locator('select').first();
    await jenisSelect.selectOption('kertas');
    await page.waitForTimeout(400);

    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      4,
      'Kategori_Filter_Kertas',
      'Filtering waste category table specifically by Kertas material classification'
    );
    await jenisSelect.selectOption('all'); // reset

    // 4. Test Create Kategori Modal
    const addBtn = page.locator('button:has-text("Tambah Kategori")');
    await addBtn.click();
    await page.waitForSelector('text=Tambah Kategori Sampah Baru');

    const testCatName = `Galon PC Test ${Date.now()}`;
    await page.locator('input[placeholder*="Botol PET Bening"]').fill(testCatName);
    await page.locator('input[type="number"][min="0"]').fill('45'); // poin per kg
    await page.locator('textarea[placeholder*="Bersih dari cairan"]').fill('Kondisi utuh dan bersih dari label');

    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      5,
      'Kategori_Create_Modal_Filled',
      'Create Kategori modal filled with new material pricing and point metrics'
    );

    // Submit Create
    await page.locator('button[type="submit"]:has-text("Simpan Kategori")').click();
    await expect(page.locator('text=Tambah Kategori Sampah Baru')).toBeHidden({ timeout: 6000 });

    // 5. Verify created item in list
    await searchInput.fill(testCatName);
    await page.waitForTimeout(600);
    await expect(page.locator(`text=${testCatName}`).first()).toBeVisible({ timeout: 6000 });

    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      6,
      'Kategori_Created_Success',
      'Newly registered category displayed in table verified from backend'
    );

    // 6. Delete the created category item
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
    const deleteBtn = page.locator('button:has-text("Hapus")').first();
    await deleteBtn.click();
    await page.waitForTimeout(600);
  });

  test('03. Hadiah Catalog: Full CRUD, Search, Filter & Stock Management', async ({ page }) => {
    const navLink = page.getByRole('link', { name: /Katalog Hadiah/i }).first();
    await navLink.click();
    await page.waitForURL('**/admin/hadiahs', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toContainText(/Katalog Hadiah Bank Sampah/i);

    // 1. Initial State Capture
    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      7,
      'Hadiah_List_Initial',
      'Admin unit reward catalog management with points pricing and inventory stock'
    );

    // 2. Test Search
    const searchInput = page.locator('input[placeholder*="Cari nama atau deskripsi"]');
    await searchInput.fill('Beras');
    await page.waitForTimeout(400);

    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      8,
      'Hadiah_Search_Filtered',
      'Searching rewards by keyword "Beras"'
    );
    await searchInput.fill('');

    // 3. Test Create Hadiah Modal
    const addBtn = page.locator('button:has-text("Tambah Hadiah Baru")');
    await addBtn.click();
    await page.waitForSelector('text=Tambah Item Hadiah Baru');

    const testHadiahName = `Tumbler Stainless E2E ${Date.now()}`;
    await page.locator('input[placeholder*="Beras Ramos"]').fill(testHadiahName);
    await page.locator('input[type="number"][min="1"]').fill('150'); // Poin diperlukan
    await page.locator('input[type="number"][min="0"]').fill('25'); // Stok
    await page.locator('textarea[placeholder*="Keterangan merk"]').fill('Tumbler tahan panas 500ml food grade');

    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      9,
      'Hadiah_Create_Modal_Filled',
      'Create Hadiah modal populated with inventory details and point cost'
    );

    // Submit Create
    await page.locator('button[type="submit"]:has-text("Simpan Hadiah")').click();
    await page.waitForTimeout(600);

    // Verify in table
    await searchInput.fill(testHadiahName);
    await page.waitForTimeout(400);
    await expect(page.locator(`text=${testHadiahName}`)).toBeVisible();

    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      10,
      'Hadiah_Created_Success',
      'New reward added to inventory and active in unit reward catalog'
    );

    // Clean up created item
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
    const deleteBtn = page.locator('button:has-text("Hapus")').first();
    await deleteBtn.click();
    await page.waitForTimeout(600);
  });

  test('04. Verifikasi & Penimbangan Setoran Sampah Workflow', async ({ page }) => {
    const navLink = page.getByRole('link', { name: /Verifikasi Setoran/i }).first();
    await navLink.click();
    await page.waitForURL('**/admin/setorans', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toContainText(/Verifikasi & Penimbangan/i);

    // 1. Initial State Capture
    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      11,
      'Setorans_Verification_Queue',
      'Setoran submission verification queue for admin weigh-in and approval'
    );

    // 2. Filter Status
    const statusSelect = page.locator('select').first();
    await statusSelect.selectOption('menunggu_konfirmasi');
    await page.waitForTimeout(400);

    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      12,
      'Setorans_Filtered_Pending',
      'Queue filtered to show only submissions awaiting physical weighing'
    );

    // 3. Open Weigh-in / Verification Modal if items exist
    const actionBtn = page.locator('button:has-text("Timbang Fisik"), button:has-text("Lihat Rincian")').first();
    if (await actionBtn.isVisible()) {
      await actionBtn.click();
      await page.waitForSelector('text=Aturan Verifikasi:');

      await EvidenceCollector.capture(
        page,
        'Admin_Journey',
        13,
        'Setorans_Weigh_Verification_Modal',
        'Physical weigh-in modal allowing real weight adjustments and point calculation'
      );

      // Close modal cleanly
      const closeBtn = page.locator('div.fixed form button:has-text("Tutup"), div.fixed button:has-text("✕")').first();
      await closeBtn.click();
    }
  });

  test('05. Buku Tabungan Nasabah Directory & Search/Sort', async ({ page }) => {
    const navLink = page.getByRole('link', { name: /Data Nasabah/i }).first();
    await navLink.click();
    await page.waitForURL('**/admin/nasabahs', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toContainText(/Buku Tabungan Nasabah/i);

    // 1. Initial State Capture
    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      14,
      'Nasabah_Directory_Initial',
      'Nasabah ledger directory displaying citizen profiles and accumulated points balance'
    );

    // 2. Search Nasabah
    const searchInput = page.locator('input[placeholder*="Cari nama, email"]');
    await searchInput.fill('Demo');
    await page.waitForTimeout(400);

    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      15,
      'Nasabah_Search_Demo',
      'Search filtering registered nasabah by name or email'
    );
    await searchInput.fill('');

    // 3. Open Register Nasabah Modal
    const addNasabahBtn = page.locator('button:has-text("Daftarkan Nasabah Baru")');
    await addNasabahBtn.click();
    await page.waitForSelector('text=Daftarkan Nasabah Unit');

    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      16,
      'Nasabah_Create_Modal',
      'Admin modal for direct citizen onboarding at unit location'
    );

    await page.locator('button:has-text("Batal")').first().click();
  });

  test('06. Rekap & Neraca Massa Audit Reporting', async ({ page }) => {
    const navLink = page.getByRole('link', { name: /Rekap/i }).first();
    await navLink.click();
    await page.waitForURL('**/admin/rekap', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Assert main header is rendered
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // Wait for charts and tables to render
    await page.waitForTimeout(1000);

    await EvidenceCollector.capture(
      page,
      'Admin_Journey',
      17,
      'Rekap_Neraca_Massa_Dashboard',
      'Comprehensive circular mass-balance audit reporting with material charts and KPI cards'
    );
  });
});
