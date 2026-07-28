import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import {
  dismissOnboardingIfPresent,
  login,
  selectExistingOrganizationIfPresent,
  smokeConfig,
  type SmokeConfig
} from '../support/smoke-config';

test.describe('Home Overview dynamic workspace states', () => {
  test.describe('Empty workspace fixture', () => {
    test.describe.configure({ mode: 'serial' });

    let context: BrowserContext;
    let page: Page;

    test.beforeAll(async ({ browser }) => {
      test.skip(!canCreateEmptyFixture(), emptyFixtureConfigurationMessage());

      context = await browser.newContext({ baseURL: process.env.BASE_URL });
      page = await context.newPage();
      await createEmptyWorkspace(page);
    });

    test.afterAll(async () => {
      await context?.close();
    });

    test('TC-CONSOLE-027 Home Overview shows an honest empty workspace state', async () => {
      await openHome(page);

      await expect(page.getByRole('heading', { level: 1 })).toHaveText(/let.s get started/i);
      await expectOverviewCount(page, 'Sources', 0);
      await expectOverviewCount(page, 'Riffs', 0);
      await expectOverviewCount(page, 'Articles', 0);

      const siteCard = overviewCard(page, 'Site');
      await expect(siteCard).toContainText(/none|not set up yet/i);
      await expect(page.getByText('Next step')).toBeVisible();
      await expect(page.getByRole('heading', { name: /connect your first source/i })).toBeVisible();
      await expect(
        page.locator('a[href="/sources"]').filter({ hasText: /connect a source|open sources/i }).first()
      ).toBeVisible();

      await expect(page.getByRole('heading', { name: 'Recent content' })).toHaveCount(0);
      await expect(recentContentLinks(page)).toHaveCount(0);
    });

    test('TC-CONSOLE-032 Home Site empty state routes to site setup without changing Home status', async () => {
      await openHome(page);

      const siteStatusBefore = await overviewCard(page, 'Site').innerText();
      expect(siteStatusBefore).toMatch(/none|not set up yet/i);

      await Promise.all([
        page.waitForURL(/\/sites$/, { timeout: 15_000 }),
        overviewCard(page, 'Site').click()
      ]);
      await page.waitForLoadState('networkidle').catch(() => undefined);
      await dismissHomeOverlays(page);

      await expect(page.getByText(/start building from a template|get started|create your site/i).first()).toBeVisible();
      await expect(page.getByRole('link', { name: /template/i }).first()).toBeVisible();

      await openHome(page);
      expect(normalizeText(await overviewCard(page, 'Site').innerText())).toBe(normalizeText(siteStatusBefore));
    });
  });

  test.describe('Baohan completed-content fixture', () => {
    test.describe.configure({ mode: 'serial' });

    let context: BrowserContext;
    let page: Page;

    test.beforeAll(async ({ browser }) => {
      const config = homeDynamicConfig();
      test.skip(!config.email || !config.password, 'Set HOME_DYNAMIC_EMAIL/HOME_DYNAMIC_PASSWORD or SMOKE_EMAIL/SMOKE_PASSWORD.');

      context = await browser.newContext({ baseURL: config.baseURL });
      page = await context.newPage();
      await loginToPrimaryWorkspace(page, config);
    });

    test.afterAll(async () => {
      await context?.close();
    });

    test('TC-CONSOLE-030 Home promotes review when crawled content is ready', async () => {
      await openHome(page);

      await expect(page.getByRole('heading', { level: 1 })).toHaveText(/welcome back/i);
      expect(await overviewCount(page, 'Sources')).toBeGreaterThan(0);
      expect(await overviewCount(page, 'Riffs')).toBeGreaterThan(0);
      expect(await overviewCount(page, 'Articles')).toBe(0);

      await expect(page.getByText('Next step')).toBeVisible();
      await expect(page.getByRole('heading', { name: /review your crawled content/i })).toBeVisible();

      const reviewLink = page.getByRole('link', { name: /review content/i });
      await expect(reviewLink).toHaveAttribute('href', '/content');
      await expect(page.getByRole('heading', { name: 'Recent content' })).toBeVisible();

      const recent = recentContentLinks(page);
      expect(await recent.count()).toBeGreaterThan(0);
      await expect(recent.first()).toContainText(/\S+/);
      await expect(recent.first()).toContainText(/\w{3} \d{1,2}, \d{4}/);
    });

    test('TC-CONSOLE-034 Home published Site state matches the active workspace', async () => {
      await openHome(page);

      const summaryBefore = await readOverviewState(page);
      const siteCard = overviewCard(page, 'Site');
      const expectedHost = process.env.HOME_DYNAMIC_PUBLIC_HOST || 'baohan.apps.riffables.com';

      await expect(siteCard).toContainText(/published|live/i);
      await expect(siteCard).toContainText(expectedHost);

      await Promise.all([
        page.waitForURL(/\/sites$/, { timeout: 15_000 }),
        siteCard.click()
      ]);
      await page.waitForLoadState('networkidle').catch(() => undefined);

      await expect(page.getByRole('heading', { name: /manage & publish/i })).toBeVisible();
      await expect(page.getByText('Published', { exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: expectedHost })).toBeVisible();
      await expect(page.getByRole('link', { name: /view live/i })).toHaveAttribute(
        'href',
        new RegExp(`^https://${escapeRegExp(expectedHost)}/?$`)
      );

      await openHome(page);
      expect(await readOverviewState(page)).toEqual(summaryBefore);
    });

    test('TC-CONSOLE-035 Home metrics match Sources, Content, Articles, and Sites', async () => {
      await openHome(page);
      const homeState = await readOverviewState(page);

      await page.goto('/sources');
      await page.waitForLoadState('networkidle').catch(() => undefined);
      const connectedSourceCards = page.getByRole('heading').filter({ hasText: /YouTube channel/i });
      expect(await connectedSourceCards.count()).toBe(homeState.sources);

      await page.goto('/content');
      await page.waitForLoadState('networkidle').catch(() => undefined);
      const crawledSummary = await page.getByText(/Showing \d+ of \d+.*extracted.*with transcript/i).innerText();
      const crawledTotal = parseShowingTotal(crawledSummary);
      expect(crawledTotal).toBe(homeState.riffs);

      await page.getByRole('button', { name: 'Articles', exact: true }).click();
      const articleSummary = await page.getByText(/Showing \d+ of \d+.*published.*draft/i).innerText();
      const articleTotal = parseShowingTotal(articleSummary);
      expect(articleTotal).toBe(homeState.articles);

      await page.goto('/sites');
      await page.waitForLoadState('networkidle').catch(() => undefined);
      if (/published|live/i.test(homeState.site)) {
        await expect(page.getByText('Published', { exact: true })).toBeVisible();
      } else {
        await expect(page.getByText(/start building from a template|get started|draft|unpublished/i).first()).toBeVisible();
      }

      await openHome(page);
      await page.reload();
      await page.waitForLoadState('networkidle').catch(() => undefined);
      await dismissHomeOverlays(page);
      expect(await readOverviewState(page)).toEqual(homeState);
    });

    test('TC-CONSOLE-036 Home Recent content matches the latest Content rows', async () => {
      await openHome(page);

      const recentLinks = recentContentLinks(page);
      const recentCount = await recentLinks.count();
      expect(recentCount).toBeGreaterThanOrEqual(2);

      const recentRows = await readRecentRows(page);

      for (const row of recentRows) {
        expect(row.title, 'Each Recent content row should include a title').not.toBe('');
        expect(row.status, 'Each Recent content row should include a status').not.toBe('');
        expect(Date.parse(row.date), `Recent content date should be parseable: ${row.date}`).not.toBeNaN();
      }

      const recentDates = recentRows.map((row) => Date.parse(row.date));
      for (let index = 1; index < recentDates.length; index += 1) {
        expect(recentDates[index]).toBeLessThanOrEqual(recentDates[index - 1]);
      }

      const recentTitles = recentRows.map((row) => row.title);
      await page.goto('/content');
      await page.waitForLoadState('networkidle').catch(() => undefined);
      const contentHeadings = page.locator('h3');
      const contentTitles: string[] = [];
      for (let index = 0; index < (await contentHeadings.count()); index += 1) {
        const heading = contentHeadings.nth(index);
        const firstChild = heading.locator(':scope > *').first();
        contentTitles.push(
          normalizeText(
            (await firstChild.count()) > 0
              ? await firstChild.innerText()
              : await heading.innerText()
          )
        );
      }
      expect(recentTitles).toEqual(contentTitles.slice(0, recentTitles.length));

      await openHome(page);
      await Promise.all([
        page.waitForURL(/\/content$/, { timeout: 15_000 }),
        recentContentLinks(page).first().click()
      ]);
      await openHome(page);
      await Promise.all([
        page.waitForURL(/\/content$/, { timeout: 15_000 }),
        page.getByRole('link', { name: 'View all' }).click()
      ]);
    });

    test('TC-CONSOLE-038 Home data changes when switching workspace', async () => {
      test.fail(
        workspaceIsolationExpectedXfail(),
        'Current staging keeps Baohan Home metrics, site, and Recent content after switching to the second workspace.'
      );

      await openHome(page);
      const primaryState = await readOverviewState(page);
      const primaryRecentTitles = await recentContentTitles(page);

      try {
        await openWorkspaceMenu(page);
        const secondaryWorkspace = page
          .getByRole('dialog')
          .getByRole('button')
          .filter({ hasText: new RegExp(escapeRegExp(process.env.HOME_DYNAMIC_SECONDARY_WORKSPACE || 'Auto Workspace'), 'i') })
          .first();
        await expect(secondaryWorkspace).toBeVisible();
        await secondaryWorkspace.click();
        await page.waitForLoadState('networkidle').catch(() => undefined);

        await expect(page.getByRole('button', { name: 'Switch workspace' })).toContainText(
          process.env.HOME_DYNAMIC_SECONDARY_WORKSPACE || 'Auto Workspace'
        );

        const secondaryState = await readOverviewState(page);
        const secondaryRecentTitles = await recentContentTitles(page);
        expect(secondaryState).not.toEqual(primaryState);

        for (const title of primaryRecentTitles) {
          expect(secondaryRecentTitles).not.toContain(title);
        }
      } finally {
        await restorePrimaryWorkspace(page);
      }
    });
  });
});

