import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import {
  dismissOnboardingIfPresent,
  hasCredentials,
  login,
  selectExistingOrganizationIfPresent,
  smokeConfig
} from '../support/smoke-config';

test.describe('Home console flows', () => {
  test.describe('Existing account Home Overview', () => {
    test.describe.configure({ mode: 'serial' });

    let context: BrowserContext;
    let page: Page;

    test.beforeAll(async ({ browser }) => {
      const config = smokeConfig();
      test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run Home console automation.');

      context = await browser.newContext({ baseURL: config.baseURL });
      page = await context.newPage();
      await openHome(page);
    });

    test.afterAll(async () => {
      await context?.close();
    });

    test('TC-CONSOLE-003 home dashboard links reach main creator workflows and return home', async () => {
      await openHome(page);
      await expectHomeDashboard(page);

      await expect(page.locator('a[href="/sources"]').filter({ hasText: /SOURCES/i }).first()).toBeVisible();
      await expect(page.locator('a[href="/content"]').filter({ hasText: /RIFFS/i }).first()).toBeVisible();
      await expect(page.locator('a[href="/content"]').filter({ hasText: /ARTICLES/i }).first()).toBeVisible();
      await expect(page.locator('a[href="/sites"]').filter({ hasText: /SITE/i }).first()).toBeVisible();
      await expect(page.locator('a[href="/sources"]').filter({ hasText: /open sources|connect a source/i }).first()).toBeVisible();

      for (const section of mainSections()) {
        if (section.path === '/') {
          continue;
        }

        await page.getByRole('navigation').getByRole('link', { name: section.navName }).click();
        await page.waitForLoadState('networkidle').catch(() => undefined);
        await dismissOnboardingIfPresent(page);
        await expect(page).toHaveURL(section.urlPattern);
        await expect(page.getByText(section.identityText).first()).toBeVisible();

        await page.getByRole('navigation').getByRole('link', { name: 'Home' }).click();
        await page.waitForLoadState('networkidle').catch(() => undefined);
        await expectHomeDashboard(page);
      }
    });

    test('TC-CONSOLE-009 top-level console sections remain identifiable after refresh', async () => {
      await openHome(page);

      for (const section of mainSections()) {
        await page.goto(section.path);
        await page.waitForLoadState('networkidle').catch(() => undefined);
        await dismissOnboardingIfPresent(page);

        await expect(page).toHaveURL(section.urlPattern);
        await expect(page.getByRole('navigation').getByRole('link', { name: section.navName })).toBeVisible();
        await expect(page.getByText(section.identityText).first()).toBeVisible();

        await page.reload();
        await page.waitForLoadState('networkidle').catch(() => undefined);
        await dismissOnboardingIfPresent(page);

        await expect(page).toHaveURL(section.urlPattern);
        await expect(page.getByText(section.identityText).first()).toBeVisible();
        await expect(page).not.toHaveURL(/\/sign-in/);
      }
    });

    test('TC-A11Y-005 dashboard screens have one visible h1 and ordered headings', async () => {
      await openHome(page);

      for (const section of mainSections()) {
        await page.goto(section.path);
        await page.waitForLoadState('networkidle').catch(() => undefined);
        await dismissOnboardingIfPresent(page);

        await expect(page.locator('h1:visible')).toHaveCount(1);
        const headingLevels = await page.locator('h1:visible, h2:visible, h3:visible').evaluateAll((elements) =>
          elements.map((element) => Number(element.tagName.replace('H', '')))
        );

        expect(headingLevels.length, `${section.path} should have visible headings`).toBeGreaterThan(0);
        expect(headingLevels[0], `${section.path} should start with h1`).toBe(1);

        for (let index = 1; index < headingLevels.length; index += 1) {
          const previous = headingLevels[index - 1];
          const current = headingLevels[index];
          expect(current - previous, `${section.path} heading level should not skip`).toBeLessThanOrEqual(1);
        }
      }
    });

    test('TC-CONSOLE-023 Home Overview summary modules show workspace status', async () => {
      await openHome(page);
      await expectHomeDashboard(page);

      for (const card of overviewCards()) {
        const link = overviewCardLink(page, card);
        await expect(link).toBeVisible();
        await expect(link).toContainText(card.labelPattern);
        await expect(link).toContainText(card.statusPattern);
      }
    });

    test('TC-CONSOLE-024 Home Overview summary modules navigate to their target pages', async () => {
      for (const card of overviewCards()) {
        await openHome(page);

        const link = overviewCardLink(page, card);
        await expect(link).toBeVisible();

        await Promise.all([
          page.waitForURL(card.urlPattern, { timeout: 15_000 }),
          link.click()
        ]);
        await page.waitForLoadState('networkidle').catch(() => undefined);
        await dismissOnboardingIfPresent(page);

        await expect(page).toHaveURL(card.urlPattern);
        await expect(page.getByText(card.identityText).first()).toBeVisible();
        await expect(page).not.toHaveURL(/\/sign-in/);
      }
    });

    test('TC-CONSOLE-025 Home Next step CTA routes to the recommended Sources workflow', async () => {
      await openHome(page);

      await expect(page.getByText('Next step')).toBeVisible();
      await expect(page.getByRole('heading', { name: /connect your first source|run your first crawl/i })).toBeVisible();

      const nextStepLink = page.locator('a[href="/sources"]').filter({ hasText: /open sources|connect a source/i }).first();
      await expect(nextStepLink).toBeVisible();

      await Promise.all([
        page.waitForURL(/\/sources$/, { timeout: 15_000 }),
        nextStepLink.click()
      ]);
      await page.waitForLoadState('networkidle').catch(() => undefined);

      await expect(page.getByText(/Source management|Sources/i).first()).toBeVisible();
      await expect(page).not.toHaveURL(/\/sign-in/);
    });

    test('TC-CONSOLE-026 Home How it works sequence explains the core workflow', async () => {
      await openHome(page);

      await expect(page.getByRole('heading', { name: 'How it works' })).toBeVisible();
      const mainText = await page.locator('main').innerText();
      expect(mainText).toMatch(/How it works[\s\S]*1[\s\S]*Connect a source[\s\S]*2[\s\S]*Riffables extracts the ideas[\s\S]*3[\s\S]*Publish your site/i);
      expect(mainText).toMatch(/YouTube, Spotify, or a blog/i);
      expect(mainText).toMatch(/quotes, and citations/i);
      expect(mainText).toMatch(/A searchable library/i);
    });
  });

  test('TC-ONBOARD-007 first authenticated Home visit asks whether user is new', async ({ page }) => {
    const account = getNewHomeAccount('onboard');

    test.slow();
    test.skip(!account.password || !account.emailPrefix || !account.emailDomain, 'Set HOME_SIGNUP_EMAIL_PREFIX, HOME_SIGNUP_EMAIL_DOMAIN, and HOME_SIGNUP_PASSWORD to run Home onboarding automation.');

    await createAccountAndReachSetup(page, account);

    const orgName = `Home Onboard ${account.uniqueId}`;
    const orgSlug = `home-onboard-${account.uniqueId.toLowerCase()}`;
    const inputs = page.locator('input[type="text"]');

    await inputs.nth(0).fill(orgName);
    await inputs.nth(1).fill(orgSlug);
    await Promise.all([
      page.waitForURL((url) => !url.pathname.includes('/setup-organization'), { timeout: 20_000 }),
      page.getByRole('button', { name: 'Create organization' }).click()
    ]);
    await page.waitForLoadState('networkidle').catch(() => undefined);

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText(/first time in riffables/i)).toBeVisible();
    await expect(page.getByText(/new here/i)).toBeVisible();
    await expect(page.getByRole('button', { name: "I've been here before" })).toBeVisible();
    await expect(page.getByRole('button', { name: /show me around/i })).toBeVisible();
  });
});

