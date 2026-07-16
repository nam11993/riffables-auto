import { expect, test } from '@playwright/test';

test.describe('Setup organization flows', () => {
  test('TC-AUTH-044 existing creator reaches setup organization selector after login', async ({ page }) => {
    const { email, password } = getExistingCreatorCredentials();

    test.skip(!email || !password, 'Set SETUP_EXISTING_EMAIL and SETUP_EXISTING_PASSWORD to run setup organization selection automation.');

    await signIn(page, email!, password!);
    await ensureSetupOrganizationPage(page);

    await expectSetupOrganizationShell(page);
    await expect(page.getByText('Select an organization')).toBeVisible();
    await expect(existingOrganizationSelectButton(page)).toBeVisible();
    await expect(page.getByText('Create a new organization')).toBeVisible();
  });

  test('TC-AUTH-045 existing creator can select an existing organization', async ({ page }) => {
    const { email, password } = getExistingCreatorCredentials();

    test.skip(!email || !password, 'Set SETUP_EXISTING_EMAIL and SETUP_EXISTING_PASSWORD to run setup organization selection automation.');

    await signIn(page, email!, password!);
    await ensureSetupOrganizationPage(page);
    await expectSetupOrganizationShell(page);

    await Promise.all([
      page.waitForURL((url) => !url.pathname.includes('/setup-organization'), { timeout: 20_000 }),
      existingOrganizationSelectButton(page).click()
    ]);
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissOnboardingIfPresent(page);

    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Sources' })).toBeVisible();
    await expect(page.getByText(/overview|connect your sources/i).first()).toBeVisible();
  });

  test.describe.serial('New creator setup organization form', () => {
    test('TC-AUTH-046 setup organization disables blank submit and auto-generates slug from name', async ({ page }) => {
      const account = getNewCreatorAccount('blank');

      test.slow();
      test.skip(!account.password || !account.emailPrefix || !account.emailDomain, 'Set SETUP_SIGNUP_EMAIL_PREFIX, SETUP_SIGNUP_EMAIL_DOMAIN, and SETUP_SIGNUP_PASSWORD to run setup organization creation automation.');

      await createAccountAndReachSetup(page, account);

      const inputs = organizationInputs(page);
      const createButton = page.getByRole('button', { name: 'Create organization' });

      await expect(createButton).toBeDisabled();

      await inputs.name.fill('Auto Generated Slug Org');
      await expect(inputs.slug).toHaveValue('auto-generated-slug-org');
      await expect(createButton).toBeEnabled();

      await inputs.name.clear();
      await expect(createButton).toBeDisabled();
    });

    test('TC-AUTH-047 setup organization rejects invalid organization slug format', async ({ page }) => {
      const account = getNewCreatorAccount('badslug');

      test.slow();
      test.skip(!account.password || !account.emailPrefix || !account.emailDomain, 'Set SETUP_SIGNUP_EMAIL_PREFIX, SETUP_SIGNUP_EMAIL_DOMAIN, and SETUP_SIGNUP_PASSWORD to run setup organization slug automation.');

      await createAccountAndReachSetup(page, account);

      const inputs = organizationInputs(page);
      const createButton = page.getByRole('button', { name: 'Create organization' });

      await inputs.name.fill('Invalid Slug Org');
      await inputs.slug.fill('Bad Slug !@#');

      await expect(page.getByText(/use lowercase letters, numbers, and single dashes only/i)).toBeVisible();
      await expect(createButton).toBeDisabled();
      await expect(page).toHaveURL(/\/setup-organization/);
    });

    test('TC-AUTH-048 new creator can create an organization and land on dashboard', async ({ page }) => {
      const account = getNewCreatorAccount('create');

      test.slow();
      test.skip(!account.password || !account.emailPrefix || !account.emailDomain, 'Set SETUP_SIGNUP_EMAIL_PREFIX, SETUP_SIGNUP_EMAIL_DOMAIN, and SETUP_SIGNUP_PASSWORD to run setup organization creation automation.');

      await createAccountAndReachSetup(page, account);

      const orgName = `Auto Org ${account.uniqueId}`;
      const orgSlug = `auto-org-${account.uniqueId.toLowerCase()}`;
      const inputs = organizationInputs(page);

      await inputs.name.fill(orgName);
      await inputs.slug.fill(orgSlug);

      await Promise.all([
        page.waitForURL((url) => !url.pathname.includes('/setup-organization'), { timeout: 20_000 }),
        page.getByRole('button', { name: 'Create organization' }).click()
      ]);
      await page.waitForLoadState('networkidle').catch(() => undefined);
      await dismissOnboardingIfPresent(page);

      await expect(page.getByText(orgName, { exact: false })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Sources' })).toBeVisible();
      await expect(page.getByText(/overview|connect your sources/i).first()).toBeVisible();
    });
  });
});

type NewCreatorAccount = {
  name: string;
  email: string;
  password?: string;
  emailPrefix?: string;
  emailDomain?: string;
  uniqueId: string;
};

async function signIn(page: import('@playwright/test').Page, email: string, password: string): Promise<void> {
  await page.goto('/sign-in');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

async function createAccountAndReachSetup(page: import('@playwright/test').Page, account: NewCreatorAccount): Promise<void> {
  await page.goto('/sign-in');
  await page.getByRole('button', { name: 'Create an account' }).click();

  await expect(page.getByText('Create your account')).toBeVisible();
  await page.locator('input[type="text"]').fill(account.name);
  await page.locator('input[type="email"]').fill(account.email);
  await page.locator('button[type="submit"]').click();

  await expect(page.getByText(new RegExp(escapeRegExp(account.email), 'i'))).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await page.locator('input[type="password"]').fill(account.password!);
  await submitCreateAccountWithRateLimitRetry(page);
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await expectSetupOrganizationShell(page);
  await expect(page.getByText(/no organizations found for this account/i)).toBeVisible();
}

async function submitCreateAccountWithRateLimitRetry(page: import('@playwright/test').Page): Promise<void> {
  const submitButton = page.locator('button[type="submit"]');
  const rateLimitMessage = page.getByText(/too many requests/i);
  const delays = [0, 15_000, 30_000];

  for (let attempt = 0; attempt < delays.length; attempt += 1) {
    if (delays[attempt] > 0) {
      await page.waitForTimeout(delays[attempt]);
    }

    await submitButton.click();

    const reachedSetup = await page.waitForURL(/\/setup-organization/, { timeout: 15_000 }).then(() => true).catch(() => false);
    if (reachedSetup) {
      return;
    }

    if (!(await rateLimitMessage.isVisible().catch(() => false))) {
      break;
    }
  }

  await expect(page).toHaveURL(/\/setup-organization/);
}

async function ensureSetupOrganizationPage(page: import('@playwright/test').Page): Promise<void> {
  if (!page.url().includes('/setup-organization')) {
    await page.goto('/setup-organization');
    await page.waitForLoadState('networkidle').catch(() => undefined);
  }
}

async function expectSetupOrganizationShell(page: import('@playwright/test').Page): Promise<void> {
  await expect(page).toHaveURL(/\/setup-organization/);
  await expect(page.getByText('Set up your organization.')).toBeVisible();
  await expect(page.getByText('Your audience library lives here.')).toBeVisible();
  await expect(page.getByText('Create a new organization')).toBeVisible();
  await expect(page.locator('input[type="text"]').nth(0)).toBeVisible();
  await expect(page.locator('input[type="text"]').nth(1)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
}

function organizationInputs(page: import('@playwright/test').Page): { name: import('@playwright/test').Locator; slug: import('@playwright/test').Locator } {
  const inputs = page.locator('input[type="text"]');
  return {
    name: inputs.nth(0),
    slug: inputs.nth(1)
  };
}

function existingOrganizationSelectButton(page: import('@playwright/test').Page): import('@playwright/test').Locator {
  return page.locator('button').filter({ hasText: /Select$/ }).first();
}

async function dismissOnboardingIfPresent(page: import('@playwright/test').Page): Promise<void> {
  const seenBefore = page.getByRole('button', { name: /I've been here before|Close/i });
  if (await seenBefore.first().isVisible().catch(() => false)) {
    await seenBefore.first().click();
    await page.getByText(/first time in riffables/i).waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
  }
}

function getExistingCreatorCredentials(): { email?: string; password?: string } {
  return {
    email: process.env.SETUP_EXISTING_EMAIL || process.env.SMOKE_EMAIL,
    password: process.env.SETUP_EXISTING_PASSWORD || process.env.SMOKE_PASSWORD
  };
}

function getNewCreatorAccount(label: string): NewCreatorAccount {
  const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const emailPrefix = process.env.SETUP_SIGNUP_EMAIL_PREFIX;
  const emailDomain = process.env.SETUP_SIGNUP_EMAIL_DOMAIN;
  return {
    name: `Setup ${label} ${uniqueId}`,
    email: emailPrefix && emailDomain ? `${emailPrefix}${label}${uniqueId}@${emailDomain}` : '',
    password: process.env.SETUP_SIGNUP_PASSWORD || process.env.SIGNUP_PASSWORD,
    emailPrefix,
    emailDomain,
    uniqueId
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
