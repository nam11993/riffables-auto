import { expect, test, type Locator, type Page } from '@playwright/test';
import {
  dismissOnboardingIfPresent,
  hasCredentials,
  login,
  selectExistingOrganizationIfPresent,
  smokeConfig
} from '../support/smoke-config';

test.describe('YouTube source connection flows', () => {
  test('TC-SOURCE-001 TC-SOURCE-007 Sources workflow exposes supported source choices', async ({ page }) => {
    const config = smokeConfig();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run source workflow automation.');

    await openSources(page);
    await expectSourceManagement(page);

    for (const choice of config.sourceExpectedChoices) {
      await expect(page.getByText(choice, { exact: true }).first()).toBeVisible();
    }

    await expect(page.getByText(/Ready to crawl/i).first()).toBeVisible();
    for (const futureType of futureSourceTypes) {
      await expect(futureSourceTypeCard(page, futureType), `${futureType} should be marked unavailable`).toContainText(
        /Crawling soon/i
      );
    }

    await expect(youtubeSourceInput(page)).toBeVisible();
    await expect(verifyWithGoogleButton(page)).toBeDisabled();
    await expect(page.getByRole('button', { name: /Auto crawl/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Manual selection/i })).toBeVisible();
  });

  test('TC-SOURCE-023 Empty source workspace shows first-source state and no ingestion runs', async ({ page }) => {
    const config = smokeConfig();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run empty source workspace automation.');

    await openSources(page);
    await expectSourceManagement(page);

    test.skip(
      !(await isEmptySourceWorkspace(page)),
      'This testcase requires a workspace with no connected source. Use a fresh/no-source QA account.'
    );

    await expect(page.getByText('Connected sources')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Connect your first source' })).toBeVisible();
    await expect(page.getByText(/Add a YouTube channel to start crawling content into this organization/i)).toBeVisible();
    await expect(page.getByText('Pipeline')).toBeVisible();
    await expect(page.getByText(/RECENT RUNS/i)).toBeVisible();
    await expect(page.getByText(/No ingestion runs yet/i)).toBeVisible();
  });

  test('TC-SOURCE-014 Connected YouTube channel is active with crawl controls', async ({ page }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run connected source automation.');

    await openSources(page);
    await expectSourceManagement(page);

    test.skip(
      !(await hasConnectedSource(page, source.handle)),
      `This testcase requires connected source fixture ${source.handle}. Use a connected-source QA account.`
    );

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

  test('TC-SOURCE-024 TC-SOURCE-039 @connected-no-data Connected Auto source card and pipeline are visible before crawl data exists', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run connected source automation.');

    await openConnectedSources(page, source.handle);
    await expectConnectedSource(page, source.handle);

    await expect(page.getByText('Created', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Last run', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Last error', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /^Delete$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Switch to manual$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Schedule$/ })).toBeVisible();
    await expect(page.getByText('Force rerun', { exact: true })).toBeVisible();
    await expect(backfillSinceInput(page)).toBeVisible();
    await expect(backfillLimitInput(page)).toBeVisible();

    await expect(page.getByText('Pipeline', { exact: true })).toBeVisible();
    for (const queueName of ['Crawl', 'Transcribe', 'Extract', 'Embed']) {
      await expect(page.getByText(queueName, { exact: true }).first()).toBeVisible();
    }
    await expect(page.getByText(/active/i).first()).toBeVisible();
    await expect(page.getByText(/waiting/i).first()).toBeVisible();
    await expect(page.getByText(/failed/i).first()).toBeVisible();
    await expect(page.getByText(/Recent runs/i)).toBeVisible();
  });

  test('TC-SOURCE-025 @connected-no-data Source Details modal shows scoped diagnostic metadata', async ({ page }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run source details automation.');

    await openConnectedSources(page, source.handle);
    await page.getByRole('button', { name: /^Details$/ }).click();

    const dialog = sourceDialog(page);
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('YouTube channel');
    await expect(dialog).toContainText(source.handle);
    await expect(dialog).toContainText(/Source ID/i);
    await expect(dialog).toContainText(/Type/i);
    await expect(dialog).toContainText(/Status/i);
    await expect(dialog).toContainText(/Created/i);
    await expect(dialog).toContainText(/Updated/i);
    await expect(dialog).toContainText(/Last run/i);
    await expect(dialog).toContainText(/Last error/i);
    await expect(dialog).toContainText(/Backend config/i);

    await closeVisibleDialog(page);
    await expect(page).toHaveURL(/\/sources$/);
    await expect(page.getByText(source.handle).first()).toBeVisible();
  });

  test('TC-SOURCE-026 @connected-no-data Details modal View crawled content keeps tenant context', async ({ page }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run source details navigation automation.');

    await openConnectedSources(page, source.handle);
    await page.getByRole('button', { name: /^Details$/ }).click();

    const dialog = sourceDialog(page);
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(source.handle);

    const viewCrawledContent = dialog.getByRole('button', { name: /View crawled content/i }).or(
      dialog.getByRole('link', { name: /View crawled content/i })
    );
    test.skip((await viewCrawledContent.count()) === 0, 'Details modal does not expose View crawled content in this build.');

    await Promise.all([
      page.waitForURL((url) => /\/content/i.test(url.pathname), { timeout: 15_000 }),
      viewCrawledContent.first().click()
    ]);
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissOnboardingIfPresent(page);

    await expect(page).toHaveURL(/\/content/);
    await expect(page.getByText(/Content|Crawled content|Riffs|Articles/i).first()).toBeVisible();

    await page.goto('/sources');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissOnboardingIfPresent(page);
    await expect(page.getByText(source.handle).first()).toBeVisible();
  });

  test('TC-SOURCE-031 @connected-no-data Schedule modal exposes recurring crawl cadence options and closes without creating a schedule', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run schedule modal automation.');

    await openConnectedSources(page, source.handle);
    const beforeText = await sourceScreenText(page);

    await page.getByRole('button', { name: /^Schedule$/ }).click();
    const dialog = sourceDialog(page);
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(/Recurring crawl/i);
    await expect(dialog).toContainText(source.handle);
    for (const cadence of ['Every hour', 'Every 6 hours', 'Every 12 hours', 'Daily (3:00)', 'Weekly (Mon 3:00)']) {
      await expect(dialog.getByRole('button', { name: cadence })).toBeVisible();
    }
    await expect(dialog.getByRole('button', { name: /^Create schedule$/ })).toBeVisible();

    await closeVisibleDialog(page);
    await expect(page).toHaveURL(/\/sources$/);
    await expect(await sourceScreenText(page)).toContain(source.handle);
    await expect(await sourceScreenText(page)).toContain('Pipeline');
    expect(await sourceRunCount(page)).toBe(await runCountFromText(beforeText));
  });

  test('TC-SOURCE-036 TC-SOURCE-037 @connected-no-data Force rerun and backfill controls do not queue work without explicit run/backfill submit', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run force rerun/backfill control automation.');

    await openConnectedSources(page, source.handle);
    const beforeRunCount = await sourceRunCount(page);

    await expect(page.getByText('Force rerun', { exact: true })).toBeVisible();

    const since = backfillSinceInput(page);
    const limit = backfillLimitInput(page);
    await expect(since).toBeVisible();
    await expect(limit).toBeVisible();
    await limit.fill('0');
    await expect(limit).toHaveValue('0');
    await limit.fill('20');
    await expect(limit).toHaveValue('20');
    await expect(page.getByRole('button', { name: /^Backfill$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Run crawl$/ })).toBeVisible();

    expect(await sourceRunCount(page)).toBe(beforeRunCount);
    await expect(page.getByText(source.handle).first()).toBeVisible();
  });

  test('TC-SOURCE-040 @connected-no-data Page Refresh reloads visible state without changing connected source configuration', async ({ page }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run source refresh automation.');

    await openConnectedSources(page, source.handle);
    const before = await connectedSourceBaseline(page, source.handle);

    await page.getByRole('button', { name: /^Refresh$/ }).first().click();
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissOnboardingIfPresent(page);

    const after = await connectedSourceBaseline(page, source.handle);
    expect(after.handleVisible).toBe(true);
    expect(after.statusVisible).toBe(before.statusVisible);
    expect(after.modeVisible).toBe(before.modeVisible);
    expect(after.hasRunCrawl).toBe(before.hasRunCrawl);
    expect(after.hasBackfill).toBe(before.hasBackfill);
    expect(after.hasPipeline).toBe(true);
  });

  test('TC-SOURCE-041 TC-SOURCE-043 @connected-no-data Channel Videos panel handles empty catalog search and pagination without ingest', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run channel videos automation.');

    await openConnectedSources(page, source.handle);
    const beforeRunCount = await sourceRunCount(page);

    await page.getByRole('button', { name: /^Videos$/ }).click();
    const dialog = sourceDialog(page);
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(/Channel videos/i);
    await expect(dialog.getByRole('button', { name: /^Refresh$/ })).toBeVisible();
    await expect(dialog.getByPlaceholder('Search title')).toBeVisible();
    await expect(dialog.getByRole('button', { name: /^Prev$/ })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /^Next$/ })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /Ingest 0 selected/i })).toBeVisible();
    await expect(dialog).toContainText(/0 videos|No videos|partial|1 \/ 1/i);

    await dialog.getByPlaceholder('Search title').fill('no matching title');
    await expect(dialog.getByPlaceholder('Search title')).toHaveValue('no matching title');
    await expect(dialog.getByRole('button', { name: /Ingest 0 selected/i })).toBeVisible();

    const next = dialog.getByRole('button', { name: /^Next$/ });
    if (await next.isEnabled().catch(() => false)) {
      await next.click();
      await expect(dialog).toContainText(/Channel videos/i);
    }
    const prev = dialog.getByRole('button', { name: /^Prev$/ });
    if (await prev.isEnabled().catch(() => false)) {
      await prev.click();
      await expect(dialog).toContainText(/Channel videos/i);
    }

    await closeVisibleDialog(page);
    expect(await sourceRunCount(page)).toBe(beforeRunCount);
    await expect(page.getByText(source.handle).first()).toBeVisible();
  });

  test('TC-SOURCE-034A @source-action-no-data Run crawl handles empty or no-eligible-data source state', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run source action automation.');
    test.skip(!sourceActionNoDataEnabled(), 'Set SOURCE_ACTION_NO_DATA=true to run action no-data source automation.');

    await openConnectedSources(page, source.handle);
    await expectConnectedSource(page, source.handle);
    await expectCatalogHasNoSelectedWork(page, source.handle);

    const beforeText = await sourceScreenText(page);
    expect(beforeText).toContain(source.handle);

    const runCrawl = page.getByRole('button', { name: /^Run crawl$/ });
    await expect(runCrawl).toBeVisible();
    await runCrawl.click();
    await waitForSourceActionFeedback(page);

    await expectSourceStillConnected(page, source.handle);
    const afterText = await sourceScreenText(page);
    expect(afterText).toContain(source.handle);
    expect(afterText).toMatch(/Last run|Last error|Pipeline|Recent runs/i);
    expectNoBrokenUiText(afterText);
  });

  test('TC-SOURCE-038A @source-action-no-data Backfill handles valid request with no matching data', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run source action automation.');
    test.skip(!sourceActionNoDataEnabled(), 'Set SOURCE_ACTION_NO_DATA=true to run action no-data source automation.');

    await openConnectedSources(page, source.handle);
    await expectConnectedSource(page, source.handle);

    const since = backfillSinceInput(page);
    const limit = backfillLimitInput(page);
    await expect(since).toBeVisible();
    await expect(limit).toBeVisible();
    await since.fill(emptyBackfillDate());
    await limit.fill('1');
    await expect(since).toHaveValue(emptyBackfillDate());
    await expect(limit).toHaveValue('1');

    const backfill = page.getByRole('button', { name: /^Backfill$/ });
    await expect(backfill).toBeVisible();
    await backfill.click();
    await waitForSourceActionFeedback(page);

    await expectSourceStillConnected(page, source.handle);
    const afterText = await sourceScreenText(page);
    expect(afterText).toMatch(/Backfill|Last run|Last error|Pipeline|Recent runs/i);
    expectNoBrokenUiText(afterText);
  });

  test('TC-SOURCE-042A @source-action-no-data Catalog Refresh handles empty provider result', async ({ page }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run source action automation.');
    test.skip(!sourceActionNoDataEnabled(), 'Set SOURCE_ACTION_NO_DATA=true to run action no-data source automation.');

    await openConnectedSources(page, source.handle);
    const dialog = await openVideosDialog(page);
    await expectCatalogDialogHasNoSelectedWork(dialog);

    await dialog.getByRole('button', { name: /^Refresh$/ }).click();
    await waitForSourceActionFeedback(page);

    const refreshedDialog = sourceDialog(page);
    await expect(refreshedDialog).toBeVisible();
    await expect(refreshedDialog).toContainText(/Channel videos/i);
    await expectCatalogDialogHasNoSelectedWork(refreshedDialog);
    expectNoBrokenUiText(await refreshedDialog.innerText());

    await closeVisibleDialog(page);
    const reopened = await openVideosDialog(page);
    await expectCatalogDialogHasNoSelectedWork(reopened);
    await closeVisibleDialog(page);
    await expectSourceStillConnected(page, source.handle);
  });

  test('TC-SOURCE-045A @source-action-no-data Ingest selected with zero selected or empty catalog is blocked safely', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run source action automation.');
    test.skip(!sourceActionNoDataEnabled(), 'Set SOURCE_ACTION_NO_DATA=true to run action no-data source automation.');

    await openConnectedSources(page, source.handle);
    const dialog = await openVideosDialog(page);
    const ingestZero = dialog.getByRole('button', { name: /Ingest 0 selected/i });
    await expect(ingestZero).toBeVisible();

    if (await ingestZero.isEnabled().catch(() => false)) {
      await ingestZero.click();
      await waitForSourceActionFeedback(page);
    }

    const activeDialog = sourceDialog(page);
    if (await activeDialog.isVisible().catch(() => false)) {
      await expect(activeDialog.getByRole('button', { name: /Ingest 0 selected/i })).toBeVisible();
      expectNoBrokenUiText(await activeDialog.innerText());
      await closeVisibleDialog(page);
    }

    await expectSourceStillConnected(page, source.handle);
    expectNoBrokenUiText(await sourceScreenText(page));
  });

  test('TC-SOURCE-042 TC-CATALOG-001 TC-CATALOG-010 TC-CATALOG-013 TC-CATALOG-014 @source-crawl-data Populated channel catalog refresh shows known video metadata and states', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();
    const fixture = crawlDataFixture();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run populated crawl automation.');
    test.skip(!sourceCrawlDataEnabled(), 'Set SOURCE_CRAWL_DATA=true to run populated crawl automation.');

    await openConnectedSources(page, source.handle);
    const beforeRunCount = await sourceRunCount(page);
    const dialog = await openRefreshedVideosDialog(page);
    const dialogText = await catalogDialogText(dialog);

    expect(dialogText).toContain(fixture.audioTitle);
    expect(dialogText).toContain(fixture.silentTitle);
    expect(dialogText).toContain(fixture.audioExpectedState);
    expect(dialogText).toContain(fixture.silentExpectedState);
    if (!dialogText.includes(`${fixture.expectedVideoCount} videos`)) {
      await expect(catalogVideoButton(dialog, fixture.audioTitle)).toBeVisible();
      await expect(catalogVideoButton(dialog, fixture.silentTitle)).toBeVisible();
    }
    await expect(dialog.getByRole('button', { name: /Ingest 0 selected/i })).toBeVisible();
    expectNoBrokenUiText(dialogText);

    await closeVisibleDialog(page);
    expect(await sourceRunCount(page)).toBe(beforeRunCount);
  });

  test('TC-SOURCE-043 TC-CATALOG-017 @source-crawl-data Catalog search filters known video title without starting ingest', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();
    const fixture = crawlDataFixture();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run populated crawl automation.');
    test.skip(!sourceCrawlDataEnabled(), 'Set SOURCE_CRAWL_DATA=true to run populated crawl automation.');

    await openConnectedSources(page, source.handle);
    const beforeRunCount = await sourceRunCount(page);
    const dialog = await openRefreshedVideosDialog(page);

    const search = dialog.getByPlaceholder('Search title');
    await search.fill(fixture.searchKeyword);
    await expect(search).toHaveValue(fixture.searchKeyword);
    await expect(dialog).toContainText(new RegExp(escapeRegExp(fixture.searchKeyword), 'i'));
    await expect(dialog.getByRole('button', { name: /Ingest 0 selected/i })).toBeVisible();

    await search.fill('');
    await expect(dialog).toContainText(fixture.audioTitle);
    await expect(dialog).toContainText(fixture.silentTitle);
    await closeVisibleDialog(page);
    expect(await sourceRunCount(page)).toBe(beforeRunCount);
  });

  test('TC-SOURCE-044 TC-CATALOG-019 TC-CATALOG-020 @source-crawl-data Catalog row state controls selectability', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();
    const fixture = crawlDataFixture();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run populated crawl automation.');
    test.skip(!sourceCrawlDataEnabled(), 'Set SOURCE_CRAWL_DATA=true to run populated crawl automation.');

    await openConnectedSources(page, source.handle);
    const dialog = await openRefreshedVideosDialog(page);
    const failedVideo = catalogVideoButton(dialog, fixture.audioTitle);
    const noInsightsVideo = catalogVideoButton(dialog, fixture.silentTitle);

    await expect(failedVideo).toContainText(fixture.audioExpectedState);
    await expect(noInsightsVideo).toContainText(fixture.silentExpectedState);
    await expect(failedVideo).toBeEnabled();
    await expect(noInsightsVideo).toBeDisabled();

    await failedVideo.click();
    await expect(dialog.getByRole('button', { name: /Ingest 1 selected/i })).toBeVisible();
    expectNoBrokenUiText(await catalogDialogText(dialog));
  });

  test('TC-INGEST-020 @source-crawl-data No-audio clip is visible as no-transcript/no-riff content after ingest', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();
    const fixture = crawlDataFixture();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run populated crawl automation.');
    test.skip(!sourceCrawlDataEnabled(), 'Set SOURCE_CRAWL_DATA=true to run populated crawl automation.');

    await openConnectedSources(page, source.handle);
    await page.goto('/content');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissOnboardingIfPresent(page);

    const text = await contentScreenText(page);
    expect(text).toContain(fixture.silentTitle);
    expect(text).toMatch(/No riffables/i);
    expect(text).toMatch(/TRANSCRIPT\s+None yet/i);
    expect(text).toMatch(/0 with transcript/i);
    expectNoBrokenUiText(text);
  });

  test('TC-INGEST-018 TC-CRAWL-013 @source-crawl-data @source-crawl-success Successful audio clip is visible with transcript after ingest', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();
    const fixture = crawlDataFixture();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run populated crawl automation.');
    test.skip(!sourceCrawlDataEnabled(), 'Set SOURCE_CRAWL_DATA=true to run populated crawl automation.');

    await openConnectedSources(page, source.handle);
    await page.goto('/content');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissOnboardingIfPresent(page);

    const text = await contentScreenText(page);
    expect(text).toContain(fixture.successTitle);
    expect(text).toMatch(/with transcript/i);
    expect(text).toMatch(/TRANSCRIPT\s+Available/i);
    expect(text).toMatch(new RegExp(`${escapeRegExp(fixture.successTitle)}[\\s\\S]*No riffables`, 'i'));
    expectNoBrokenUiText(text);
  });

  test('TC-SOURCE-045 TC-CRAWL-002 TC-CRAWL-010 TC-CRAWL-013 TC-INGEST-018 @source-crawl-data @source-crawl-exact-selected Exact selected two-video ingest completed with transcripts', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();
    const fixture = exactSelectedFixture();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run populated crawl automation.');
    test.skip(!sourceCrawlDataEnabled(), 'Set SOURCE_CRAWL_DATA=true to run populated crawl automation.');

    await openConnectedSources(page, source.handle);
    const sourceText = await sourceScreenText(page);
    const expectedRunPattern = new RegExp(`\\b${fixture.expectedRunTotal}\\/${fixture.expectedRunTotal}\\b`, 'i');
    const matchingRun = recentRunTextMatching(sourceText, expectedRunPattern);
    expect(matchingRun).toMatch(expectedRunPattern);
    expect(matchingRun).not.toMatch(/failed/i);

    await page.goto('/content');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissOnboardingIfPresent(page);

    const contentText = await contentScreenText(page);
    expect(contentText).toMatch(new RegExp(`${fixture.expectedTranscriptCount} with transcript`, 'i'));
    for (const title of fixture.titles) {
      if (title) {
        expectContentRowHasTranscript(contentText, title);
      }
    }
    expectNoBrokenUiText(contentText);
  });

  test('TC-SOURCE-045 TC-CATALOG-005 @source-crawl-data @source-crawl-unselected-guard Exact selected ingest leaves unselected fresh video untouched', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();
    const fixture = exactSelectedFixture();

    test.setTimeout(fixture.waitMs + 90_000);
    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run populated crawl automation.');
    test.skip(!sourceCrawlDataEnabled(), 'Set SOURCE_CRAWL_DATA=true to run populated crawl automation.');
    test.skip(!sourceCrawlMutationEnabled(), 'Set SOURCE_CRAWL_MUTATION=true to run mutating crawl automation.');

    await openConnectedSources(page, source.handle);
    const dialog = await openRefreshedVideosDialog(page);
    const freshVideos = catalogFreshNotIngestedVideoButtons(dialog);
    const freshCount = await freshVideos.count();
    const freshTexts = await catalogButtonTexts(freshVideos);

    console.log(`Fresh selectable catalog rows: ${freshCount}`);
    for (const [index, text] of freshTexts.entries()) {
      console.log(`Fresh row ${index + 1}: ${text}`);
    }

    test.skip(
      freshCount < 3,
      `Need at least 3 fresh selectable videos to select 2 and prove 1 remains untouched. Current rows: ${freshTexts.join(
        ' | '
      )}`
    );

    const selectedA = freshVideos.nth(0);
    const selectedB = freshVideos.nth(1);
    const unselected = freshVideos.nth(2);
    const unselectedTextBefore = await compactLocatorText(unselected);
    const unselectedTitle = firstCatalogLine(unselectedTextBefore);

    await selectedA.click();
    await selectedB.click();
    await expect(dialog.getByRole('button', { name: /Ingest 2 selected/i })).toBeEnabled();
    await expectFreshNotIngestedRow(unselected);

    await dialog.getByRole('button', { name: /Ingest 2 selected/i }).click();
    await expect(dialog).toContainText(/Queued|Processing|Transcribing|Extracting|Not ingested/i);
    const unselectedAfterSubmit = catalogVideoButton(dialog, unselectedTitle);
    await expectFreshNotIngestedRow(unselectedAfterSubmit);
    await expect(unselectedAfterSubmit).toContainText(unselectedTitle);

    const afterText = await waitForLatestRecentRun(
      page,
      new RegExp(`\\b${fixture.expectedRunTotal}\\/${fixture.expectedRunTotal}\\b`, 'i'),
      fixture.waitMs
    );
    const latest = latestRecentRunText(afterText);

    expect(latest).toMatch(new RegExp(`\\b${fixture.expectedRunTotal}\\/${fixture.expectedRunTotal}\\b`, 'i'));
    expect(latest).not.toMatch(/failed/i);

    const verifyDialog = await openRefreshedVideosDialog(page);
    const verifyUnselected = catalogFreshNotIngestedVideoButtons(verifyDialog).filter({
      hasText: new RegExp(escapeRegExp(unselectedTitle), 'i')
    });
    await expect(verifyUnselected.first()).toBeEnabled();
    await closeVisibleDialog(page);
  });

  test('TC-SOURCE-045 TC-CATALOG-020 TC-INGEST-016 TC-INGEST-020 TC-CRAWL-013 @source-crawl-data Failed catalog video retry queues selected item and surfaces terminal failure', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();
    const fixture = crawlDataFixture();

    test.setTimeout(fixture.waitMs + 60_000);
    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run populated crawl automation.');
    test.skip(!sourceCrawlDataEnabled(), 'Set SOURCE_CRAWL_DATA=true to run populated crawl automation.');
    test.skip(!sourceCrawlMutationEnabled(), 'Set SOURCE_CRAWL_MUTATION=true to run mutating crawl automation.');

    await openConnectedSources(page, source.handle);
    const dialog = await openRefreshedVideosDialog(page);
    const failedVideo = catalogVideoButton(dialog, fixture.audioTitle);

    await expect(failedVideo).toContainText(fixture.audioExpectedState);
    await expect(failedVideo).toBeEnabled();
    await failedVideo.click();
    await expect(dialog.getByRole('button', { name: /Ingest 1 selected/i })).toBeEnabled();
    await dialog.getByRole('button', { name: /Ingest 1 selected/i }).click();

    await expect(dialog).toContainText(new RegExp(`${escapeRegExp(fixture.audioTitle)}[\\s\\S]*(Queued|Processing|Failed)`, 'i'));
    const afterText = await waitForLatestRecentRun(page, /\/1\b[\s\S]*failed/i, fixture.waitMs);
    const latest = latestRecentRunText(afterText);

    expect(latest).toMatch(/\/1\b/i);
    expect(latest).toMatch(/failed/i);
    expect(afterText).toMatch(/Last error/i);
    expect(afterText).toMatch(/Video unavailable|failed before fetching|Command failed/i);
  });

  test('TC-SOURCE-034 TC-CRAWL-002 TC-CRAWL-010 TC-INGEST-018 @source-crawl-data Run crawl with populated catalog reaches full success contract', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();
    const fixture = crawlDataFixture();

    test.setTimeout(fixture.waitMs + 90_000);
    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run populated crawl automation.');
    test.skip(!sourceCrawlDataEnabled(), 'Set SOURCE_CRAWL_DATA=true to run populated crawl automation.');
    test.skip(!sourceCrawlMutationEnabled(), 'Set SOURCE_CRAWL_MUTATION=true to run mutating crawl automation.');

    await openConnectedSources(page, source.handle);
    const dialog = await openRefreshedVideosDialog(page);
    await expect(dialog).toContainText(`${fixture.expectedVideoCount} videos`);
    await closeVisibleDialog(page);

    await page.getByRole('button', { name: /^Run crawl$/ }).click();
    const afterText = await waitForLatestRecentRun(
      page,
      new RegExp(`\\b${fixture.expectedVideoCount}\\/${fixture.expectedVideoCount}\\b`, 'i'),
      fixture.waitMs
    );
    const latest = latestRecentRunText(afterText);

    expect(latest).toMatch(new RegExp(`\\b${fixture.expectedVideoCount}\\/${fixture.expectedVideoCount}\\b`, 'i'));
    expect(latest).not.toMatch(/failed/i);
    expect(afterText).not.toMatch(/Video unavailable|failed before fetching/i);

    await page.goto('/content');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissOnboardingIfPresent(page);
    const contentText = await contentScreenText(page);
    expect(contentText).toContain(fixture.audioTitle);
    expect(contentText).not.toMatch(/0 with transcript/i);
  });

  test('TC-SOURCE-015 Blank YouTube source input cannot be submitted', async ({ page }) => {
    const config = smokeConfig();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run blank source validation automation.');

    await openSources(page);
    await expectSourceManagement(page);

    const sourceInput = youtubeSourceInput(page);
    const verifyButton = verifyWithGoogleButton(page);
    const sourceUrl = page.url();

    await sourceInput.fill('');
    await expect(verifyButton).toBeDisabled();
    await sourceInput.press('Enter');
    await expect(page).toHaveURL(sourceUrl);
    await expect(verifyButton).toBeDisabled();
    await expect(page.getByText('Connected sources')).toBeVisible();
  });

  test('TC-SOURCE-003 TC-SOURCE-009 Manual mode can be selected before owner verification', async ({ page }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run manual source mode automation.');

    await openSources(page);
    await expectSourceManagement(page);

    const sourceInput = youtubeSourceInput(page);
    const verifyButton = verifyWithGoogleButton(page);
    const autoModeButton = page.getByRole('button', { name: /Auto crawl/i });
    const manualModeButton = page.getByRole('button', { name: /Manual selection/i });

    await expect(autoModeButton).toBeVisible();
    await expect(manualModeButton).toBeVisible();
    await sourceInput.fill(source.handle);
    await manualModeButton.click();
    await expect(sourceInput).toHaveValue(source.handle);
    await expect(verifyButton).toBeEnabled();
    await expect(page).toHaveURL(/\/sources$/);
  });

  test('TC-SOURCE-002 TC-SOURCE-008 Connect YouTube channel in Auto mode completes after Google owner verification', async ({
    page
  }) => {
    const config = smokeConfig();
    const source = youtubeSource();
    const ownerEmail = process.env.SOURCE_GOOGLE_EMAIL || config.email;
    const ownerPassword = process.env.SOURCE_GOOGLE_PASSWORD || config.password;

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run source connection automation.');
    test.skip(
      process.env.SOURCE_CONNECT_FULL !== 'true',
      'Set SOURCE_CONNECT_FULL=true to run the mutating full source connection flow.'
    );
    test.skip(!ownerEmail || !ownerPassword, 'Set SOURCE_GOOGLE_EMAIL and SOURCE_GOOGLE_PASSWORD for Google owner OAuth.');

    await openSources(page);
    await expectSourceManagement(page);

    if (await hasConnectedSource(page, source.handle)) {
      await expectConnectedSource(page, source.handle);
      return;
    }

    const sourceInput = youtubeSourceInput(page);
    const verifyButton = verifyWithGoogleButton(page);

    await expect(verifyButton).toBeDisabled();
    await sourceInput.fill(source.handle);
    await expect(sourceInput).toHaveValue(source.handle);
    await expect(page.getByRole('button', { name: /Auto crawl/i })).toBeVisible();
    await expect(verifyButton).toBeEnabled();

    await Promise.all([
      page.waitForURL((url) => /accounts\.google\.com/i.test(url.hostname), { timeout: 30_000 }),
      verifyButton.click()
    ]);

    await completeGoogleOwnerVerification(page, ownerEmail, ownerPassword);
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await page.goto('/sources');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissOnboardingIfPresent(page);

    await expectConnectedSource(page, source.handle);
  });

  test('TC-SOURCE-016 Malformed YouTube handles are rejected before source creation', async ({ page }) => {
    const config = smokeConfig();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run malformed source validation automation.');
    test.fail(
      isKnownInvalidSourceValidationGap(),
      'Current staging enables Google verification for malformed handles; keep this expected failure until client-side validation is fixed.'
    );

    await openSources(page);
    await expectSourceManagement(page);

    for (const value of malformedYouTubeHandles) {
      await expectRejectedSourceInput(page, value);
    }
  });

  test('TC-SOURCE-017 Unsupported external source domains are rejected', async ({ page }) => {
    const config = smokeConfig();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run unsupported domain automation.');
    test.fail(
      isKnownInvalidSourceValidationGap(),
      'Current staging enables Google verification for unsupported domains; keep this expected failure until client-side validation is fixed.'
    );

    await openSources(page);
    await expectSourceManagement(page);

    for (const value of unsupportedExternalDomains) {
      await expectRejectedSourceInput(page, value);
    }
  });

  test('TC-SOURCE-018 Unsupported YouTube URL types are rejected in the channel connector', async ({ page }) => {
    const config = smokeConfig();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run unsupported YouTube URL automation.');
    test.fail(
      isKnownInvalidSourceValidationGap(),
      'Current staging enables Google verification for unsupported YouTube URL types; keep this expected failure until channel URL validation is fixed.'
    );

    await openSources(page);
    await expectSourceManagement(page);

    for (const value of unsupportedYouTubeUrls) {
      await expectRejectedSourceInput(page, value);
    }
  });

  test('TC-SOURCE-022 Source types marked Crawling soon cannot be submitted as active sources', async ({ page }) => {
    const config = smokeConfig();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run future source type automation.');

    await openSources(page);
    await expectSourceManagement(page);

    const currentUrl = page.url();
    for (const futureType of futureSourceTypes) {
      const card = futureSourceTypeCard(page, futureType);
      await expect(card).toBeVisible();
      await expect(card).toContainText(/Crawling soon/i);

      const button = futureSourceTypeButton(page, futureType);
      if ((await button.count()) > 0) {
        if (await button.first().isEnabled().catch(() => false)) {
          await button.first().click();
          await page.waitForLoadState('networkidle').catch(() => undefined);
          await expect(page, `${futureType} should not start an unsupported source flow`).toHaveURL(currentUrl);
        } else {
          await expect(button.first()).toBeDisabled();
        }
      }

      const submitButton = futureSourceSubmitButton(page, futureType);
      if ((await submitButton.count()) > 0) {
        await expect(submitButton.first()).toBeDisabled();
      }
      await expect(page.getByText(/Crawling soon/i).first()).toBeVisible();
    }
  });

  test('TC-SOURCE-013 YouTube source form accepts a handle and starts Google owner verification', async ({ page }) => {
    const config = smokeConfig();
    const source = youtubeSource();

    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run source connection automation.');

    await openSources(page);
    await expectSourceManagement(page);

    const sourceInput = youtubeSourceInput(page);
    const verifyButton = verifyWithGoogleButton(page);

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
});

