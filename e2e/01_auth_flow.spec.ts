import { test, expect } from '@playwright/test';
import { EvidenceCollector } from './helpers/evidence.helper';
import { TEST_USERS } from './helpers/auth.helper';

test.describe('Suite 1: Marketing, Authentication & Role Routing', () => {

  test('01. Public Marketing Landing Page Smoke & UI Inspection', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify main headlines and editorial components
    await expect(page).toHaveTitle(/Hijauin/i);
    const heroTitle = page.locator('h1, h2').first();
    await expect(heroTitle).toBeVisible();

    // Scroll down through editorial scenes
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.8));
    await page.waitForTimeout(500);

    // Capture visual evidence of landing page
    await EvidenceCollector.capture(
      page,
      'Auth_Flow',
      1,
      'Landing_Page_Hero',
      'Editorial public landing page with documentary aesthetic and typography'
    );
  });

  test('02. Register Form Validation: Client & Required Fields', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Step 1: Capture initial empty register form
    await EvidenceCollector.capture(
      page,
      'Auth_Flow',
      2,
      'Register_Form_Initial',
      'Initial registration form with Bank Sampah Unit selection'
    );

    // Trigger validation with empty inputs
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Expect validation errors for required fields
    const errorMessages = page.locator('p.text-xs.text-\\[\\#C1441F\\]');
    await expect(errorMessages.first()).toBeVisible();

    // Fill invalid email and mismatched passwords
    await page.locator('#full_name').fill('Test Validasi');
    await page.locator('#email').fill('bukan-email-valid');
    await page.locator('#password').fill('123'); // < 8 chars
    await page.locator('#password_confirmation').fill('123456'); // mismatch
    await submitBtn.click();

    await EvidenceCollector.capture(
      page,
      'Auth_Flow',
      3,
      'Register_Validation_Errors',
      'Client-side Zod validation errors displayed for email format and password length/mismatch'
    );
  });

  test('03. Register New Nasabah Flow (Success)', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    const uniqueEmail = `test.nasabah.${Date.now()}@hijauin.test`;
    await page.locator('#full_name').fill('Nasabah E2E Automasi');
    await page.locator('#email').fill(uniqueEmail);
    await page.locator('#phone').fill('081299990001');
    await page.locator('#alamat').fill('Jl. Pengujian Automasi No. 42');
    await page.locator('#password').fill('password123');
    await page.locator('#password_confirmation').fill('password123');

    await EvidenceCollector.capture(
      page,
      'Auth_Flow',
      4,
      'Register_Form_Filled',
      'Filled registration form ready for submission'
    );

    await page.locator('button[type="submit"]').click();

    // Verify redirected to nasabah dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    await EvidenceCollector.capture(
      page,
      'Auth_Flow',
      5,
      'Register_Success_Dashboard',
      'Successful registration redirects seamlessly to Nasabah Dashboard'
    );
  });

  test('04. Login Form Validation & Invalid Credentials Fallback', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Capture initial login screen
    await EvidenceCollector.capture(
      page,
      'Auth_Flow',
      6,
      'Login_Form_Initial',
      'Login screen with email, password fields and Google auth option'
    );

    // Test invalid credentials
    await page.locator('#email').fill('nonexistent@hijauin.test');
    await page.locator('#password').fill('wrongpassword123');
    await page.locator('button[type="submit"]').click();

    // Verify error banner is displayed
    const errorBanner = page.locator('div.border-\\[\\#C1441F\\]\\/30, div:has-text("Email atau password")');
    await expect(errorBanner.first()).toBeVisible({ timeout: 6000 });

    await EvidenceCollector.capture(
      page,
      'Auth_Flow',
      7,
      'Login_Invalid_Fallback_Error',
      'Proper fallback error banner shown upon invalid authentication attempt'
    );
  });

  test('05. Successful Login & Role-Based Redirection (Nasabah vs Admin)', async ({ page }) => {
    // 1. Nasabah Login
    await page.goto('/login');
    await page.locator('#email').fill(TEST_USERS.nasabah.email);
    await page.locator('#password').fill(TEST_USERS.nasabah.password);
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    await EvidenceCollector.capture(
      page,
      'Auth_Flow',
      8,
      'Login_Nasabah_Success',
      'Nasabah user successfully logged in and redirected to /dashboard'
    );

    // Clear session
    await page.evaluate(() => {
      localStorage.clear();
    });

    // 2. Admin Unit Login
    await page.goto('/login');
    await page.locator('#email').fill(TEST_USERS.admin.email);
    await page.locator('#password').fill(TEST_USERS.admin.password);
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    await EvidenceCollector.capture(
      page,
      'Auth_Flow',
      9,
      'Login_Admin_Success',
      'Admin Unit user successfully logged in and routed to /admin/dashboard'
    );
  });
});
