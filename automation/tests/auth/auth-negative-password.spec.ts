import { expect, test, type Locator, type Page } from '@playwright/test';
import { assertProtectedRouteBlocked, smokeConfig, type SmokeConfig } from '../support/smoke-config';

const WRONG_PASSWORD = 'WrongPasswordForAutomation12@';
const SAMPLE_PASSWORD = 'SamplePassword12@';

test.describe('Auth negative and password UX', () => {
  test('TC-AUTH-002 TC-AUTH-008 login rejects wrong or unknown credentials without creating a session', async ({ page }) => {
    const config = smokeConfig();

    test.skip(!config.email, 'Set SMOKE_EMAIL to run login rejection automation.');

    await reachPasswordStep(page, config.email!);
    await passwordInput(page).fill(WRONG_PASSWORD);
    await submitButton(page).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL(/\/sign-in/);

    await backToEmailButton(page).click();
    await emailInput(page).fill(uniqueUnknownEmail());
    await submitButton(page).click();
    await expect(passwordInput(page)).toBeVisible();
    await passwordInput(page).fill(WRONG_PASSWORD);
    await submitButton(page).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/not found|does not exist|no account|unknown account|not registered/i);

    await assertProtectedRouteBlocked(page, config);
  });

  test('TC-AUTH-009 blank login validation blocks incomplete auth submission', async ({ page }) => {
    const config = smokeConfig();

    await gotoSignIn(page, config);
    await expect(emailInput(page)).toBeVisible();
    await expect(submitButton(page)).toBeDisabled();

    const email = config.email || uniqueUnknownEmail();
    await emailInput(page).fill(email);
    await expect(submitButton(page)).toBeEnabled();
    await submitButton(page).click();

    await expect(passwordInput(page)).toBeVisible();
    await expect(submitButton(page)).toBeDisabled();

    await backToEmailButton(page).click();
    await expect(emailInput(page)).toBeVisible();
    await expect(passwordInput(page)).toHaveCount(0);

    await assertProtectedRouteBlocked(page, config);
  });

  test('TC-AUTH-013 password visibility toggle reveals and masks typed password', async ({ page }) => {
    const config = smokeConfig();

    test.skip(!config.email, 'Set SMOKE_EMAIL to run password visibility automation.');

    await reachPasswordStep(page, config.email!);
    const field = passwordInput(page);
    await expect(field).toHaveAttribute('type', 'password');

    await field.fill(SAMPLE_PASSWORD);
    await showPasswordButton(page).click();

    await expect(passwordTextInput(page)).toHaveAttribute('type', 'text');
    await expect(passwordTextInput(page)).toHaveValue(SAMPLE_PASSWORD);

    await hidePasswordButton(page).click();
    await expect(field).toHaveAttribute('type', 'password');
    await expect(field).toHaveValue(SAMPLE_PASSWORD);
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('TC-AUTH-014 password reveal resets to masked after returning to the email step', async ({ page }) => {
    const config = smokeConfig();

    test.skip(!config.email, 'Set SMOKE_EMAIL to run password reset-to-masked automation.');

    await reachPasswordStep(page, config.email!);
    await passwordInput(page).fill(SAMPLE_PASSWORD);
    await showPasswordButton(page).click();
    await expect(passwordTextInput(page)).toHaveAttribute('type', 'text');

    await backToEmailButton(page).click();
    await expect(emailInput(page)).toBeVisible();
    await emailInput(page).fill(config.email!);
    await submitButton(page).click();

    await expect(passwordInput(page)).toBeVisible();
    await expect(passwordInput(page)).toHaveAttribute('type', 'password');
    await expect(showPasswordButton(page)).toHaveAttribute('aria-pressed', 'false');
  });

  test('TC-AUTH-015 password toggle is keyboard-operable, labelled, stateful, and large enough', async ({ page }) => {
    const config = smokeConfig();

    test.skip(!config.email, 'Set SMOKE_EMAIL to run password toggle accessibility automation.');

    await reachPasswordStep(page, config.email!);
    await passwordInput(page).fill(SAMPLE_PASSWORD);

    const showToggle = showPasswordButton(page);
    await expect(showToggle).toHaveAttribute('aria-label', 'Show password');
    await expect(showToggle).toHaveAttribute('aria-pressed', 'false');
    await expectToggleTargetSize(showToggle);

    await showToggle.focus();
    await page.keyboard.press('Enter');

    const hideToggle = hidePasswordButton(page);
    await expect(passwordTextInput(page)).toHaveAttribute('type', 'text');
    await expect(hideToggle).toHaveAttribute('aria-label', 'Hide password');
    await expect(hideToggle).toHaveAttribute('aria-pressed', 'true');
    await expectToggleTargetSize(hideToggle);

    await hideToggle.focus();
    await page.keyboard.press('Space');

    await expect(passwordInput(page)).toHaveAttribute('type', 'password');
    await expect(showPasswordButton(page)).toHaveAttribute('aria-pressed', 'false');
  });

  test('TC-AUTH-034 forgot-password request for unknown email does not leak account existence', async ({ page }) => {
    const config = smokeConfig();
    const unknownEmail = uniqueUnknownEmail();

    await reachPasswordStep(page, unknownEmail);
    await page.getByRole('button', { name: /^Forgot password\?$/ }).click();

    await expect(page.getByText(new RegExp(`We sent a link to ${escapeRegExp(unknownEmail)}`, 'i'))).toBeVisible();
    await expect(page.getByText(/open it to set a new password/i)).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/not found|does not exist|no account|unknown account|not registered/i);

    await assertProtectedRouteBlocked(page, config);
  });

  test('TC-AUTH-043 signed-out user cannot request a change-password link from settings', async ({ page }) => {
    const config = smokeConfig();

    await page.goto('/settings');
    await page.waitForLoadState('networkidle').catch(() => undefined);

    await expect(page).toHaveURL(/\/sign-in/);
    await expect(emailInput(page)).toBeVisible();
    await expect(page.getByRole('heading', { name: /^Settings$/ })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /^Change password$/ })).toHaveCount(0);

    await assertProtectedRouteBlocked(page, config);
  });
});

