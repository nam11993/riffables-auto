import { expect, test, type Browser, type BrowserContextOptions, type Page } from '@playwright/test';
import {
  assertAuthenticatedConsole,
  assertProtectedRouteBlocked,
  dismissOnboardingIfPresent,
  hasCredentials,
  isAuthBlockedError,
  login,
  selectExistingOrganizationIfPresent,
  signOutIfPresent,
  smokeConfig,
  type SmokeConfig
} from '../support/smoke-config';

test.use({ screenshot: 'off', storageState: { cookies: [], origins: [] }, trace: 'off', video: 'off' });

test.describe('Auth session and protected route security', () => {
  test.describe.configure({ mode: 'serial' });

  let authenticatedState: BrowserContextOptions['storageState'];

  test('TC-AUTH-007 creator valid login lands in an explicit tenant context', async ({ page }) => {
    const config = smokeConfig();
    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run creator login automation.');

    await signInToConsole(page, config);
    authenticatedState = await page.context().storageState();

    await expect(page.getByRole('link', { name: /^Home$/ })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: /^Sources$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /switch workspace/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Sign out$/ })).toBeVisible();
  });

  test('TC-AUTH-010 unauthenticated protected route is gated before authorized login', async ({ browser, page }) => {
    const config = smokeConfig();
    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run protected-route login automation.');

    await assertProtectedRouteBlocked(page, config);

    const authed = await newAuthenticatedPage(browser, config, authenticatedState);
    authenticatedState = authed.storageState;
    try {
      await authed.page.goto(config.protectedPath);
      await authed.page.waitForLoadState('networkidle').catch(() => undefined);
      await dismissBlockingOnboardingIfPresent(authed.page);

      await expect(authed.page).not.toHaveURL(/\/sign-in/);
      await expect(authed.page.getByRole('navigation').getByRole('link', { name: /^Sources$/ })).toBeVisible();
      await expect(authed.page.getByRole('button', { name: /^Sign out$/ })).toBeVisible();
    } finally {
      await authed.page.context().close();
    }
  });

  test('TC-AUTH-012 removed local session is redirected or blocked safely on refresh', async ({ browser }) => {
    const config = smokeConfig();
    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run removed-session automation.');

    const authed = await newAuthenticatedPage(browser, config, authenticatedState);
    authenticatedState = authed.storageState;
    try {
      await authed.page.goto(config.protectedPath);
      await authed.page.waitForLoadState('networkidle').catch(() => undefined);
      await expect(authed.page.getByRole('button', { name: /^Sign out$/ })).toBeVisible();

      await clearBrowserSession(authed.page);
      await authed.page.reload({ waitUntil: 'domcontentloaded' });
      await authed.page.waitForLoadState('networkidle').catch(() => undefined);

      await expectSignedOutGate(authed.page, config);
      await assertProtectedRouteBlocked(authed.page, config);
    } finally {
      await authed.page.context().close();
    }
  });

  test('TC-AUTH-011 sign out invalidates browser back, direct route, and refresh access', async ({ browser }) => {
    const config = smokeConfig();
    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run sign-out invalidation automation.');

    const authed = await newAuthenticatedPage(browser, config, authenticatedState);
    authenticatedState = authed.storageState;
    try {
      await authed.page.goto(config.protectedPath);
      await authed.page.waitForLoadState('networkidle').catch(() => undefined);
      await expect(authed.page.getByRole('button', { name: /^Sign out$/ })).toBeVisible();

      await signOutIfPresent(authed.page, config);
      await expectSignedOutGate(authed.page, config);

      await authed.page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => undefined);
      await authed.page.waitForLoadState('networkidle').catch(() => undefined);
      await expectSignedOutGate(authed.page, config);

      await assertProtectedRouteBlocked(authed.page, config);
      await authed.page.reload({ waitUntil: 'domcontentloaded' });
      await authed.page.waitForLoadState('networkidle').catch(() => undefined);
      await expectSignedOutGate(authed.page, config);
    } finally {
      await authed.page.context().close();
    }
  });
});

type AuthenticatedPage = {
  page: Page;
  storageState: BrowserContextOptions['storageState'];
};

async function newAuthenticatedPage(
  browser: Browser,
  config: SmokeConfig,
  storageState: BrowserContextOptions['storageState']
): Promise<AuthenticatedPage> {
  const context = await browser.newContext({ baseURL: config.baseURL, storageState: storageState || { cookies: [], origins: [] } });
  const page = await context.newPage();

  if (!storageState) {
    await signInToConsole(page, config);
  } else {
    await page.goto(config.consolePath);
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissBlockingOnboardingIfPresent(page);
    await assertAuthenticatedConsole(page, config);
  }

  return {
    page,
    storageState: await context.storageState()
  };
}

async function signInToConsole(page: Page, config: SmokeConfig): Promise<void> {
  try {
    await login(page, config);
    await selectExistingOrganizationIfPresent(page);
    await dismissBlockingOnboardingIfPresent(page);
  } catch (error) {
    if (isAuthBlockedError(error)) {
      test.skip(true, error.message);
    }
    throw error;
  }

  if (await page.getByText(/too many requests/i).isVisible().catch(() => false)) {
    await page.locator('input[type="password"]').fill('').catch(() => undefined);
    test.skip(true, 'Auth endpoint is rate-limited on staging. Re-run after the limit resets.');
  }

  await assertAuthenticatedConsole(page, config);
}

async function dismissBlockingOnboardingIfPresent(page: Page): Promise<void> {
  await dismissOnboardingIfPresent(page);

  const blockingDialog = page.getByRole('dialog', { name: /first time in riffables/i });
  await blockingDialog.waitFor({ state: 'visible', timeout: 3_000 }).catch(() => undefined);

  const dismiss = page.getByRole('button', { name: /I've been here before|Close/i }).first();
  if (await dismiss.isVisible().catch(() => false)) {
    await dismiss.click();
    await blockingDialog.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
  }
}

async function expectSignedOutGate(page: Page, config: SmokeConfig): Promise<void> {
  const onSignInRoute = page.url().includes(config.loginPath);
  const emailField = page.getByPlaceholder(/enter work email/i).or(page.locator('input[type="email"]')).first();

  await expect(page.getByRole('button', { name: /^Sign out$/ })).toHaveCount(0);

  if (onSignInRoute || (await emailField.isVisible().catch(() => false))) {
    await expect(emailField).toBeVisible();
    return;
  }

  await expect(page.locator('body')).toContainText(/sign in|log in|unauthorized|forbidden|not found/i);
}

async function clearBrowserSession(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
}
