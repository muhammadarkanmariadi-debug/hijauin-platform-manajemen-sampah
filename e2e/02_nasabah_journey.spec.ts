import { test, expect } from '@playwright/test';
import { EvidenceCollector } from './helpers/evidence.helper';
import { loginAs, TEST_USERS } from './helpers/auth.helper';

test.describe('Suite 2: Nasabah Journey & Functional Smoke Testing', () => {

  test.beforeEach(async ({ page }) => {
    // Authenticate as default demo nasabah
    await loginAs(page, TEST_USERS.nasabah);
  });

  test('01. Nasabah Dashboard: Summary Metrics & Material Breakdown Smoke', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    // Assert key elements are visible on dashboard
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(page.locator('text=Saldo Poin Tersedia')).toBeVisible();
    await expect(page.locator('text=Rincian Material Terpilah')).toBeVisible();

    // Verify the 4 material breakdown cards
    await expect(page.locator('text=Plastik').first()).toBeVisible();
    await expect(page.locator('text=Kertas & Karton').first()).toBeVisible();
    await expect(page.locator('text=Logam & Kaleng').first()).toBeVisible();
    await expect(page.locator('text=Kaca & Botol').first()).toBeVisible();

    await EvidenceCollector.capture(
      page,
      'Nasabah_Journey',
      1,
      'Dashboard_Overview',
      'Nasabah dashboard overview with live points balance and canonical 4-material cards'
    );
  });

  test('02. Setor Sampah Flow: Form Validation, Multi-item Calc & Submission', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    // Open Setor Modal from main page button
    const setorBtn = page.locator('main button:has-text("Setor Sampah")').first();
    await setorBtn.waitFor({ state: 'visible' });
    await setorBtn.click({ force: true });

    // Wait for modal to appear and categories to load
    await page.waitForSelector('text=Formulir Setor Sampah Baru');
    await expect(page.locator('text=Memuat daftar kategori...')).toBeHidden({ timeout: 10000 });
    await page.waitForTimeout(300);

    // 1. Test validation on empty submit
    const submitBtn = page.locator('button[type="submit"]:has-text("Kirim Setoran Sampah")');
    await submitBtn.click();

    // Assert validation error banner
    await expect(page.locator('text=Pilih minimal 1 kategori sampah dan masukkan estimasi berat')).toBeVisible();

    await EvidenceCollector.capture(
      page,
      'Nasabah_Journey',
      2,
      'Setor_Modal_Validation_Error',
      'Setoran modal validation fallback preventing empty or zero weight submission'
    );

    // 2. Select Category via Combobox trigger
    const comboboxTrigger = page.locator('div[class*="relative"] button[type="button"]').filter({ hasText: /Pilih/i }).first();
    await comboboxTrigger.click();
    await page.waitForTimeout(400);

    // Pick first available category option from popover dropdown
    const option = page.locator('div[class*="shadow-xl"] div[class*="cursor-pointer"]').first();
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();
    await page.waitForTimeout(300);

    // Input estimated weight (e.g. 3.5 kg)
    const weightInput = page.locator('input[type="number"][placeholder="0.0"]').first();
    await weightInput.fill('3.5');
    await page.waitForTimeout(300);

    // Verify live estimator calculation banner appears
    await expect(page.locator('text=Estimasi Poin & Nilai')).toBeVisible();

    await EvidenceCollector.capture(
      page,
      'Nasabah_Journey',
      3,
      'Setor_Modal_Filled_Estimator',
      'Setor modal dynamically calculating estimated weight, rupiah and points'
    );

    // 3. Submit valid setoran
    await submitBtn.click();

    // Verify success confirmation state
    await expect(page.locator('text=Setoran Berhasil Dicatat!')).toBeVisible({ timeout: 8000 });

    await EvidenceCollector.capture(
      page,
      'Nasabah_Journey',
      4,
      'Setor_Modal_Success_Confirmation',
      'Submission recorded successfully with user guidance for drop-off'
    );
  });

  test('03. Katalog Hadiah: Search, Filter, Sort & Redeem Modal Flow', async ({ page }) => {
    const navLink = page.getByRole('link', { name: /Tukar Poin|Katalog/i }).first();
    await navLink.click();
    await page.waitForURL('**/penukarans', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Assert page loaded
    await expect(page.locator('h1')).toContainText(/Tukar Poin/i);

    // 1. Capture initial catalog
    await EvidenceCollector.capture(
      page,
      'Nasabah_Journey',
      5,
      'Katalog_Hadiah_Overview',
      'Rewards catalog displaying available reward items and point costs'
    );

    // 2. Test Search in Katalog
    const searchInput = page.locator('input[placeholder*="Cari nama hadiah"]');
    await searchInput.fill('Minyak');
    await page.waitForTimeout(300);

    await EvidenceCollector.capture(
      page,
      'Nasabah_Journey',
      6,
      'Katalog_Hadiah_Search',
      'Frontend real-time search filtering in reward catalog'
    );

    await searchInput.fill(''); // clear search

    // 3. Test Sorting in Katalog
    const sortSelect = page.locator('select#katalog-sort-select');
    await sortSelect.selectOption('poin_desc');
    await page.waitForTimeout(300);

    await EvidenceCollector.capture(
      page,
      'Nasabah_Journey',
      7,
      'Katalog_Hadiah_Sorted_Poin_Desc',
      'Rewards sorted from highest to lowest points required'
    );

    // 4. Test Tab Switch to "Riwayat Penukaran"
    const riwayatTab = page.locator('button:has-text("Riwayat Penukaran")');
    await riwayatTab.click();
    await page.waitForTimeout(300);

    await EvidenceCollector.capture(
      page,
      'Nasabah_Journey',
      8,
      'Riwayat_Penukaran_Tab',
      'History of point redemptions with status badges and redemption IDs'
    );
  });

  test('04. Nasabah Profile: Data Inspection, Validation & Update Flow', async ({ page }) => {
    const navLink = page.getByRole('link', { name: /Profil Akun|Profil/i }).first();
    await navLink.click();
    await page.waitForURL('**/profil', { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toContainText(/Profil Nasabah/i);

    // Capture initial profile view
    await EvidenceCollector.capture(
      page,
      'Nasabah_Journey',
      9,
      'Profil_Nasabah_Initial',
      'Nasabah profile page showing personal data, unit registration, and account ID'
    );

    // Update phone and address
    const phoneInput = page.locator('input[type="tel"]');
    const addressInput = page.locator('textarea');

    await phoneInput.fill('0812-3456-7890');
    await addressInput.fill('Jl. Boulevard Hijau No. 18, RT 01/RW 02, Harapan Indah, Bekasi');

    // Submit update
    const saveBtn = page.locator('button[type="submit"]:has-text("Simpan Perubahan")');
    await saveBtn.click();

    // Verify success banner
    await expect(page.locator('text=Profil akun Anda berhasil diperbarui!')).toBeVisible({ timeout: 6000 });

    await EvidenceCollector.capture(
      page,
      'Nasabah_Journey',
      10,
      'Profil_Nasabah_Updated_Success',
      'Successful profile update with confirmation alert'
    );
  });
});