async function reachPasswordStep(page: Page, email: string): Promise<void> {
  await gotoSignIn(page);
  await emailInput(page).fill(email);
  await submitButton(page).click();
  await expect(passwordInput(page)).toBeVisible();
  await expect(page.getByText(email, { exact: false })).toBeVisible();
}

async function gotoSignIn(page: Page, config?: SmokeConfig): Promise<void> {
  const loginPath = config?.loginPath || '/sign-in';

  for (let attempt = 0; attempt < 2; attempt += 1) {
    await page.goto(loginPath);
    await page.waitForLoadState('domcontentloaded').catch(() => undefined);

    if (await emailInput(page).isVisible({ timeout: 3_000 }).catch(() => false)) {
      return;
    }

    const reload = page.getByRole('button', { name: /^Reload$/ });
    if (await reload.isVisible().catch(() => false)) {
      await reload.click();
      await page.waitForLoadState('domcontentloaded').catch(() => undefined);
      if (await emailInput(page).isVisible({ timeout: 3_000 }).catch(() => false)) {
        return;
      }
    }
  }

  await expect(emailInput(page)).toBeVisible();
}

function emailInput(page: Page): Locator {
  return page.getByPlaceholder(/enter work email/i).or(page.locator('input[type="email"]')).first();
}

function passwordInput(page: Page): Locator {
  return page.getByPlaceholder(/enter password/i).or(page.locator('input[type="password"]')).first();
}

function passwordTextInput(page: Page): Locator {
  return page.getByPlaceholder(/enter password/i).or(page.locator('input[type="text"]')).first();
}

function submitButton(page: Page): Locator {
  return page.locator('button[type="submit"]').first();
}

function backToEmailButton(page: Page): Locator {
  return page.getByRole('button', { name: /^Back to email$/ });
}

function showPasswordButton(page: Page): Locator {
  return page.getByRole('button', { name: /^Show password$/ });
}

function hidePasswordButton(page: Page): Locator {
  return page.getByRole('button', { name: /^Hide password$/ });
}

async function expectToggleTargetSize(toggle: Locator): Promise<void> {
  const box = await toggle.boundingBox();
  expect(box, 'Password toggle should have a visible pointer target').not.toBeNull();
  expect(box!.width, 'Password toggle width should meet the 24px baseline').toBeGreaterThanOrEqual(24);
  expect(box!.height, 'Password toggle height should meet the 24px baseline').toBeGreaterThanOrEqual(24);
}

function uniqueUnknownEmail(): string {
  return `qa-unknown-${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
