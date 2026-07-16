import { expect, test, type Page } from '@playwright/test';
import {
  dismissOnboardingIfPresent,
  hasCredentials,
  login,
  selectExistingOrganizationIfPresent,
  smokeConfig
} from '../support/smoke-config';

test.describe('YouTube source connection flows', () => {
  test('TC-SOURCE-013 YouTube source form accepts a handle and starts Google owner verification', async ({ page }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run source connection automation.');

    await openSources(page);
    await expectSourceManagement(page);

    const sourceInput = youtubeSourceInput(page);
    const verifyButton = page.getByRole('button', { name: /verify with google/i });

    await expect(verifyButton).toBeDisabled();
    await sourceInput.fill(source.handle);
    await expect(sourceInput).toHaveValue(source.handle);
    await expect(verifyButton).toBeEnabled();

    await Promise.all([
      page.waitForURL((url) => /accounts\.google\.com/i.test(url.hostname), { timeout: 30_000 }),
      verifyButton.click()
    ]);

    await expect(page).toHaveURL(/accounts\.google\.com/);
    await expect(page.getByText(/Sign in with Google/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Speedrun Labs' }).or(page.getByText(/Speedrun Labs/i)).first()).toBeVisible();
  });

  test('TC-SOURCE-014 Connected YouTube channel is active with crawl controls', async ({ page }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run connected source automation.');

    await openSources(page);
    await expectSourceManagement(page);

    await expect(page.getByText('Connected sources')).toBeVisible();
    await expect(page.getByText(source.handle).first()).toBeVisible();
    await expect(page.getByText('YouTube channel').first()).toBeVisible();
    await expect(page.getByText('Active', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Auto', { exact: true }).first()).toBeVisible();

    for (const action of [/Details/i, /Videos/i, /Run crawl/i, /Backfill/i]) {
      await expect(page.getByRole('button', { name: action }).first()).toBeVisible();
    }

    await expect(page.getByText('Pipeline')).toBeVisible();
    await expect(page.getByText(/RECENT RUNS/i)).toBeVisible();
  });
});

type YouTubeSource = {
  handle: string;
  url: string;
};

async function openSources(page: Page): Promise<void> {
  const config = smokeConfig();

  await login(page, config);
  await selectExistingOrganizationIfPresent(page);
  await dismissOnboardingIfPresent(page);

  await page.goto('/sources');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await dismissOnboardingIfPresent(page);
}

async function expectSourceManagement(page: Page): Promise<void> {
  await expect(page).toHaveURL(/\/sources$/);
  await expect(page.getByText('Source management')).toBeVisible();
  await expect(page.getByText('Connect a source')).toBeVisible();
  await expect(page.getByText('YouTube handle or channel URL')).toBeVisible();
}

function youtubeSourceInput(page: Page) {
  return page.locator('input[placeholder*="youtube.com"]').first();
}

function youtubeSource(): YouTubeSource {
  const url = process.env.SOURCE_YOUTUBE_URL || 'https://www.youtube.com/@namnguyen11993';
  const handle = process.env.SOURCE_YOUTUBE_HANDLE || handleFromUrl(url);

  return { handle, url };
}

function handleFromUrl(url: string): string {
  const match = url.match(/@[\w.-]+/);
  return match?.[0] || url;
}