type OverviewState = {
  sources: number;
  riffs: number;
  articles: number;
  site: string;
};

type RecentContentRow = {
  title: string;
  status: string;
  date: string;
};

type NewAccount = {
  name: string;
  email: string;
  password: string;
  organizationName: string;
  organizationSlug: string;
};

function homeDynamicConfig(): SmokeConfig {
  const config = smokeConfig();
  return {
    ...config,
    email: process.env.HOME_DYNAMIC_EMAIL || config.email,
    password: process.env.HOME_DYNAMIC_PASSWORD || config.password
  };
}

async function loginToPrimaryWorkspace(page: Page, config: SmokeConfig): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => undefined);

  if (page.url().includes(config.loginPath)) {
    await login(page, config);
  }

  await selectExistingOrganizationIfPresent(page);
  await dismissHomeOverlays(page);
  await openHome(page);
}

async function openHome(page: Page): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await dismissHomeOverlays(page);
  await expect(page).toHaveURL(/\/$/);
}

async function dismissHomeOverlays(page: Page): Promise<void> {
  const checklist = page
    .getByRole('dialog')
    .filter({ hasText: /connect a source/i })
    .filter({ hasText: /turn videos into riffs/i });
  if (await checklist.isVisible().catch(() => false)) {
    const close = checklist.getByRole('button', { name: /maybe later|close/i }).first();
    if (await close.isVisible().catch(() => false)) {
      await close.click();
    }
  }

  await dismissOnboardingIfPresent(page);
}