type YouTubeSource = {
  handle: string;
  url: string;
};

const futureSourceTypes = ['YouTube video', 'Spotify show', 'Spotify episode', 'Blog RSS', 'Blog URL'];

const malformedYouTubeHandles = ['@', '@@bad', '@bad handle', 'youtube.com/@', '@bad!handle'];

const unsupportedExternalDomains = [
  'https://www.tiktok.com/@creator',
  'https://www.facebook.com/speedrunlabs',
  'https://example.com/feed.xml'
];

const unsupportedYouTubeUrls = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/shorts/dQw4w9WgXcQ',
  'https://www.youtube.com/playlist?list=PL1234567890',
  'https://www.youtube.com/embed/dQw4w9WgXcQ'
];

async function openSources(page: Page): Promise<void> {
  const config = smokeConfig();

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    await login(page, config);
    await selectExistingOrganizationIfPresent(page);
    await dismissOnboardingIfPresent(page);

    await page.goto('/sources');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissOnboardingIfPresent(page);

    if (/\/sources$/.test(new URL(page.url()).pathname)) {
      return;
    }
  }
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

function verifyWithGoogleButton(page: Page): Locator {
  return page.getByRole('button', { name: /verify with google/i });
}

async function openConnectedSources(page: Page, handle: string): Promise<void> {
  await openSources(page);
  await expectSourceManagement(page);

  test.skip(
    !(await hasConnectedSource(page, handle)),
    `This testcase requires connected source fixture ${handle}. Use a connected-source QA account.`
  );
}

