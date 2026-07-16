import { expect, test } from '@playwright/test';

test.describe('Auth account flows', () => {
  test('TC-AUTH-023 creator can create a new account and reach organization setup', async ({ page }) => {
    const name = process.env.SIGNUP_NAME;
    const email = process.env.SIGNUP_EMAIL;
    const password = process.env.SIGNUP_PASSWORD;

    test.skip(!name || !email || !password, 'Set SIGNUP_NAME, SIGNUP_EMAIL, and SIGNUP_PASSWORD to run signup automation.');

    await page.goto('/sign-in');
    await page.getByRole('button', { name: 'Create an account' }).click();

    await expect(page.getByText('Create your account')).toBeVisible();
    await page.locator('input[type="text"]').fill(name!);
    await page.locator('input[type="email"]').fill(email!);
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(new RegExp(escapeRegExp(email!), 'i'))).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await page.locator('input[type="password"]').fill(password!);
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/setup-organization|\/$/, { timeout: 20_000 });
    await expect(page.getByText(/set up your organization|overview|sources/i).first()).toBeVisible();
  });

  test('TC-AUTH-024 forgot password sends a reset link for an existing account', async ({ page }) => {
    const email = process.env.RESET_EMAIL;

    test.skip(!email, 'Set RESET_EMAIL to run forgot-password request automation.');

    await page.goto('/sign-in');
    await page.locator('input[type="email"]').fill(email!);
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('input[type="password"]')).toBeVisible();
    await page.getByRole('button', { name: 'Forgot password?' }).click();

    await expect(page.getByText(new RegExp(`We sent a link to ${escapeRegExp(email!)}`, 'i'))).toBeVisible();
    await expect(page.getByText(/open it to set a new password/i)).toBeVisible();
  });

  test('TC-AUTH-025 authenticated creator can request a change-password link', async ({ page }) => {
    const email = process.env.CHANGE_PASSWORD_EMAIL || process.env.SMOKE_EMAIL;
    const password = process.env.CHANGE_PASSWORD_CURRENT_PASSWORD || process.env.SMOKE_PASSWORD;

    test.skip(!email || !password, 'Set CHANGE_PASSWORD_EMAIL and CHANGE_PASSWORD_CURRENT_PASSWORD to run change-password automation.');

    await signIn(page, email!, password!);
    await selectExistingOrganizationIfPresent(page);
    await dismissOnboardingIfPresent(page);

    await page.goto('/settings');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissOnboardingIfPresent(page);

    await expect(page.getByText('Account')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByText(email!, { exact: false })).toBeVisible();
    await expect(page.getByText(/We'll email you a link to change it/i)).toBeVisible();

    const changePassword = page.getByRole('button', { name: /^Change password$/ });
    await expect(changePassword).toBeVisible();
    await changePassword.click();

    await expect(page.getByText('Check your email')).toBeVisible();
    await expect(page.getByText(new RegExp(`We sent a link to ${escapeRegExp(email!)}`, 'i'))).toBeVisible();
    await expect(page.getByText(/open it to change your password/i)).toBeVisible();
  });
});

async function signIn(page: import('@playwright/test').Page, email: string, password: string): Promise<void> {
  await page.goto('/sign-in');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

async function selectExistingOrganizationIfPresent(page: import('@playwright/test').Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded').catch(() => undefined);

  if (!page.url().includes('/setup-organization')) {
    return;
  }

  const selectButtons = page
    .locator('button')
    .filter({ hasText: /select/i })
    .filter({ hasNotText: /create organization|sign out/i });

  const count = await selectButtons.count();
  if (count === 0) {
    return;
  }

  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes('/setup-organization'), { timeout: 15_000 }).catch(() => undefined),
    selectButtons.first().click()
  ]);
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

async function dismissOnboardingIfPresent(page: import('@playwright/test').Page): Promise<void> {
  const seenBefore = page.getByRole('button', { name: /I've been here before|Close/i });
  if (await seenBefore.first().isVisible().catch(() => false)) {
    await seenBefore.first().click();
    await page.getByText(/first time in riffables/i).waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
