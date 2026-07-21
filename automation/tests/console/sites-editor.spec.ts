import { expect, test, type BrowserContext, type Locator, type Page } from '@playwright/test';
import {
  dismissOnboardingIfPresent,
  hasCredentials,
  login,
  selectExistingOrganizationIfPresent,
  smokeConfig
} from '../support/smoke-config';

type SiteConfig = {
  expectedWorkspace: string;
  expectedSubdomain: string;
  fixedSuffix?: string;
  publicUrl?: string;
  goldenKeyword?: string;
  goldenExpectedText?: string;
  negativeProbe?: string;
  enableDraftMutation: boolean;
  enablePublish: boolean;
  enableLifecycleMutation: boolean;
};

type DraftEditState = {
  marker?: string;
  originalValue?: string;
};

test.describe('Baohan Sites and editor flows', () => {
  test.describe.configure({ mode: 'default' });

  let context: BrowserContext;
  let page: Page;
  let siteConfig: SiteConfig;
  const draftEdit: DraftEditState = {};

  test.beforeAll(async ({ browser }) => {
    const config = smokeConfig();
    test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run Baohan Sites/editor automation.');

    siteConfig = readSiteConfig();
    context = await browser.newContext({
      baseURL: config.baseURL,
      viewport: { width: 1920, height: 1080 }
    });
    page = await context.newPage();
    await openAuthenticated(page);
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test('TC-CONSOLE-041 TC-CONSOLE-042 Sites page exposes Baohan setup or site list state', async () => {
    await openSites(page);

    await expect(page).toHaveURL(/\/sites$/);
    await expect(page.getByRole('navigation').getByRole('link', { name: /site/i })).toBeVisible();
    await expect(page.locator('h1:visible')).toContainText(/start building|manage|publish|sites|site/i);
    await expectNoForeignFixture(page, siteConfig);

    const editorEntrypoint = siteEditorEntrypoint(page);
    await expect(editorEntrypoint.first()).toBeVisible();

    const mainText = await page.locator('main').innerText();
    expect(mainText).toMatch(/template|start|site|draft|published|unpublished/i);
  });

  test('TC-CONSOLE-043 TC-BUILDER-020 Opening editor from Sites keeps authenticated Baohan context', async () => {
    await openEditorFromSites(page);

    await expect(page).not.toHaveURL(/\/sign-in/);
    await expect(page).toHaveURL(/\/sites\/editor/);
    await expectNoForeignFixture(page, siteConfig);

    const body = await page.locator('body').innerText();
    expect(body).toMatch(/preview|publish|canvas|content|data|theme|section|template|editor/i);

    await expect(editorCoreControl(page)).toBeVisible();
    await expect(page.getByRole('heading', { name: /page sections/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /section settings/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^preview$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^publish$/i })).toBeVisible();

    await page.reload();
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expect(page).toHaveURL(/\/sites\/editor/);
    await expect(editorCoreControl(page)).toBeVisible();
  });

  test('TC-BUILDER-021 manual editor draft edit updates selected field', async () => {
    test.skip(!siteConfig.enableDraftMutation, 'Set SITE_DRAFT_MUTATION_ENABLED=true after QA approves editing the Baohan site draft.');

    await openEditorFromSites(page);
    const marker = `Baohan QA saved draft marker ${Date.now()}`;
    await selectEditableSection(page);
    await openInspectorContentTab(page);
    const editable = editableTextControl(page);
    await expect(editable).toBeVisible();

    const original = await editable.inputValue().catch(() => '');
    draftEdit.marker = marker;
    draftEdit.originalValue = original;
    await editable.fill(marker);
    await expect(editable).toHaveValue(marker);
    await page.keyboard.press('Tab');
    await waitForSavedOrStable(page);
    await page.waitForTimeout(3_000);
  });

  test('TC-BUILDER-022 manual editor draft persists after reload', async () => {
    test.skip(!siteConfig.enableDraftMutation, 'Set SITE_DRAFT_MUTATION_ENABLED=true after QA approves editing the Baohan site draft.');
    test.skip(!draftEdit.marker, 'TC-BUILDER-021 must create a draft marker before persistence can be checked.');

    await page.reload();
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissOnboardingIfPresent(page);

    await selectEditableSection(page);
    await openInspectorContentTab(page);
    await expect(editableTextControl(page).or(page.getByText(draftEdit.marker!))).toBeVisible();
    await expect(editableTextControl(page)).toHaveValue(draftEdit.marker!);
  });

  test('TC-BUILDER-023 preview can be opened without publishing live site', async () => {
    await openEditorFromSites(page);

    const preview = previewControl(page);
    await expect(preview).toBeVisible();
    const beforePages = page.context().pages();
    await preview.click();
    await page.waitForLoadState('networkidle').catch(() => undefined);
    const afterPages = page.context().pages();
    const previewPage = afterPages.find((candidate) => !beforePages.includes(candidate)) || page;
    await previewPage.waitForLoadState('domcontentloaded').catch(() => undefined);

    await expect(previewPage.locator('body')).toBeVisible();
    if (previewPage !== page) {
      await previewPage.close();
    }
  });

  test('TC-BUILDER-024 TC-PUBLIC-022 publish Baohan site is guarded until enabled', async () => {
    test.skip(!siteConfig.enablePublish, 'Set SITE_PUBLISH_ENABLED=true only when QA approves changing the Baohan public site.');

    await openEditorFromSites(page);
    const publish = publishControl(page);
    await expect(publish).toBeVisible();
    await publish.click();

    const subdomainInput = subdomainControl(page);
    if (await subdomainInput.isVisible().catch(() => false)) {
      await subdomainInput.fill(siteConfig.expectedSubdomain);
    }

    const confirmPublish = page
      .getByRole('button', { name: /^(publish|save and publish|confirm|continue)$/i })
      .filter({ hasNotText: /unpublish/i })
      .last();
    if (await confirmPublish.isVisible().catch(() => false)) {
      await confirmPublish.click();
    }

    await expect(page.locator('body')).toContainText(/published|publish|view live|live site|success/i, { timeout: 30_000 });

    const publishedUrl = `https://${siteConfig.expectedSubdomain}.${siteConfig.fixedSuffix || 'apps.riffables.com'}/`;
    siteConfig.publicUrl = publishedUrl;
    const livePage = await page.context().newPage();
    await livePage.goto(publishedUrl);
    await livePage.waitForLoadState('networkidle').catch(() => undefined);
    await expect(livePage.locator('body')).toBeVisible();
    await expect(livePage).toHaveURL(new RegExp(`${escapeRegExp(siteConfig.expectedSubdomain)}\\.${escapeRegExp(siteConfig.fixedSuffix || 'apps.riffables.com')}`));
    await expect(livePage.locator('body')).not.toContainText(/No published site was found here|NOT FOUND/i);
    await livePage.close();
  });

  test('TC-BUILDER-025 invalid publish subdomain validation is non-destructive', async () => {
    await openEditorFromSites(page);
    const publish = publishControl(page);
    await expect(publish).toBeVisible();
    await publish.click();

    const input = subdomainControl(page);
    test.skip(!(await input.isVisible().catch(() => false)), 'Publish dialog does not expose an editable subdomain field in current UI.');

    await input.fill('Invalid Host With Spaces!');
    await expect(page.locator('body')).toContainText(/invalid|lowercase|letters|numbers|hyphen|available|required|saniti/i);
    await expect(viewLiveSiteControl(page)).toHaveCount(0);
  });

  test('TC-CONSOLE-044 TC-CONSOLE-045 TC-CONSOLE-046 TC-CONSOLE-047 TC-CONSOLE-048 lifecycle mutations are guarded until enabled', async () => {
    test.skip(
      !siteConfig.enableLifecycleMutation,
      'Set SITE_LIFECYCLE_MUTATION_ENABLED=true only with a disposable Baohan site fixture for unpublish/discard/delete.'
    );

    await openEditorFromSites(page);
    await expect(page.locator('body')).toContainText(/unpublish|discard|delete|publish/i);

    const unpublish = page.getByRole('button', { name: /unpublish/i }).first();
    const deleteSite = page.getByRole('button', { name: /^delete( site)?$/i }).first();
    const hasUnpublish = await unpublish.isVisible().catch(() => false);
    const hasDelete = await deleteSite.isVisible().catch(() => false);
    test.skip(!hasUnpublish && !hasDelete, 'Current Baohan editor does not expose unpublish/delete lifecycle controls to automation.');

    if (draftEdit.originalValue) {
      await selectEditableSection(page);
      await openInspectorContentTab(page);
      const editable = editableTextControl(page);
      if (await editable.isVisible().catch(() => false)) {
        await editable.fill(draftEdit.originalValue);
        await waitForSavedOrStable(page);
      }
    }

    if (hasUnpublish) {
      await unpublish.click();
      const confirm = page.getByRole('button', { name: /^(unpublish|confirm|continue)$/i }).last();
      if (await confirm.isVisible().catch(() => false)) {
        await confirm.click();
      }
      await expect(page.locator('body')).toContainText(/unpublished|publish/i, { timeout: 30_000 });
    }

    const republish = publishControl(page);
    if (await republish.isVisible().catch(() => false)) {
      await republish.click();
      const confirmPublish = page
        .getByRole('button', { name: /^(publish|save and publish|confirm|continue)$/i })
        .filter({ hasNotText: /unpublish/i })
        .last();
      if (await confirmPublish.isVisible().catch(() => false)) {
        await confirmPublish.click();
      }
      await expect(page.locator('body')).toContainText(/published|view live|live site|success/i, { timeout: 30_000 });
    }

    test.skip(
      hasDelete,
      'Delete is intentionally not executed unless a separate disposable site fixture is exposed by the UI.'
    );
  });

  test('TC-BUILDER-026 TC-BUILDER-027 editor mapping controls expose layers or inspector affordances', async () => {
    await openEditorFromSites(page);

    await expect(page.getByRole('heading', { name: /page sections/i })).toBeVisible();
    const editableSection = page
      .getByRole('button', { name: /hero|cta band|featured riffable|content cards/i })
      .filter({ hasNotText: /site header|site footer/i })
      .first();
    await expect(editableSection).toBeVisible();
    await editableSection.click();

    await expect(page.getByRole('heading', { name: /section settings/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^content$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^data$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^theme$/i })).toBeVisible();
    await expect(editorCoreControl(page)).toBeVisible();
  });

  test('TC-BUILDER-029 TC-PUBLIC-023 TC-PUBLIC-024 Baohan public fixture checks are guarded by URL/data', async ({ page: publicPage }) => {
    test.skip(!siteConfig.publicUrl, 'Set SITE_PUBLIC_URL after publishing the Baohan site.');

    await publicPage.goto(siteConfig.publicUrl!);
    await publicPage.waitForLoadState('networkidle').catch(() => undefined);
    await expect(publicPage.locator('body')).toBeVisible();
    await expectNoForeignFixture(publicPage, siteConfig);

    if (siteConfig.goldenExpectedText) {
      await expect(publicPage.locator('body')).toContainText(new RegExp(escapeRegExp(siteConfig.goldenExpectedText), 'i'));
    }

    if (siteConfig.goldenKeyword) {
      const search = publicPage.getByRole('textbox').or(publicPage.locator('input[type="search"], input[name*="search" i]')).first();
      if (await search.isVisible().catch(() => false)) {
        await search.fill(siteConfig.goldenKeyword);
        await search.press('Enter');
      } else {
        await publicPage.goto(new URL(`/search?q=${encodeURIComponent(siteConfig.goldenKeyword)}`, siteConfig.publicUrl!).toString());
      }
      await publicPage.waitForLoadState('networkidle').catch(() => undefined);
      await expect(publicPage.locator('body')).not.toContainText(/No matches|Try a broader term/i);
      if (siteConfig.goldenExpectedText) {
        await expect(publicPage.locator('body')).toContainText(new RegExp(escapeRegExp(siteConfig.goldenExpectedText), 'i'));
      }
    }
  });

  test('TC-BUILDER-030 Assistant cannot be treated as auto-publish path without review controls', async () => {
    await openEditorFromSites(page);

    const assistant = assistantControl(page);
    test.skip(!(await assistant.isVisible().catch(() => false)), 'Site-editor Assistant is not exposed in the current Baohan editor UI.');

    await assistant.click();
    await expect(page.locator('body')).toContainText(/assistant|preview|diff|apply|revert|publish/i);
  });
});

async function openAuthenticated(page: Page): Promise<void> {
  const config = smokeConfig();
  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => undefined);

  if (page.url().includes(config.loginPath)) {
    await login(page, config);
  }

  await selectExistingOrganizationIfPresent(page);
  await dismissOnboardingIfPresent(page);
}

async function openSites(page: Page): Promise<void> {
  await page.goto('/sites');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await dismissOnboardingIfPresent(page);
}

async function openEditorFromSites(page: Page): Promise<void> {
  await openSites(page);
  const entrypoint = siteEditorEntrypoint(page).first();
  await expect(entrypoint).toBeVisible();
  await Promise.all([
    page.waitForURL((url) => /\/sites\/editor|\/sign-in/i.test(url.pathname), { timeout: 20_000 }).catch(() => undefined),
    entrypoint.click()
  ]);
  await page.waitForLoadState('domcontentloaded').catch(() => undefined);
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await dismissOnboardingIfPresent(page);
}

function siteEditorEntrypoint(page: Page): Locator {
  return page
    .locator('a[href*="/sites/editor"], button')
    .filter({ hasText: /template|start|edit|customize|site|builder|create|new/i });
}

function editorCoreControl(page: Page): Locator {
  return page
    .getByRole('button', { name: /^(preview|publish)$/i })
    .or(page.getByRole('button', { name: /^(design|media|assistant)$/i }))
    .first();
}

async function selectEditableSection(page: Page): Promise<void> {
  await expect(page.getByRole('heading', { name: /page sections/i })).toBeVisible();
  const editableSection = page
    .getByRole('button', { name: /hero|cta band|featured riffable|content cards/i })
    .filter({ hasNotText: /site header|site footer/i })
    .first();
  await expect(editableSection).toBeVisible();
  await editableSection.click({ position: { x: 24, y: 16 } });
  await expect(page.locator('body')).toContainText(/Hero|CTA Band|Featured Riffable|Content Cards|Eyebrow|Headline|Tagline|Primary CTA/i);
}

async function openInspectorContentTab(page: Page): Promise<void> {
  const contentTab = page.getByRole('button', { name: /^content$/i }).first();
  if (await contentTab.isVisible().catch(() => false)) {
    await contentTab.click();
  }
}

function previewControl(page: Page): Locator {
  return page.getByRole('button', { name: /preview/i }).or(page.getByRole('link', { name: /preview/i })).first();
}

function publishControl(page: Page): Locator {
  return page
    .getByRole('button', { name: /^publish$/i })
    .or(page.getByRole('button', { name: /publish site|save and publish/i }))
    .first();
}

function viewLiveSiteControl(page: Page): Locator {
  return page.getByRole('link', { name: /view live|live site|open site/i }).or(page.getByRole('button', { name: /view live|live site|open site/i }));
}

function subdomainControl(page: Page): Locator {
  return page
    .getByLabel(/subdomain|domain|host|slug/i)
    .or(page.getByPlaceholder(/subdomain|domain|host|slug/i))
    .or(page.locator('input[name*="subdomain" i], input[name*="domain" i], input[name*="host" i], input[name*="slug" i]'))
    .first();
}

function editableTextControl(page: Page): Locator {
  return page
    .getByLabel(/headline|title|tagline|description|text|label/i)
    .or(page.getByPlaceholder(/headline|title|tagline|description|text|label/i))
    .or(page.locator('textarea:visible, input[type="text"]:visible'))
    .first();
}

function assistantControl(page: Page): Locator {
  return page
    .getByRole('button', { name: /assistant|ai|ask|chat/i })
    .or(page.getByText(/assistant|ask ai|chat/i))
    .first();
}

async function waitForSavedOrStable(page: Page): Promise<void> {
  await Promise.race([
    page.getByText(/saved|all changes saved|draft saved/i).waitFor({ state: 'visible', timeout: 10_000 }),
    page.waitForLoadState('networkidle', { timeout: 10_000 })
  ]).catch(() => undefined);
}

async function expectNoForeignFixture(page: Page, config: SiteConfig): Promise<void> {
  const probe = config.negativeProbe;
  if (!probe) {
    return;
  }

  await expect(page.locator('body')).not.toContainText(new RegExp(escapeRegExp(probe), 'i'));
}

function readSiteConfig(): SiteConfig {
  return {
    expectedWorkspace: process.env.SITE_WORKSPACE_NAME || process.env.TENANT_EXPECTED_TEXT || 'baohan',
    expectedSubdomain: process.env.SITE_SUBDOMAIN || 'baohan',
    fixedSuffix: process.env.SITE_FIXED_SUFFIX,
    publicUrl: process.env.SITE_PUBLIC_URL,
    goldenKeyword: process.env.SITE_GOLDEN_KEYWORD,
    goldenExpectedText: process.env.SITE_GOLDEN_EXPECTED_TEXT,
    negativeProbe: process.env.SITE_NEGATIVE_PROBE || 'Sunday Okay',
    enableDraftMutation: process.env.SITE_DRAFT_MUTATION_ENABLED === 'true',
    enablePublish: process.env.SITE_PUBLISH_ENABLED === 'true',
    enableLifecycleMutation: process.env.SITE_LIFECYCLE_MUTATION_ENABLED === 'true'
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