function sourceDialog(page: Page): Locator {
  return page.locator('[role="dialog"], dialog').first();
}

async function closeVisibleDialog(page: Page): Promise<void> {
  const dialog = sourceDialog(page);
  const close = dialog.getByRole('button', { name: /^Close$/ });
  await close.click();
  await expect(dialog).toBeHidden();
}

async function openVideosDialog(page: Page): Promise<Locator> {
  await page.getByRole('button', { name: /^Videos$/ }).click();
  const dialog = sourceDialog(page);
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(/Channel videos/i);

  return dialog;
}

async function openRefreshedVideosDialog(page: Page): Promise<Locator> {
  const dialog = await openVideosDialog(page);
  await dialog.getByRole('button', { name: /^Refresh$/ }).click();
  await expect(dialog).toContainText(/videos|No videos|partial|Ingest/i, { timeout: 30_000 });
  await expect(dialog.getByRole('button', { name: /Ingest \d+ selected/i })).toBeVisible();

  return dialog;
}

function catalogVideoButton(dialog: Locator, title: string): Locator {
  return dialog.getByRole('button', { name: new RegExp(escapeRegExp(title), 'i') }).first();
}

function catalogFreshNotIngestedVideoButtons(dialog: Locator): Locator {
  return dialog
    .locator('button')
    .filter({ hasText: /\d{1,2}\/\d{1,2}\/\d{4}/ })
    .filter({ hasNotText: /No insights|Failed|Queued|Processing|Transcribing|Extracting|Riffed/i });
}