function overviewCard(page: Page, label: string) {
  const accessibleNamePatterns: Record<string, RegExp> = {
    Sources: /^Sources\s+\d+\s+connected$/i,
    Riffs: /^Riffs\s+\d+\s+extracted$/i,
    Articles: /^Articles\s+\d+\s+generated$/i,
    Site: /^Site\s+/i
  };
  const pattern = accessibleNamePatterns[label] || new RegExp(`^${escapeRegExp(label)}\\b`, 'i');
  return page.getByRole('link', { name: pattern }).first();
}

async function overviewCount(page: Page, label: string): Promise<number> {
  const text = await overviewCard(page, label).innerText();
  const match = text.match(/\b(\d+)\b/);
  if (!match) {
    throw new Error(`Could not parse ${label} count from Home card: ${text}`);
  }
  return Number(match[1]);
}

async function expectOverviewCount(page: Page, label: string, expected: number): Promise<void> {
  await expect(overviewCard(page, label)).toBeVisible();
  expect(await overviewCount(page, label)).toBe(expected);
}

async function readOverviewState(page: Page): Promise<OverviewState> {
  return {
    sources: await overviewCount(page, 'Sources'),
    riffs: await overviewCount(page, 'Riffs'),
    articles: await overviewCount(page, 'Articles'),
    site: normalizeText(await overviewCard(page, 'Site').innerText())
  };
}

function recentContentLinks(page: Page) {
  return page.locator('main ul a[href="/content"]');
}

async function recentContentTitles(page: Page): Promise<string[]> {
  return (await readRecentRows(page)).map((row) => row.title);
}