type Section = {
  path: string;
  navName: string;
  urlPattern: RegExp;
  identityText: RegExp;
};

type OverviewCard = {
  labelPattern: RegExp;
  statusPattern: RegExp;
  href: string;
  urlPattern: RegExp;
  identityText: RegExp;
};

type NewHomeAccount = {
  name: string;
  email: string;
  password?: string;
  emailPrefix?: string;
  emailDomain?: string;
  uniqueId: string;
};

async function openHome(page: Page): Promise<void> {
  const config = smokeConfig();

  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => undefined);

  if (page.url().includes(config.loginPath)) {
    await login(page, config);
  }

  await selectExistingOrganizationIfPresent(page);
  await dismissOnboardingIfPresent(page);

  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await dismissOnboardingIfPresent(page);
}

async function expectHomeDashboard(page: Page): Promise<void> {
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('Overview')).toBeVisible();
  await expect(page.locator('h1:visible')).toHaveText(/let.s get started/i);
  await expect(page.getByText(/connect your sources, let riffables pull out the ideas/i)).toBeVisible();
  await expect(page.getByText('How it works')).toBeVisible();
}

function mainSections(): Section[] {
  return [
    { path: '/', navName: 'Home', urlPattern: /\/$/, identityText: /Overview|Let.s get started/i },
    { path: '/sources', navName: 'Sources', urlPattern: /\/sources$/, identityText: /Source management|Sources/i },
    { path: '/content', navName: 'Content', urlPattern: /\/content$/, identityText: /Content management|Crawled content/i },
    { path: '/sites', navName: 'Site', urlPattern: /\/sites$/, identityText: /Get started|Start building from a template/i }
  ];
}