async function catalogDialogText(dialog: Locator): Promise<string> {
  return dialog.innerText().then((text) => text.replace(/\s+/g, ' ').trim());
}

async function catalogButtonTexts(buttons: Locator): Promise<string[]> {
  const count = await buttons.count();
  const texts: string[] = [];

  for (let index = 0; index < count; index += 1) {
    texts.push(await compactLocatorText(buttons.nth(index)));
  }

  return texts;
}

async function compactLocatorText(locator: Locator): Promise<string> {
  return locator.innerText().then((text) => text.replace(/\s+/g, ' ').trim());
}

async function expectFreshNotIngestedRow(row: Locator): Promise<void> {
  await expect(row).toBeEnabled();
  await expect(row).not.toContainText(/No insights|Failed|Queued|Processing|Transcribing|Extracting|Riffed/i);
}

function firstCatalogLine(rowText: string): string {
  return rowText.split(/\s{2,}| Published | Not ingested | Queued | Processing | Riffed | Failed /i)[0].trim();
}

async function expectCatalogHasNoSelectedWork(page: Page, handle: string): Promise<void> {
  const dialog = await openVideosDialog(page);
  await expectCatalogDialogHasNoSelectedWork(dialog);
  await closeVisibleDialog(page);
  await expect(page.getByText(handle).first()).toBeVisible();
}

