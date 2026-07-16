import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export type SmokeConfig = {
  baseURL: string;
  loginPath: string;
  protectedPath: string;
  consolePath: string;
  email?: string;
  password?: string;
  publicSiteURL?: string;
  publicExpectedText?: string;
  tenantExpectedText?: string;
  sourceExpectedChoices: string[];
  selectors: {
    email?: string;
    password?: string;
    submit?: string;
    signOut?: string;
  };
};

export class AuthBlockedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthBlockedError';
  }
}

export function isAuthBlockedError(error: unknown): error is AuthBlockedError {
  return error instanceof AuthBlockedError;
}

export function smokeConfig(): SmokeConfig {
  return {
    baseURL: requiredEnv('BASE_URL'),
    loginPath: env('LOGIN_PATH', '/sign-in'),
    protectedPath: env('PROTECTED_PATH', '/sources'),
    consolePath: env('CONSOLE_PATH', '/'),
    email: process.env.SMOKE_EMAIL,
    password: process.env.SMOKE_PASSWORD,
    publicSiteURL: process.env.PUBLIC_SITE_URL,
    publicExpectedText: process.env.PUBLIC_EXPECTED_TEXT,
    tenantExpectedText: process.env.TENANT_EXPECTED_TEXT,
    sourceExpectedChoices: splitCsv(
      env('SOURCE_EXPECTED_CHOICES', 'YouTube channel,YouTube video,Spotify show,Spotify episode,Blog RSS,Blog URL')
    ),
    selectors: {
      email: process.env.SELECTOR_EMAIL,
      password: process.env.SELECTOR_PASSWORD,
      submit: process.env.SELECTOR_SUBMIT,
      signOut: process.env.SELECTOR_SIGN_OUT
    }
  };
}

export function hasCredentials(config: SmokeConfig): boolean {
  return Boolean(config.email && config.password);
}

export function pathOrUrl(path: string): string {
  return path.startsWith('http://') || path.startsWith('https://') ? path : path;
}

