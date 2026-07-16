import { expect, test } from '@playwright/test';
import {
  assertAuthenticatedConsole,
  assertProtectedRouteBlocked,
  dismissOnboardingIfPresent,
  hasCredentials,
  isAuthBlockedError,
  login,
  navigateConsoleCore,
  openSourceConnectionIfPresent,
  selectExistingOrganizationIfPresent,
  signOutIfPresent,
  smokeConfig
} from '../support/smoke-config';

test.describe('Main smoke flow', () => {
  test('TC-AUTH-003 unauthenticated user cannot open protected console route', async ({ page }) => {
    const config = smokeConfig();

    await assertProtectedRouteBlocked(page, config);
  });

  test('TC-AUTH-001 TC-CONSOLE-011 TC-SOURCE-007 authenticated console smoke', async ({ page }) => {
    const config = smokeConfig();
    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run authenticated smoke.');

    try {
      if (process.env.AUTH_STORAGE_STATE) {
        await page.goto(config.consolePath);
      } else {
        await login(page, config);
      }
      await selectExistingOrganizationIfPresent(page);
      await dismissOnboardingIfPresent(page);
    } catch (error) {
      if (isAuthBlockedError(error)) {
        test.skip(true, error.message);
      }
      throw error;
    }

    await assertAuthenticatedConsole(page, config);
    await navigateConsoleCore(page, config);
    await openSourceConnectionIfPresent(page, config);
  });

  test('TC-AUTH-004 sign out blocks protected route again', async ({ page }) => {
    const config = smokeConfig();
    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run sign-out smoke.');

    try {
      if (process.env.AUTH_STORAGE_STATE) {
        await page.goto(config.consolePath);
      } else {
        await login(page, config);
      }
      await selectExistingOrganizationIfPresent(page);
      await dismissOnboardingIfPresent(page);
    } catch (error) {
      if (isAuthBlockedError(error)) {
        test.skip(true, error.message);
      }
      throw error;
    }

    await assertAuthenticatedConsole(page, config);
    await signOutIfPresent(page, config);
    await assertProtectedRouteBlocked(page, config);
  });

  test('TC-PUBLIC-009 published public site loads when URL is provided', async ({ page }) => {
    const config = smokeConfig();
    test.skip(!config.publicSiteURL, 'Set PUBLIC_SITE_URL to run public-site smoke.');

    await page.goto(config.publicSiteURL!);
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expect(page.locator('body')).toBeVisible();

    if (config.publicExpectedText) {
      await expect(page.getByText(config.publicExpectedText, { exact: false })).toBeVisible();
    }
  });
});
