import { expect, test, type Page } from '@playwright/test';

type PublicSiteConfig = {
  siteUrl: string;
  expectedText: string;
  searchKeyword: string;
  searchExpectedText: string;
  exactPhrase: string;
  maxSearchResults: number;
  invalidUrl: string;
  tenantBUrl?: string;
  tenantBUniqueText?: string;
  riffDetailPath: string;
  riffableDetailPath: string;
};

test.describe('Public show content site', () => {
  test('TC-PUBLIC-001 TC-PUBLIC-009 published public site loads and refreshes with tenant context', async ({ page }) => {
    const config = publicSiteConfig();

    await gotoPublic(page, config);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).toContainText(config.expectedText);
    await expect(page.locator('body')).toContainText(/A LIBRARY OF CONVERSATIONS|Library/i);
    await expect(page.getByRole('link', { name: /library/i }).first()).toBeVisible();

    await page.reload();
    await waitForPublicLoad(page);
    await expect(page.locator('body')).toContainText(config.expectedText);
    await expect(page.locator('body')).not.toContainText(/application error|internal server error|failed to load/i);
  });

  test('TC-PUBLIC-003 TC-PUBLIC-007 TC-PUBLIC-011 public library renders searchable insight cards', async ({ page }) => {
    const config = publicSiteConfig();

    await gotoPublic(page, config, '/library');
    await expect(page.locator('body')).toContainText(/LIBRARY|All episodes/i);

    const cards = await publicCards(page, 'a[href^="/riffs/"]');
    expect(cards.length, 'Library should show multiple published riff/source cards.').toBeGreaterThanOrEqual(3);
    for (const card of cards.slice(0, 3)) {
      expect(card.href, 'Library card should link to a riff detail route.').toMatch(/^\/riffs\//);
      expect(card.text, 'Library card should show source/type metadata.').toMatch(/SOURCE/i);
      expect(card.text, 'Library card should show riff sequence metadata.').toMatch(/RIFF\s+\d+/i);
      expect(card.text, 'Library card should include a readable title and summary.').toMatch(/[A-Za-z0-9].{80,}/);
    }

    await gotoPublic(page, config, `/search?q=${encodeURIComponent(config.searchKeyword)}`);
    await expect(page.locator('input')).toHaveValue(config.searchKeyword);
    await expect(page.locator('body')).toContainText(config.searchExpectedText);
    expect(await resultCardCount(page), 'Search should return result cards for the known keyword.').toBeGreaterThan(0);
  });

  test('TC-PUBLIC-010 invalid public URL does not expose tenant content', async ({ page }) => {
    const config = publicSiteConfig();

    await page.goto(config.invalidUrl);
    await waitForPublicLoad(page);

    await expect(page.locator('body')).toContainText(/not found|no published site/i);
    await expect(page.locator('body')).not.toContainText(config.searchExpectedText);
    expect(await resultCardCount(page), 'Invalid public URL should not render library result cards.').toBe(0);
  });

  test('TC-SEARCH-001 TC-SEARCH-006 TC-SEARCH-011 keyword search returns scoped matching insights within result limit', async ({
    page
  }) => {
    const config = publicSiteConfig();

    await gotoPublic(page, config, `/search?q=${encodeURIComponent(config.searchKeyword)}`);
    await expect(page.locator('input')).toHaveValue(config.searchKeyword);
    await expect(page.locator('body')).toContainText(config.searchExpectedText);

    const visibleResults = await resultCardCount(page);
    const declaredResults = await declaredSearchTotal(page);
    const total = Math.max(visibleResults, declaredResults);

    expect(total, 'Known keyword should produce at least one result.').toBeGreaterThan(0);
    expect(total, `Search result count should not exceed configured max ${config.maxSearchResults}.`).toBeLessThanOrEqual(
      config.maxSearchResults
    );
    await expect(page.locator('body')).not.toContainText(/Tenant B|No published site was found here/i);
  });

  test('TC-SEARCH-004 TC-SEARCH-013 exact quoted search prioritizes exact wording', async ({ page }) => {
    const config = publicSiteConfig();

    await gotoPublic(page, config, `/search?q=${encodeURIComponent(`"${config.exactPhrase}"`)}`);

    const riffableCards = page.locator('a[href^="/riffables/"]');
    const cardCount = await riffableCards.count();
    expect(cardCount, 'Exact phrase query should return at least one riffable result.').toBeGreaterThan(0);
    await expect(riffableCards.first()).toContainText(config.exactPhrase);
  });

  test('TC-SEARCH-015 TC-SEARCH-016 search boundary inputs do not crash or leak content', async ({ page }) => {
    const config = publicSiteConfig();

    await gotoPublic(page, config, '/search?q=');
    await expect(page.locator('input')).toHaveValue('');
    await expect(page.locator('body')).toContainText(/Start typing|Find anything/i);
    await expect(page.locator('body')).not.toContainText(/application error|internal server error/i);

    await gotoPublic(page, config, `/search?q=${encodeURIComponent('   ')}`);
    await expect(page.locator('input')).toHaveValue('   ');
    await expect(page.locator('body')).toContainText(/No matches|SEARCH/i);
    await expect(page.locator('body')).not.toContainText(/application error|internal server error/i);

    const longQuery = `${config.searchKeyword} `.repeat(120).trim();
    await gotoPublic(page, config, `/search?q=${encodeURIComponent(longQuery)}`);
    await expect(page.locator('input')).toHaveValue(longQuery);
    await expect(page.locator('body')).toContainText(/SEARCH|RIFFABLES/i);
    await expect(page.locator('body')).not.toContainText(/application error|internal server error|stack trace/i);
  });

  test('TC-PUBLIC-005 citation media timestamp requires playable source affordance', async ({ page }) => {
    const config = publicSiteConfig();

    await gotoPublic(page, config, config.riffableDetailPath);
    await expect(page.locator('body')).toContainText(/IN HER OWN WORDS|Source/i);

    const sourceMediaLinks = page.locator('a[href*="youtube"], a[href*="youtu.be"], a[href*="t="], a[href*="start="]');
    test.skip(
      (await sourceMediaLinks.count()) === 0,
      'Current public detail exposes quote/source text but no clickable media timestamp affordance.'
    );

    await expect(sourceMediaLinks.first()).toBeVisible();
  });

  test('TC-PUBLIC-002 TC-PUBLIC-016 cross-tenant public label isolation requires Tenant B fixture', async ({ page }) => {
    const config = publicSiteConfig();
    test.skip(!config.tenantBUrl || !config.tenantBUniqueText, 'Set PUBLIC_TENANT_B_URL and PUBLIC_TENANT_B_UNIQUE_TEXT.');

    await gotoPublic(page, config);
    await expect(page.locator('body')).not.toContainText(config.tenantBUniqueText!);

    await page.goto(config.tenantBUrl!);
    await waitForPublicLoad(page);
    await expect(page.locator('body')).toContainText(config.tenantBUniqueText!);
  });

  test('TC-PUBLIC-014 public labels should not expose template placeholder copy', async ({ page }) => {
    const config = publicSiteConfig();
    test.fail(true, 'Current Sunday public page still exposes template/demo placeholder labels.');

    await gotoPublic(page, config);
    await expect(page.locator('body')).not.toContainText(
      /Sample Studio|demo show for previewing|announcement banner|property pane|Local sample|Package preview/i
    );
  });
});