async function readRecentRows(page: Page): Promise<RecentContentRow[]> {
  const links = recentContentLinks(page);
  const rows: RecentContentRow[] = [];

  for (let index = 0; index < (await links.count()); index += 1) {
    const directChildren = links.nth(index).locator(':scope > *');
    const metadata = directChildren.nth(1).locator(':scope > *');
    rows.push({
      title: normalizeText(await directChildren.nth(0).innerText()),
      status: normalizeText(await metadata.nth(0).innerText()),
      date: normalizeText(await metadata.nth(1).innerText())
    });
  }

  return rows;
}

function parseShowingTotal(summary: string): number {
  const match = summary.match(/Showing\s+\d+\s+of\s+(\d+)/i);
  if (!match) {
    throw new Error(`Could not parse total from summary: ${summary}`);
  }
  return Number(match[1]);
}

async function openWorkspaceMenu(page: Page): Promise<void> {
  const switcher = page.getByRole('button', { name: 'Switch workspace' });
  await switcher.click();
  await expect(page.getByRole('dialog').getByText('Workspaces', { exact: true })).toBeVisible();
}

async function restorePrimaryWorkspace(page: Page): Promise<void> {
  await openHome(page);
  const switcher = page.getByRole('button', { name: 'Switch workspace' });
  const secondaryName = process.env.HOME_DYNAMIC_SECONDARY_WORKSPACE || 'Auto Workspace';

  if (!(await switcher.innerText()).includes(secondaryName)) {
    return;
  }

  await openWorkspaceMenu(page);
  const primaryWorkspace = page
    .getByRole('dialog')
    .getByRole('button')
    .filter({ hasText: /\/12/ })
    .first();
  await expect(primaryWorkspace).toBeVisible();
  await primaryWorkspace.click();
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

function workspaceIsolationExpectedXfail(): boolean {
  return (process.env.HOME_WORKSPACE_ISOLATION_EXPECTED_XFAIL || 'true').toLowerCase() === 'true';
}

function canCreateEmptyFixture(): boolean {
  return Boolean(
    process.env.HOME_SIGNUP_EMAIL_PREFIX &&
      process.env.HOME_SIGNUP_EMAIL_DOMAIN &&
      process.env.HOME_SIGNUP_PASSWORD
  );
}

function emptyFixtureConfigurationMessage(): string {
  return 'Set HOME_SIGNUP_EMAIL_PREFIX, HOME_SIGNUP_EMAIL_DOMAIN, and HOME_SIGNUP_PASSWORD.';
}

async function createEmptyWorkspace(page: Page): Promise<void> {
  const account = newEmptyAccount();

  await page.goto('/sign-in');
  await page.getByRole('button', { name: 'Create an account' }).click();
  await page.locator('input[type="text"]').fill(account.name);
  await page.locator('input[type="email"]').fill(account.email);
  await page.locator('button[type="submit"]').click();
  await expect(page.getByText(new RegExp(escapeRegExp(account.email), 'i'))).toBeVisible();
  await page.locator('input[type="password"]').fill(account.password);
  await submitCreateAccountWithRateLimitRetry(page);

  await expect(page).toHaveURL(/\/setup-organization/);
  const textInputs = page.locator('input[type="text"]');
  await textInputs.nth(0).fill(account.organizationName);
  await textInputs.nth(1).fill(account.organizationSlug);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes('/setup-organization'), { timeout: 20_000 }),
    page.getByRole('button', { name: 'Create organization' }).click()
  ]);
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await dismissHomeOverlays(page);
  await openHome(page);
}

async function submitCreateAccountWithRateLimitRetry(page: Page): Promise<void> {
  const submitButton = page.locator('button[type="submit"]');
  const rateLimitMessage = page.getByText(/too many requests/i);
  const delays = [0, 15_000, 30_000];

  for (const delay of delays) {
    if (delay > 0) {
      await page.waitForTimeout(delay);
    }

    await submitButton.click();
    const reachedSetup = await page
      .waitForURL(/\/setup-organization/, { timeout: 15_000 })
      .then(() => true)
      .catch(() => false);
    if (reachedSetup) {
      return;
    }

    if (!(await rateLimitMessage.isVisible().catch(() => false))) {
      break;
    }
  }

  await expect(page).toHaveURL(/\/setup-organization/);
}

function newEmptyAccount(): NewAccount {
  const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const prefix = process.env.HOME_SIGNUP_EMAIL_PREFIX || '';
  const domain = process.env.HOME_SIGNUP_EMAIL_DOMAIN || '';
  return {
    name: `Home Empty ${uniqueId}`,
    email: `${prefix}homeempty${uniqueId}@${domain}`,
    password: process.env.HOME_SIGNUP_PASSWORD || '',
    organizationName: `Home Empty ${uniqueId}`,
    organizationSlug: `home-empty-${uniqueId}`
  };
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