async function expectCatalogDialogHasNoSelectedWork(dialog: Locator): Promise<void> {
  await expect(dialog.getByRole('button', { name: /Ingest 0 selected/i })).toBeVisible();
  await expect(dialog).toContainText(/0 videos|No videos|partial|Ingest 0 selected|1 \/ 1/i);
}

function backfillSinceInput(page: Page): Locator {
  return page.locator('input[type="date"]').first();
}

function backfillLimitInput(page: Page): Locator {
  return page.locator('input[type="number"]').first();
}

async function sourceScreenText(page: Page): Promise<string> {
  return page
    .locator('main')
    .innerText()
    .then((text) => text.replace(/\s+/g, ' ').trim());
}

async function contentScreenText(page: Page): Promise<string> {
  return page
    .locator('main')
    .innerText()
    .then((text) => text.replace(/\s+/g, ' ').trim());
}

async function sourceRunCount(page: Page): Promise<number> {
  return runCountFromText(await sourceScreenText(page));
}

async function runCountFromText(text: string): Promise<number> {
  return (text.match(/YouTube channel\s+·/g) || []).length;
}

async function waitForLatestRecentRun(page: Page, expected: RegExp, timeoutMs: number): Promise<string> {
  const deadline = Date.now() + timeoutMs;
  let latestText = await sourceScreenText(page);

  while (Date.now() < deadline) {
    await page.goto('/sources');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissOnboardingIfPresent(page);
    latestText = await sourceScreenText(page);

    if (expected.test(latestRecentRunText(latestText))) {
      return latestText;
    }

    await page.waitForTimeout(5_000);
  }

  return latestText;
}