function overviewCards(): OverviewCard[] {
  return [
    {
      labelPattern: /Sources/i,
      statusPattern: /connected/i,
      href: '/sources',
      urlPattern: /\/sources$/,
      identityText: /Source management|Sources/i
    },
    {
      labelPattern: /Riffs/i,
      statusPattern: /extracted/i,
      href: '/content',
      urlPattern: /\/content$/,
      identityText: /Content management|Crawled content/i
    },
    {
      labelPattern: /Articles/i,
      statusPattern: /generated/i,
      href: '/content',
      urlPattern: /\/content$/,
      identityText: /Content management|Crawled content/i
    },
    {
      labelPattern: /Site/i,
      statusPattern: /none|not set up yet|draft|live|published|unpublished/i,
      href: '/sites',
      urlPattern: /\/sites$/,
      identityText: /Get started|Start building from a template|Site/i
    }
  ];
}

function overviewCardLink(page: Page, card: OverviewCard) {
  return page
    .locator(`a[href="${card.href}"]`)
    .filter({ hasText: card.labelPattern })
    .filter({ hasText: card.statusPattern })
    .first();
}

async function createAccountAndReachSetup(page: Page, account: NewHomeAccount): Promise<void> {
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
  await expect(page).toHaveURL(/\/setup-organization/);
}

async function submitCreateAccountWithRateLimitRetry(page: Page): Promise<void> {
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

function getNewHomeAccount(label: string): NewHomeAccount {
  const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const emailPrefix = process.env.HOME_SIGNUP_EMAIL_PREFIX || process.env.SETUP_SIGNUP_EMAIL_PREFIX;
  const emailDomain = process.env.HOME_SIGNUP_EMAIL_DOMAIN || process.env.SETUP_SIGNUP_EMAIL_DOMAIN;
  return {
    name: `Home ${label} ${uniqueId}`,
    email: emailPrefix && emailDomain ? `${emailPrefix}${label}${uniqueId}@${emailDomain}` : '',
    password: process.env.HOME_SIGNUP_PASSWORD || process.env.SETUP_SIGNUP_PASSWORD || process.env.SIGNUP_PASSWORD,
    emailPrefix,
    emailDomain,
    uniqueId
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
