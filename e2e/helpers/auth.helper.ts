import { Page, expect } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
  role: 'nasabah' | 'admin' | 'ops';
  expectedUrl: string;
}

export const TEST_USERS = {
  nasabah: {
    email: 'demo@hijauin.test',
    password: 'password',
    role: 'nasabah' as const,
    expectedUrl: '/dashboard',
  },
  admin: {
    email: 'admin.bekasi@hijauin.test',
    password: 'password',
    role: 'admin' as const,
    expectedUrl: '/admin/dashboard',
  },
  ops: {
    email: 'ops@hijauin.test',
    password: 'password',
    role: 'ops' as const,
    expectedUrl: '/admin/dashboard',
  },
};

export async function loginAs(page: Page, user: TestUser) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  // Fill in credentials
  await page.locator('#email').fill(user.email);
  await page.locator('#password').fill(user.password);

  // Click submit
  await page.locator('button[type="submit"]').click();

  // Wait for redirect to expected dashboard
  await expect(page).toHaveURL(new RegExp(user.expectedUrl), { timeout: 10000 });
  await page.waitForLoadState('networkidle');
}

export async function logout(page: Page) {
  // Navigate to or click logout if present, or clear state
  await page.evaluate(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('hijauin-auth');
  });
  await page.goto('/login');
}