function latestRecentRunText(text: string): string {
  const recentRunsIndex = text.search(/RECENT RUNS/i);
  if (recentRunsIndex === -1) {
    return '';
  }

  const recentRuns = text.slice(recentRunsIndex).replace(/^RECENT RUNS\s*/i, '');
  const firstRunIndex = recentRuns.search(/YouTube channel\s+(?:Â·|·)/i);
  if (firstRunIndex === -1) {
    return '';
  }

  const firstRun = recentRuns.slice(firstRunIndex);
  const secondRunIndex = firstRun.slice(1).search(/YouTube channel\s+(?:Â·|·)/i);

  return (secondRunIndex === -1 ? firstRun : firstRun.slice(0, secondRunIndex + 1)).trim();
}

function recentRunTextMatching(text: string, expected: RegExp): string {
  const recentRunsIndex = text.search(/RECENT RUNS/i);
  if (recentRunsIndex === -1) {
    return '';
  }

  const recentRuns = text.slice(recentRunsIndex).replace(/^RECENT RUNS\s*/i, '');
  return (
    recentRuns
      .split(/(?=YouTube channel\s+)/i)
      .map((run) => run.trim())
      .filter(Boolean)
      .find((run) => expected.test(run)) || ''
  );
}

async function connectedSourceBaseline(
  page: Page,
  handle: string
): Promise<{
  handleVisible: boolean;
  statusVisible: boolean;
  modeVisible: boolean;
  hasRunCrawl: boolean;
  hasBackfill: boolean;
  hasPipeline: boolean;
}> {
  return {
    handleVisible: await page.getByText(handle).first().isVisible().catch(() => false),
    statusVisible: await page.getByText('Active', { exact: true }).first().isVisible().catch(() => false),
    modeVisible: await page.getByText('Auto', { exact: true }).first().isVisible().catch(() => false),
    hasRunCrawl: await page.getByRole('button', { name: /^Run crawl$/ }).isVisible().catch(() => false),
    hasBackfill: await page.getByRole('button', { name: /^Backfill$/ }).isVisible().catch(() => false),
    hasPipeline: await page.getByText('Pipeline', { exact: true }).isVisible().catch(() => false)
  };
}