export async function login(page: Page, config: SmokeConfig): Promise<void> {
  if (!config.email || !config.password) {
    throw new Error('Missing SMOKE_EMAIL or SMOKE_PASSWORD.');
  }

  await page.goto(pathOrUrl(config.loginPath));
  await fillEmail(page, config.email, config.selectors.email);
  if (!(await passwordFieldVisible(page, config.selectors.password))) {
    await clickSubmit(page, config.selectors.submit);
    await waitForAuthStepAfterEmail(page, config.selectors.password);
  }

  if (await isGoogleSignIn(page)) {
    await completeGoogleSignIn(page, config.email, config.password);
    await page.waitForLoadState('networkidle').catch(() => undefined);
    return;
  }

  await fillPassword(page, config.password, config.selectors.password);
  await clickSubmit(page, config.selectors.submit);
  await page
    .waitForURL((url) => !url.pathname.startsWith(config.loginPath), { timeout: 15_000 })
    .catch(() => undefined);
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

export async function assertAuthenticatedConsole(page: Page, config: SmokeConfig): Promise<void> {
  await expect(page).not.toHaveURL(new RegExp(`${escapeRegExp(config.loginPath)}(?:$|[?#])`));

  const url = page.url();
  expect(url, 'User should be somewhere in the authenticated app after login').toMatch(/\/$|console|dashboard|home|sources|content|sites/i);

  if (config.tenantExpectedText) {
    await expect(page.getByText(config.tenantExpectedText, { exact: false })).toBeVisible();
  }
}

export async function dismissOnboardingIfPresent(page: Page): Promise<void> {
  const seenBefore = page.getByRole('button', { name: "I've been here before" });
  if (await seenBefore.isVisible().catch(() => false)) {
    await seenBefore.click();
    await page.getByText(/first time in riffables/i).waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
  }
}

export async function selectExistingOrganizationIfPresent(page: Page): Promise<void> {
  await Promise.race([
    page.waitForURL((url) => /setup-organization/i.test(url.pathname), { timeout: 10_000 }),
    page.waitForURL((url) => /\/$|\/sources|\/content|\/sites|dashboard|home|console/i.test(url.pathname), { timeout: 10_000 }),
    page.getByText(/set up your organization|select an organization/i).first().waitFor({ state: 'visible', timeout: 10_000 })
  ]).catch(() => undefined);

  const onSetupPage =
    /setup-organization/i.test(page.url()) ||
    (await page.getByText(/set up your organization|select an organization/i).first().isVisible().catch(() => false));

  if (!onSetupPage) {
    return;
  }

  const organizationSelect = page
    .locator('button')
    .filter({ hasText: /select/i })
    .filter({ hasNotText: /create organization|sign out/i });

  await organizationSelect.first().waitFor({ state: 'visible', timeout: 15_000 }).catch(() => undefined);

  const count = await organizationSelect.count();
  if (count === 0) {
    throw new Error('Organization setup is shown, but no existing organization Select button is available.');
  }

  await Promise.all([
    page.waitForURL((url) => !/setup-organization/i.test(url.pathname), { timeout: 15_000 }),
    organizationSelect.first().click()
  ]);
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

export async function assertProtectedRouteBlocked(page: Page, config: SmokeConfig): Promise<void> {
  await page.goto(pathOrUrl(config.protectedPath));
  await page.waitForLoadState('domcontentloaded');

  const emailField = firstVisible(page, [
    page.locator(config.selectors.email || '__never__'),
    page.getByLabel(/email|e-mail|username/i),
    page.getByPlaceholder(/email|e-mail|username/i),
    page.locator('input[type="email"]'),
    page.locator('input[name*="email" i]'),
    page.locator('input[name*="username" i]')
  ]);

  const blockedCopy = firstVisible(page, [
    page.getByText(/sign in|log in|login|unauthorized|forbidden|not authorized/i),
    page.getByText(/404|not found|could not be found/i),
    page.getByRole('button', { name: /sign in|log in|login/i }),
    page.getByRole('link', { name: /sign in|log in|login/i })
  ]);

  const currentUrl = page.url();
  const routeStillExposed = currentUrl.includes(config.protectedPath);

  if (routeStillExposed) {
    await expect(blockedCopy.or(emailField).first()).toBeVisible();
  } else {
    await expect(page).toHaveURL(/login|sign-in|signin|auth|unauthorized|forbidden|404|not-found/i);
  }
}

export async function navigateConsoleCore(page: Page, config: SmokeConfig): Promise<void> {
  await dismissOnboardingIfPresent(page);

  for (const route of [config.consolePath, '/sources', '/content', '/sites']) {
    await page.goto(pathOrUrl(route));
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissOnboardingIfPresent(page);
    await expect(page.locator('body')).toBeVisible();
  }
}

export async function openSourceConnectionIfPresent(page: Page, config: SmokeConfig): Promise<void> {
  await page.goto('/sources');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await dismissOnboardingIfPresent(page);

  const addSource = firstVisible(page, [
    page.getByRole('button', { name: /add source|connect source|connect channel|add channel/i }),
    page.getByRole('link', { name: /add source|connect source|connect channel|add channel/i }),
    page.getByText(/add source|connect source|connect channel|add channel/i)
  ]);

  if ((await addSource.count()) === 0) {
    for (const choice of config.sourceExpectedChoices) {
      await expect(page.getByText(new RegExp(escapeRegExp(choice), 'i')).first()).toBeVisible();
    }
    return;
  }

  await addSource.first().click();

  for (const choice of config.sourceExpectedChoices) {
    await expect(page.getByText(new RegExp(escapeRegExp(choice), 'i')).first()).toBeVisible();
  }
}

export async function signOutIfPresent(page: Page, config: SmokeConfig): Promise<void> {
  await dismissOnboardingIfPresent(page);

  const explicit = config.selectors.signOut ? page.locator(config.selectors.signOut) : page.locator('__never__');
  const signOut = firstVisible(page, [
    explicit,
    page.getByRole('button', { name: /sign out|log out|logout/i }),
    page.getByRole('link', { name: /sign out|log out|logout/i }),
    page.getByText(/sign out|log out|logout/i)
  ]);

  if ((await signOut.count()) > 0) {
    await signOut.first().click();
    await page.waitForLoadState('networkidle').catch(() => undefined);
    return;
  }

  const avatarOrMenu = firstVisible(page, [
    page.getByRole('button', { name: /account|profile|user|menu/i }),
    page.locator('[aria-haspopup="menu"]').first(),
    page.locator('[data-testid*="user" i]').first(),
    page.locator('[data-testid*="avatar" i]').first()
  ]);

  if ((await avatarOrMenu.count()) === 0) {
    return;
  }

  await avatarOrMenu.first().click();
  await firstVisible(page, [
    page.getByRole('menuitem', { name: /sign out|log out|logout/i }),
    page.getByRole('button', { name: /sign out|log out|logout/i }),
    page.getByText(/sign out|log out|logout/i)
  ]).first().click();
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

async function fillEmail(page: Page, value: string, selector?: string): Promise<void> {
  const locator = firstVisible(page, [
    selector ? page.locator(selector) : page.locator('__never__'),
    page.getByLabel(/email|e-mail|username/i),
    page.getByPlaceholder(/email|e-mail|username/i),
    page.locator('input[type="email"]'),
    page.locator('input[name*="email" i]'),
    page.locator('input[name*="username" i]')
  ]);

  await locator.first().fill(value);
}

async function fillPassword(page: Page, value: string, selector?: string): Promise<void> {
  const locator = passwordField(page, selector);

  await locator.first().fill(value);
}

function passwordField(page: Page, selector?: string): Locator {
  return firstVisible(page, [
    selector ? page.locator(selector) : page.locator('__never__'),
    page.getByLabel(/password/i),
    page.getByPlaceholder(/password/i),
    page.locator('input[type="password"]:visible'),
    page.locator('input[name*="password" i]:visible')
  ]);
}

async function passwordFieldVisible(page: Page, selector?: string): Promise<boolean> {
  return passwordField(page, selector)
    .first()
    .waitFor({ state: 'visible', timeout: 1_000 })
    .then(() => true)
    .catch(() => false);
}

async function waitForAuthStepAfterEmail(page: Page, passwordSelector?: string): Promise<void> {
  await Promise.race([
    page.waitForURL((url) => /accounts\.google\.com/i.test(url.hostname), { timeout: 8_000 }),
    passwordField(page, passwordSelector).first().waitFor({ state: 'visible', timeout: 8_000 })
  ]).catch(() => undefined);

  await page.waitForLoadState('domcontentloaded').catch(() => undefined);
}

async function isGoogleSignIn(page: Page): Promise<boolean> {
  if (/accounts\.google\.com/i.test(page.url())) {
    return true;
  }

  return page
    .getByText(/sign in with google/i)
    .first()
    .waitFor({ state: 'visible', timeout: 1_000 })
    .then(() => true)
    .catch(() => false);
}

async function completeGoogleSignIn(page: Page, email: string, password: string): Promise<void> {
  const accountChoice = page.getByText(email, { exact: false }).first();
  if (await accountChoice.isVisible().catch(() => false)) {
    await accountChoice.click();
  } else {
    const googleEmail = firstVisible(page, [
      page.getByLabel(/email or phone/i),
      page.locator('input[type="email"]:visible'),
      page.locator('input[name="identifier"]:visible')
    ]);
    await googleEmail.first().fill(email);
    await page.getByRole('button', { name: /^next$/i }).click();
  }

  const googlePassword = firstVisible(page, [
    page.getByLabel(/^enter your password$/i),
    page.getByLabel(/^password$/i),
    page.locator('input[type="password"]:visible'),
    page.locator('input[name="Passwd"]:visible')
  ]);

  await waitForGooglePasswordOrBlock(page, googlePassword);
  await assertGoogleDidNotBlockAutomation(page);
  await googlePassword.first().fill(password);
  await page.getByRole('button', { name: /^next$/i }).click();

  await page
    .waitForURL((url) => !/accounts\.google\.com/i.test(url.hostname), { timeout: 45_000 })
    .catch(() => undefined);
}

async function waitForGooglePasswordOrBlock(page: Page, passwordLocator: Locator): Promise<void> {
  const blocked = googleBlockedMessage(page);

  await Promise.race([
    passwordLocator.first().waitFor({ state: 'visible', timeout: 20_000 }),
    blocked.first().waitFor({ state: 'visible', timeout: 20_000 })
  ]).catch(() => undefined);
}

async function assertGoogleDidNotBlockAutomation(page: Page): Promise<void> {
  const blocked = googleBlockedMessage(page);
  if (await blocked.first().isVisible().catch(() => false)) {
    throw new AuthBlockedError(
      'Google OAuth blocked the automated browser. Use AUTH_STORAGE_STATE, a non-Google test login, or an auth bypass for full authenticated smoke.'
    );
  }
}

function googleBlockedMessage(page: Page): Locator {
  return page.getByText(/couldn.t sign you in|browser or app may not be secure|try using a different browser/i);
}

async function clickSubmit(page: Page, selector?: string): Promise<void> {
  const locators = [
    selector ? page.locator(selector) : page.locator('__never__'),
    page.locator('button[type="submit"]'),
    page.getByRole('button', { name: /^(sign in|log in|login|continue|submit)$/i })
  ];

  for (const locator of locators) {
    const target = locator.first();
    if (await target.isVisible().catch(() => false)) {
      await target.click();
      return;
    }
  }

  throw new Error('Could not find a visible login submit button.');
}

async function clickNavigationIfPresent(page: Page, name: RegExp): Promise<void> {
  const target = firstVisible(page, [
    page.getByRole('link', { name }),
    page.getByRole('button', { name }),
    page.getByText(name)
  ]);

  if ((await target.count()) === 0) {
    return;
  }

  await target.first().click();
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

function firstVisible(page: Page, locators: Locator[]): Locator {
  return locators.reduce((current, next) => current.or(next));
}

function splitCsv(value?: string): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function env(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