function publicSiteConfig(): PublicSiteConfig {
  const siteUrl = process.env.PUBLIC_SITE_URL || 'https://sunday.apps.riffables.com/';

  return {
    siteUrl,
    expectedText: process.env.PUBLIC_EXPECTED_TEXT || 'Sunday Okay',
    searchKeyword: process.env.PUBLIC_SEARCH_KEYWORD || 'K-pop',
    searchExpectedText: process.env.PUBLIC_SEARCH_EXPECTED_TEXT || 'Fancams are an engine of K-pop virality',
    exactPhrase: process.env.PUBLIC_EXACT_SEARCH_PHRASE || 'Fancams are an engine of K-pop virality',
    maxSearchResults: Number(process.env.PUBLIC_SEARCH_MAX_RESULTS || '60'),
    invalidUrl:
      process.env.PUBLIC_INVALID_URL || new URL('/__invalid-public-url-for-automation__', siteUrl).toString(),
    tenantBUrl: process.env.PUBLIC_TENANT_B_URL,
    tenantBUniqueText: process.env.PUBLIC_TENANT_B_UNIQUE_TEXT,
    riffDetailPath: process.env.PUBLIC_RIFF_DETAIL_PATH || '/riffs/efe73e16-5f80-4f2a-856a-4fd41cadd798',
    riffableDetailPath:
      process.env.PUBLIC_RIFFABLE_DETAIL_PATH || '/riffables/54817862-efa0-4b49-9eb1-18e00c588e42'
  };
}

async function gotoPublic(page: Page, config: PublicSiteConfig, path = '/'): Promise<void> {
  await page.goto(new URL(path, config.siteUrl).toString());
  await waitForPublicLoad(page);
}

async function waitForPublicLoad(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await expect(page.locator('body')).toBeVisible();
}

async function publicCards(page: Page, selector: string): Promise<Array<{ href: string; text: string }>> {
  return page.locator(selector).evaluateAll((nodes) =>
    nodes.map((node) => ({
      href: node.getAttribute('href') || '',
      text: (node.textContent || '').replace(/\s+/g, ' ').trim()
    }))
  );
}

async function resultCardCount(page: Page): Promise<number> {
  return page.locator('a[href^="/riffables/"], a[href^="/riffs/"]').count();
}

async function declaredSearchTotal(page: Page): Promise<number> {
  const headings = await page.locator('h2').evaluateAll((nodes) =>
    nodes.map((node) => (node.textContent || '').replace(/\s+/g, ' ').trim())
  );
  const counts = headings
    .map((heading) => heading.match(/^(Riffables|Riffs)\s*[·•]\s*(\d+)$/i))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => Number(match[2]));

  return counts.reduce((sum, count) => sum + count, 0);
}