async function expectSourceStillConnected(page: Page, handle: string): Promise<void> {
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await dismissOnboardingIfPresent(page);
  await expect(page).toHaveURL(/\/sources$/);
  await expectConnectedSource(page, handle);
}

async function waitForSourceActionFeedback(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3_000);
  await dismissOnboardingIfPresent(page);
}

function expectNoBrokenUiText(text: string): void {
  expect(text).not.toMatch(/undefined|null|NaN|\[object Object\]/i);
}

function expectContentRowHasTranscript(contentText: string, title: string): void {
  expect(contentText).toMatch(new RegExp(`${escapeRegExp(title)}[\\s\\S]*TRANSCRIPT\\s+Available`, 'i'));
}

function emptyBackfillDate(): string {
  return process.env.SOURCE_BACKFILL_EMPTY_DATE || '2026-07-17';
}

function sourceActionNoDataEnabled(): boolean {
  return process.env.SOURCE_ACTION_NO_DATA === 'true';
}

type CrawlDataFixture = {
  expectedVideoCount: number;
  audioTitle: string;
  silentTitle: string;
  successTitle: string;
  audioExpectedState: string;
  silentExpectedState: string;
  searchKeyword: string;
  waitMs: number;
};

type ExactSelectedFixture = {
  titles: string[];
  expectedRunTotal: number;
  expectedTranscriptCount: number;
  waitMs: number;
};

function sourceCrawlDataEnabled(): boolean {
  return process.env.SOURCE_CRAWL_DATA === 'true';
}

function sourceCrawlMutationEnabled(): boolean {
  return process.env.SOURCE_CRAWL_MUTATION === 'true';
}

function crawlDataFixture(): CrawlDataFixture {
  const audioTitle = process.env.SOURCE_CRAWL_AUDIO_TITLE || 'test 2';
  const silentTitle = process.env.SOURCE_CRAWL_SILENT_TITLE || 'test 1';
  const successTitle = process.env.SOURCE_CRAWL_SUCCESS_TITLE || 'test 3';

  return {
    expectedVideoCount: Number(process.env.SOURCE_EXPECTED_VIDEO_COUNT || 8),
    audioTitle,
    silentTitle,
    successTitle,
    audioExpectedState: process.env.SOURCE_CRAWL_AUDIO_EXPECTED_STATE || 'Failed',
    silentExpectedState: process.env.SOURCE_CRAWL_SILENT_EXPECTED_STATE || 'No insights',
    searchKeyword: process.env.SOURCE_CRAWL_SEARCH_KEYWORD || audioTitle,
    waitMs: Number(process.env.SOURCE_CRAWL_WAIT_MS || 120_000)
  };
}

function exactSelectedFixture(): ExactSelectedFixture {
  return {
    titles: splitConfiguredTitles(process.env.SOURCE_EXACT_SELECTED_TITLES || process.env.SOURCE_EXACT_SELECTED_TITLE_B || 'Video 1'),
    expectedRunTotal: Number(process.env.SOURCE_EXACT_SELECTED_EXPECTED_TOTAL || 2),
    expectedTranscriptCount: Number(process.env.SOURCE_EXACT_SELECTED_EXPECTED_TRANSCRIPT_COUNT || 3),
    waitMs: Number(process.env.SOURCE_EXACT_SELECTED_WAIT_MS || 180_000)
  };
}

function splitConfiguredTitles(value: string): string[] {
  return value
    .split(',')
    .map((title) => title.trim())
    .filter(Boolean);
}

function futureSourceTypeCard(page: Page, sourceType: string): Locator {
  const label = page.getByText(sourceType, { exact: true }).first();

  return page
    .locator('button, [role="button"], article, section, div')
    .filter({ has: label })
    .filter({ hasText: /Crawling soon/i })
    .first();
}

function futureSourceTypeButton(page: Page, sourceType: string): Locator {
  return page.getByRole('button', { name: new RegExp(`${escapeRegExp(sourceType)}[\\s\\S]*Crawling soon`, 'i') });
}

function futureSourceSubmitButton(page: Page, sourceType: string): Locator {
  return page.getByRole('button', { name: new RegExp(`Connect ${escapeRegExp(sourceType)}`, 'i') });
}

async function hasConnectedSource(page: Page, handle: string): Promise<boolean> {
  return page.getByText(handle).first().isVisible().catch(() => false);
}

async function expectConnectedSource(page: Page, handle: string): Promise<void> {
  await expect(page.getByText('Connected sources')).toBeVisible();
  await expect(page.getByText(handle).first()).toBeVisible();
  await expect(page.getByText('YouTube channel').first()).toBeVisible();
  await expect(page.getByText('Active', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Auto', { exact: true }).first()).toBeVisible();

  for (const action of [/Details/i, /Videos/i, /Run crawl/i, /Backfill/i]) {
    await expect(page.getByRole('button', { name: action }).first()).toBeVisible();
  }
}

async function isEmptySourceWorkspace(page: Page): Promise<boolean> {
  return page.getByRole('heading', { name: 'Connect your first source' }).isVisible().catch(() => false);
}

async function completeGoogleOwnerVerification(page: Page, email: string, password: string): Promise<void> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    await page.waitForLoadState('domcontentloaded').catch(() => undefined);

    if (!/accounts\.google\.com/i.test(new URL(page.url()).hostname)) {
      return;
    }

    await assertGoogleOwnerOAuthNotBlocked(page);

    const accountChoice = page.getByText(email, { exact: false }).first();
    if (await accountChoice.isVisible().catch(() => false)) {
      await accountChoice.click();
      await page.waitForLoadState('domcontentloaded').catch(() => undefined);
      continue;
    }

    const emailInput = googleEmailInput(page);
    if (await emailInput.first().isVisible().catch(() => false)) {
      await emailInput.first().fill(email);
      await clickGoogleButton(page, /^next$/i);
      continue;
    }

    const passwordInput = googlePasswordInput(page);
    if (await passwordInput.first().isVisible().catch(() => false)) {
      await passwordInput.first().fill(password);
      await clickGoogleButton(page, /^next$/i);
      continue;
    }

    const continueOrAllow = page.getByRole('button', { name: /^(Continue|Allow)$/i }).first();
    if (await continueOrAllow.isVisible().catch(() => false)) {
      await continueOrAllow.click();
      await page.waitForLoadState('domcontentloaded').catch(() => undefined);
      continue;
    }

    const selectAll = page.getByRole('checkbox', { name: /select all/i }).first();
    if (await selectAll.isVisible().catch(() => false)) {
      if (!(await selectAll.isChecked().catch(() => false))) {
        await selectAll.check();
      }
      continue;
    }

    await page.waitForTimeout(1_000);
  }

  throw new Error(`Google owner OAuth did not return to Riffables. Current URL: ${page.url()}`);
}

function googleEmailInput(page: Page): Locator {
  return page
    .getByLabel(/email or phone/i)
    .or(page.locator('input[type="email"]:visible'))
    .or(page.locator('input[name="identifier"]:visible'));
}

function googlePasswordInput(page: Page): Locator {
  return page
    .getByLabel(/^enter your password$/i)
    .or(page.getByLabel(/^password$/i))
    .or(page.locator('input[type="password"]:visible'))
    .or(page.locator('input[name="Passwd"]:visible'));
}

async function clickGoogleButton(page: Page, name: RegExp): Promise<void> {
  const button = page.getByRole('button', { name }).first();
  try {
    await button.click({ timeout: 5_000 });
  } catch (error) {
    await page.waitForLoadState('domcontentloaded').catch(() => undefined);
    await assertGoogleOwnerOAuthNotBlocked(page);
    if (await button.isVisible().catch(() => false)) {
      await button.click({ force: true, timeout: 5_000 });
    } else {
      throw error;
    }
  }
  await page.waitForLoadState('domcontentloaded').catch(() => undefined);
  await assertGoogleOwnerOAuthNotBlocked(page);
}

async function assertGoogleOwnerOAuthNotBlocked(page: Page): Promise<void> {
  const blocked = page.getByText(
    /couldn.t sign you in|browser or app may not be secure|try using a different browser|verify it.s you|couldn.t verify/i
  );
  if (await blocked.first().isVisible().catch(() => false)) {
    throw new Error('Google owner OAuth blocked the automated browser or requires additional verification.');
  }
}

async function expectRejectedSourceInput(page: Page, value: string): Promise<void> {
  const sourceInput = youtubeSourceInput(page);
  const verifyButton = verifyWithGoogleButton(page);
  const sourceUrl = page.url();

  await sourceInput.fill('');
  await expect(verifyButton).toBeDisabled();
  await sourceInput.fill(value);
  await expect(sourceInput).toHaveValue(value);
  await expect(verifyButton, `${value} should not enable Google verification`).toBeDisabled();
  await sourceInput.press('Enter');
  await expect(page, `${value} should keep the creator on Sources`).toHaveURL(sourceUrl);
  await expect(page.getByText('Connected sources')).toBeVisible();
}

function youtubeSource(): YouTubeSource {
  const url = process.env.SOURCE_YOUTUBE_URL || 'https://www.youtube.com/@nhnbaohan';
  const handle = process.env.SOURCE_YOUTUBE_HANDLE || handleFromUrl(url);

  return { handle, url };
}

function handleFromUrl(url: string): string {
  const match = url.match(/@[\w.-]+/);
  return match?.[0] || url;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isKnownInvalidSourceValidationGap(): boolean {
  return process.env.SOURCE_INVALID_VALIDATION_EXPECTED_FAIL !== 'false';
}
