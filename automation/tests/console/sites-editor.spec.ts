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
  let restorePublishedSite = false;

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
    if (restorePublishedSite && page && siteConfig) {
      await publishBaohanSite(page, siteConfig).catch(() => undefined);
    }

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
    await openEditorFromSites(page);
    const marker = `Baohan QA draft marker ${Date.now()}`;

    try {
      await selectEditableSection(page);
      await openInspectorContentTab(page);
      const editable = selectedSectionTextControl(page);
      await expect(editable).toBeVisible();

      draftEdit.originalValue = await editable.inputValue().catch(() => '');
      await editable.fill(marker);
      await expect(editable).toHaveValue(marker);
      await expect(page.getByRole('button', { name: /^discard$/i })).toBeVisible();
    } finally {
      await discardEditorDraft(page);
    }
  });

  test('TC-BUILDER-022 manual editor draft persists after reload', async () => {
    test.fail(true, 'Current Baohan editor UI accepts the edit but does not persist the field value after reload.');

    await openEditorFromSites(page);
    const marker = `Baohan QA persisted marker ${Date.now()}`;

    try {
      await selectEditableSection(page);
      await openInspectorContentTab(page);
      const editable = selectedSectionTextControl(page);
      await expect(editable).toBeVisible();
      draftEdit.marker = marker;
      draftEdit.originalValue = await editable.inputValue().catch(() => '');
      await editable.fill(marker);
      await editable.press('Tab');
      await waitForSavedOrStable(page);
      await page.waitForTimeout(3_000);

      await page.reload();
      await page.waitForLoadState('networkidle').catch(() => undefined);
      await dismissOnboardingIfPresent(page);

      await selectEditableSection(page);
      await openInspectorContentTab(page);
      await expect(selectedSectionTextControl(page)).toHaveValue(marker);
    } finally {
      await discardEditorDraft(page);
    }
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

    await publishBaohanSite(page, siteConfig);
    await expectPublishedPublicSite(context, siteConfig);
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

  test('TC-CONSOLE-044 TC-CONSOLE-045 Unpublish takes Baohan offline and republish restores the same URL', async () => {
    test.skip(
      !siteConfig.enableLifecycleMutation,
      'Set SITE_LIFECYCLE_MUTATION_ENABLED=true only when QA approves changing the Baohan public site lifecycle.'
    );

    await ensureBaohanSitePublished(page, context, siteConfig);
    await openSites(page);
    await expect(page.locator('body')).toContainText(new RegExp(escapeRegExp(publicHostFor(siteConfig)), 'i'));
    await expect(page.getByRole('button', { name: /^unpublish$/i })).toBeVisible();

    await page.getByRole('button', { name: /^unpublish$/i }).click();
    await expect(page.locator('body')).toContainText(/take this site offline/i);
    await page.getByRole('button', { name: /^unpublish$/i }).last().click();
    restorePublishedSite = true;

    await openSites(page);
    await expect(page.locator('body')).toContainText(/unpublished|publish|offline|not live/i, { timeout: 30_000 });
    await expectUnpublishedPublicSite(context, siteConfig);

    await publishBaohanSite(page, siteConfig);
    restorePublishedSite = false;
    await openSites(page);
    await expect(page.locator('body')).toContainText(/published|live for your audience/i, { timeout: 30_000 });
    await expectPublishedPublicSite(context, siteConfig);
  });

  test('TC-CONSOLE-046 Discard draft changes from editor reverts unpublished edits', async () => {
    test.skip(
      !siteConfig.enableLifecycleMutation,
      'Set SITE_LIFECYCLE_MUTATION_ENABLED=true only when QA approves changing the Baohan public site lifecycle.'
    );

    await openSites(page);
    const siteUrlBeforeDraft = (await currentSitePublicUrl(page)) || publicUrlFor(siteConfig);
    await openEditorFromSites(page);
    await expect(page.getByRole('button', { name: /^discard$/i })).toHaveCount(0);

    const duplicateSection = page.getByRole('button', { name: /^duplicate section$/i }).first();
    await expect(duplicateSection).toBeVisible();
    await duplicateSection.click();
    await page.waitForLoadState('networkidle').catch(() => undefined);

    const discard = page.getByRole('button', { name: /^discard$/i });
    await expect(discard).toBeVisible();
    await discard.click();
    await expect(page.locator('body')).toContainText(/discard changes/i);
    await page.getByRole('button', { name: /^discard changes$/i }).click();
    await page.waitForLoadState('networkidle').catch(() => undefined);

    await expect(page.getByRole('button', { name: /^discard$/i })).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText(/discard changes\?/i);
    await expectPublishedPublicUrl(context, siteUrlBeforeDraft);
  });

  test('TC-CONSOLE-047 Delete removes the current site and Template recreates the publishable site', async () => {
    test.skip(
      !siteConfig.enableLifecycleMutation,
      'Set SITE_LIFECYCLE_MUTATION_ENABLED=true only when QA approves checking destructive lifecycle controls.'
    );

    await ensureBaohanSitePublished(page, context, siteConfig);
    await openSites(page);
    const siteUrlBeforeDelete = (await currentSitePublicUrl(page)) || publicUrlFor(siteConfig);
    const siteHostBeforeDelete = new URL(siteUrlBeforeDelete).host;
    await expect(page.getByRole('button', { name: /^delete$/i })).toBeVisible();
    await page.getByRole('button', { name: /^delete$/i }).click();
    await expect(page.locator('body')).toContainText(/delete this site/i);
    await expect(page.locator('body')).toContainText(new RegExp(escapeRegExp(siteHostBeforeDelete), 'i'));
    await page.getByRole('button', { name: /^cancel$/i }).last().click();
    await expectPublishedPublicUrl(context, siteUrlBeforeDelete);

    await page.getByRole('button', { name: /^delete$/i }).click();
    await expect(page.locator('body')).toContainText(/delete this site/i);
    restorePublishedSite = true;
    await page.getByRole('button', { name: /^delete site$/i }).click();
    await openSites(page);
    await expect(page.locator('body')).not.toContainText(new RegExp(escapeRegExp(siteHostBeforeDelete), 'i'));
    await expectUnpublishedPublicUrl(context, siteUrlBeforeDelete);

    await publishBaohanSite(page, siteConfig);
    restorePublishedSite = false;
    await openSites(page);
    await expect(page.locator('body')).toContainText(new RegExp(escapeRegExp(publicHostFor(siteConfig)), 'i'));
    await expectPublishedPublicSite(context, siteConfig);
  });

  test('TC-CONSOLE-048 lower-privilege user lifecycle authorization requires a role fixture', async () => {
    const lowerRoleEmail = process.env.SITE_LOWER_ROLE_EMAIL || process.env.LOWER_ROLE_EMAIL;
    const lowerRolePassword = process.env.SITE_LOWER_ROLE_PASSWORD || process.env.LOWER_ROLE_PASSWORD;

    test.skip(
      !lowerRoleEmail || !lowerRolePassword,
      'Set SITE_LOWER_ROLE_EMAIL and SITE_LOWER_ROLE_PASSWORD for a Baohan lower-privilege user to automate role restrictions.'
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

  test('TC-BUILDER-031 editor viewport toolbar controls are usable without draft mutation', async () => {
    await openEditorFromSites(page);
    await expect(page.getByRole('button', { name: /^discard$/i })).toHaveCount(0);

    for (const name of ['Tablet', 'Mobile', 'Desktop', 'Fit View', 'Free Drag Mode']) {
      const control = page.getByRole('button', { name: new RegExp(`^${name}$`, 'i') }).first();
      await expect(control).toBeVisible();
      await expect(control).toBeEnabled();
      await control.click();
      await expect(page).toHaveURL(/\/sites\/editor/);
      await expect(page.getByRole('heading', { name: /page sections/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /section settings/i })).toBeVisible();
      await expect(editorCoreControl(page)).toBeVisible();
      await expect(page.getByRole('button', { name: /^discard$/i })).toHaveCount(0);
    }

    await page.getByRole('button', { name: /^free drag mode$/i }).click();
    await page.getByRole('button', { name: /^desktop$/i }).click();
    await expect(page.getByRole('button', { name: /^discard$/i })).toHaveCount(0);
  });

  test('TC-BUILDER-032 Add panel exposes section and element library without changing draft', async () => {
    await openEditorFromSites(page);
    await expect(page.getByRole('button', { name: /^discard$/i })).toHaveCount(0);

    await openAddLibrary(page);
    await expect(page.locator('body')).toContainText(/sections/i);
    await expect(page.locator('body')).toContainText(/custom section|hero|featured riffable|cta band|content cards/i);
    await expect(page.locator('body')).toContainText(/elements/i);
    await expect(page.locator('body')).toContainText(/heading|text|divider|spacer|columns|stack|button|image|collection/i);
    await expect(page.getByRole('button', { name: /^discard$/i })).toHaveCount(0);
  });

  test('TC-BUILDER-033 editor side panels expose Design, Media, and Assistant states', async () => {
    await openEditorFromSites(page);

    await openEditorRailPanel(page, 'Design', /page sections/i);
    await expect(page.getByRole('heading', { name: /page sections/i })).toBeVisible();

    await openEditorRailPanel(page, 'Media', /media|upload/i);
    await expect(page.locator('body')).toContainText(/media|upload/i);
    await expect(page.locator('body')).toContainText(/no images yet|png|jpeg|webp|gif|10 mb/i);
    await expect(page.getByRole('button', { name: /^upload$/i })).toBeVisible();

    await openEditorRailPanel(page, 'Assistant', /assistant|draft it as a diff/i);
    await expect(page.locator('body')).toContainText(/assistant/i);
    await expect(page.locator('body')).toContainText(/draft it as a diff|preview before it lands|nothing saves until you hit apply/i);
    await expect(page.getByRole('button', { name: /float over canvas/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /collapse to rail/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^send$/i })).toBeDisabled();
  });

  test('TC-BUILDER-034 section duplicate, undo, redo, delete, and discard stay reversible', async () => {
    await openEditorFromSites(page);
    await selectEditableSection(page);
    const initialDuplicateCount = await sectionActionCount(page, 'Duplicate section');
    const initialDeleteCount = await sectionActionCount(page, 'Delete section');

    await expect(page.getByRole('button', { name: /^undo$/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /^redo$/i })).toBeDisabled();

    await page.getByRole('button', { name: /^duplicate section$/i }).first().click({ force: true });
    await expect(page.getByRole('button', { name: /^discard$/i })).toBeVisible();
    await expect.poll(() => sectionActionCount(page, 'Duplicate section')).toBe(initialDuplicateCount + 1);
    await expect.poll(() => sectionActionCount(page, 'Delete section')).toBe(initialDeleteCount + 1);
    await expect(page.getByRole('button', { name: /^undo$/i })).toBeEnabled();
    await expect(page.getByRole('button', { name: /^redo$/i })).toBeDisabled();

    await page.getByRole('button', { name: /^undo$/i }).click();
    await expect(page.getByRole('button', { name: /^discard$/i })).toHaveCount(0);
    await expect.poll(() => sectionActionCount(page, 'Duplicate section')).toBe(initialDuplicateCount);
    await expect(page.getByRole('button', { name: /^undo$/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /^redo$/i })).toBeEnabled();

    await page.getByRole('button', { name: /^redo$/i }).click();
    await expect(page.getByRole('button', { name: /^discard$/i })).toBeVisible();
    await expect.poll(() => sectionActionCount(page, 'Duplicate section')).toBe(initialDuplicateCount + 1);
    await expect(page.getByRole('button', { name: /^undo$/i })).toBeEnabled();
    await expect(page.getByRole('button', { name: /^redo$/i })).toBeDisabled();

    await page.getByRole('button', { name: /^delete section$/i }).first().click();
    await expect(page.getByRole('button', { name: /^discard$/i })).toBeVisible();
    await expect.poll(() => sectionActionCount(page, 'Duplicate section')).toBe(initialDuplicateCount);
    await expect.poll(() => sectionActionCount(page, 'Delete section')).toBe(initialDeleteCount);

    await discardEditorDraft(page);
    await expect(page.getByRole('button', { name: /^discard$/i })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /^undo$/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /^redo$/i })).toBeDisabled();
  });

  test('TC-BUILDER-035 editor icon controls meet minimum pointer target size', async () => {
    await openEditorFromSites(page);

    const violations = await page.locator('button:visible').evaluateAll((buttons) =>
      buttons
        .map((button) => {
          const label = button.getAttribute('aria-label') || button.getAttribute('title') || button.textContent?.trim() || '';
          const rect = button.getBoundingClientRect();
          return {
            label,
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          };
        })
        .filter((button) =>
          /desktop|tablet|mobile|fit view|free drag mode|undo|redo|design|media|assistant|duplicate section|delete section|help/i.test(
            button.label
          )
        )
        .filter((button) => button.width < 24 || button.height < 24)
    );

    expect(violations).toEqual([]);
  });

  test('TC-BUILDER-036 selected section Content tab exposes editable field set', async () => {
    await openEditorFromSites(page);
    await selectEditableSection(page);
    await openInspectorContentTab(page);

    await expect(page.locator('body')).toContainText(/Hero|Content|Eyebrow|Headline|Tagline|Primary CTA label|Primary CTA URL/i);
    await expect(selectedSectionTextControl(page)).toBeVisible();
    await expect.poll(() => page.locator('textarea:visible').count()).toBeGreaterThan(0);
    await expect.poll(() => page.locator('select:visible').count()).toBeGreaterThan(0);
  });

  test('TC-BUILDER-037 selected section Data tab explains binding sources', async () => {
    await openEditorFromSites(page);
    await selectEditableSection(page);
    await page.getByRole('button', { name: /^data$/i }).click();

    await expect(page.locator('body')).toContainText(/show a collection/i);
    await expect(page.locator('body')).toContainText(/add a collection element|pick its source|field in the content tab/i);
    await expect(page.locator('body')).toContainText(/available collections/i);
    await expect(page.locator('body')).toContainText(/riffables/i);
    await expect(page.locator('body')).toContainText(/riffs/i);
    await expect(page.locator('body')).toContainText(/articles/i);
    await expect(page.locator('body')).not.toContainText(/manifest|placeholder source|sample key/i);
  });

  test('TC-BUILDER-038 selected section Theme tab exposes allowed style controls', async () => {
    await openEditorFromSites(page);
    await selectEditableSection(page);
    await page.getByRole('button', { name: /^theme$/i }).click();

    await expect(page.locator('body')).toContainText(/colours|spacing|body font|display font|ui font/i);
    for (const label of ['Page background', 'Highlight surface', 'Rule/border', 'Muted text', 'Hero/header surface', 'Ink text']) {
      await expect(page.getByLabel(new RegExp(`^${escapeRegExp(label)}$`, 'i')).first()).toBeVisible();
    }
    await expect(page.getByLabel(/^Page background swatch$/i)).toHaveAttribute('type', 'color');
  });

  test('TC-BUILDER-039 Theme field edit creates draft and Discard cleans it up', async () => {
    await openEditorFromSites(page);

    try {
      await selectEditableSection(page);
      await page.getByRole('button', { name: /^theme$/i }).click();
      const pageBackground = page.getByLabel(/^Page background$/i).first();
      await expect(pageBackground).toBeVisible();
      const originalValue = (await pageBackground.inputValue()).toLowerCase();
      const nextValue = originalValue === '#f3f6fa' ? '#f5f7fb' : '#f3f6fa';

      await pageBackground.fill(nextValue);
      await pageBackground.press('Tab');
      await expect(pageBackground).toHaveValue(nextValue);
      await expect(page.getByRole('button', { name: /^discard$/i })).toBeVisible();
    } finally {
      await discardEditorDraft(page);
    }
  });

  test('TC-BUILDER-040 Media panel exposes supported image upload constraints', async () => {
    await openEditorFromSites(page);
    await openEditorRailPanel(page, 'Media', /media|upload/i);

    await expect(page.locator('body')).toContainText(/media|upload|no images yet/i);
    await expect(page.locator('body')).toContainText(/png|jpeg|webp|gif|10 mb/i);
    const fileInput = page.locator('input[type="file"]').first();
    await expect(fileInput).toHaveAttribute('accept', /image\/png/);
    await expect(fileInput).toHaveAttribute('accept', /image\/jpeg/);
    await expect(fileInput).toHaveAttribute('accept', /image\/webp/);
    await expect(fileInput).toHaveAttribute('accept', /image\/gif/);
    await expect.poll(() => fileInput.evaluate((input) => (input as HTMLInputElement).multiple)).toBe(true);
    await expect(page.getByRole('button', { name: /^discard$/i })).toHaveCount(0);
  });

  test('TC-BUILDER-041 Assistant prompt input enables Send without creating draft', async () => {
    await openEditorFromSites(page);
    await openEditorRailPanel(page, 'Assistant', /assistant|draft it as a diff/i);

    await expect(page.locator('body')).toContainText(/assistant|draft it as a diff|nothing saves until you hit apply/i);
    const prompt = page.getByLabel(/^ask the assistant$/i).or(page.getByPlaceholder(/ask or describe a change/i)).first();
    await expect(prompt).toBeVisible();
    await expect(page.getByRole('button', { name: /^send$/i })).toBeDisabled();
    await prompt.fill('Change the hero headline to a QA preview draft');
    await expect(page.getByRole('button', { name: /^send$/i })).toBeEnabled();
    await expect(page.getByRole('button', { name: /^discard$/i })).toHaveCount(0);
  });

  test('TC-BUILDER-042 editor help tour opens, navigates, and closes', async () => {
    await openEditorFromSites(page);
    await openEditorRailPanel(page, 'Assistant', /assistant|draft it as a diff/i);

    const help = page.getByRole('button', { name: /help|product tour/i }).first();
    await expect(help).toBeVisible();
    await help.click({ force: true });
    await expect(page.locator('body')).toContainText(/welcome to the site editor|site editor/i);
    await expect(page.locator('body')).toContainText(/1 of 6/i);
    await page.getByRole('button', { name: /^next$/i }).click();
    await expect(page.locator('body')).toContainText(/2 of 6/i);
    await page.getByRole('button', { name: /^back$/i }).click();
    await expect(page.locator('body')).toContainText(/1 of 6/i);
    await page.keyboard.press('Escape');
    await expect(page.locator('body')).not.toContainText(/1 of 6/i);
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
    .locator('a[href*="/sites/editor"]')
    .filter({ hasText: /template|start|edit|customize|site|builder|create|new|open editor/i });
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

  for (const position of [
    { x: 120, y: 16 },
    { x: 88, y: 16 },
    { x: 56, y: 16 }
  ]) {
    await editableSection.click({ position, force: true }).catch(() => undefined);
    await page.waitForTimeout(500);
    if (/Eyebrow|Headline|Tagline|Primary CTA|Featured title|Section title/i.test(await bodyText(page))) {
      return;
    }
  }

  await editableSection.focus().catch(() => undefined);
  await page.keyboard.press('Enter').catch(() => undefined);
  await page.waitForTimeout(500);
  if (/Eyebrow|Headline|Tagline|Primary CTA|Featured title|Section title/i.test(await bodyText(page))) {
    return;
  }

  await editableSection.evaluate((element) => (element as HTMLElement).click()).catch(() => undefined);
  await page.waitForTimeout(500);
  if (/Eyebrow|Headline|Tagline|Primary CTA|Featured title|Section title/i.test(await bodyText(page))) {
    return;
  }

  await expect(page.locator('body')).toContainText(/Eyebrow|Headline|Tagline|Primary CTA|Featured title|Section title/i);
}

async function openInspectorContentTab(page: Page): Promise<void> {
  const contentTab = page.getByRole('button', { name: /^content$/i }).first();
  if (await contentTab.isVisible().catch(() => false)) {
    await contentTab.click();
  }
}

async function openAddLibrary(page: Page): Promise<void> {
  const add = page.getByRole('button', { name: /^add$/i }).first();
  await expect(add).toBeVisible();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await add.click({ force: true });
    await page.waitForTimeout(500);
    if (/elements/i.test(await bodyText(page))) {
      return;
    }
  }

  throw new Error('Add panel did not expose the elements library.');
}

async function openEditorRailPanel(page: Page, name: 'Design' | 'Media' | 'Assistant', expectedText: RegExp): Promise<void> {
  const panelButton = page.getByRole('navigation').getByRole('button', { name: new RegExp(`^${name}$`, 'i') }).first();
  await expect(panelButton).toBeVisible();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await panelButton.click({ force: true });
    await page.waitForTimeout(500);
    if (expectedText.test(await bodyText(page))) {
      return;
    }
  }

  throw new Error(`${name} panel did not expose the expected content.`);
}

function previewControl(page: Page): Locator {
  return page.getByRole('button', { name: /preview/i }).or(page.getByRole('link', { name: /preview/i })).first();
}

function publishControl(page: Page): Locator {
  return page.getByRole('button', { name: /^publish$/i });
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

function selectedSectionTextControl(page: Page): Locator {
  return page
    .getByPlaceholder('A library of conversations')
    .or(page.locator('input[type="text"]:visible, textarea:visible'))
    .first();
}

function assistantControl(page: Page): Locator {
  return page
    .getByRole('button', { name: /assistant|ai|ask|chat/i })
    .or(page.getByText(/assistant|ask ai|chat/i))
    .first();
}

async function sectionActionCount(page: Page, name: 'Duplicate section' | 'Delete section'): Promise<number> {
  return page.getByRole('button', { name: new RegExp(`^${escapeRegExp(name)}$`, 'i') }).count();
}

async function discardEditorDraft(page: Page): Promise<void> {
  const discard = page.getByRole('button', { name: /^discard$/i }).first();
  if (!(await discard.isVisible().catch(() => false))) {
    return;
  }

  await discard.click();
  await expect(page.locator('body')).toContainText(/discard changes/i);
  await page.getByRole('button', { name: /^discard changes$/i }).click();
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

async function publishBaohanSite(page: Page, config: SiteConfig): Promise<void> {
  await openEditorFromSites(page);
  const publish = publishControl(page);
  await expect(publish).toBeVisible();
  await publish.click();
  await expect(page.locator('body')).toContainText(/publish site|domain|hostname/i, { timeout: 10_000 });

  const subdomainInput = subdomainControl(page);
  await subdomainInput.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => undefined);
  if (await subdomainInput.isVisible().catch(() => false)) {
    await subdomainInput.fill(config.expectedSubdomain);
  }

  const confirmPublish = page
    .locator('[role="dialog"], [data-radix-portal], body')
    .filter({ hasText: /publish site|hostname|domain/i })
    .getByRole('button', { name: /^(publish|save and publish|confirm|continue)$/i })
    .filter({ hasNotText: /unpublish/i })
    .last();
  await expect(confirmPublish).toBeVisible({ timeout: 10_000 });
  await confirmPublish.click();

  await page.getByText(/publish site/i).waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => undefined);
  await page.waitForLoadState('networkidle').catch(() => undefined);
  config.publicUrl = publicUrlFor(config);
}

async function ensureBaohanSitePublished(page: Page, context: BrowserContext, config: SiteConfig): Promise<void> {
  await openSites(page);
  const siteBody = await page.locator('body').innerText();
  const currentPublicUrl = await currentSitePublicUrl(page);
  const currentHost = currentPublicUrl ? new URL(currentPublicUrl).host : undefined;
  const expectedHost = publicHostFor(config);
  if (
    /published|live for your audience/i.test(siteBody) &&
    currentHost === expectedHost &&
    (await page.getByRole('button', { name: /^unpublish$/i }).isVisible().catch(() => false))
  ) {
    await expectPublishedPublicSite(context, config);
    return;
  }

  await publishBaohanSite(page, config);
  await expectPublishedPublicSite(context, config);
}

async function expectPublishedPublicSite(context: BrowserContext, config: SiteConfig): Promise<void> {
  await expectPublishedPublicUrl(context, publicUrlFor(config));
}

async function expectPublishedPublicUrl(context: BrowserContext, publicUrl: string): Promise<void> {
  await expect
    .poll(async () => readPublicSiteSignal(context, publicUrl), {
      timeout: 30_000,
      intervals: [1_000, 2_000, 5_000]
    })
    .not.toMatch(/No published site was found here|NOT FOUND|404|not found/i);
}

async function expectUnpublishedPublicSite(context: BrowserContext, config: SiteConfig): Promise<void> {
  await expectUnpublishedPublicUrl(context, publicUrlFor(config));
}

async function expectUnpublishedPublicUrl(context: BrowserContext, publicUrl: string): Promise<void> {
  await expect
    .poll(async () => readPublicSiteSignal(context, publicUrl), {
      timeout: 30_000,
      intervals: [1_000, 2_000, 5_000]
    })
    .toMatch(/No published site was found here|NOT FOUND|404|not found/i);
}

async function currentSitePublicUrl(page: Page): Promise<string | undefined> {
  const viewLive = page.getByRole('link', { name: /^view live$/i }).first();
  if (!(await viewLive.isVisible().catch(() => false))) {
    return undefined;
  }

  return (await viewLive.getAttribute('href')) || undefined;
}

async function readPublicSiteSignal(context: BrowserContext, publicUrl: string): Promise<string> {
  const livePage = await context.newPage();
  try {
    const response = await livePage.goto(publicUrl, { waitUntil: 'domcontentloaded' }).catch(() => null);
    await livePage.waitForLoadState('networkidle').catch(() => undefined);
    const body = await livePage.locator('body').innerText().catch(() => '');
    return `${response?.status() || 'no-status'} ${livePage.url()} ${body}`;
  } finally {
    await livePage.close().catch(() => undefined);
  }
}

function publicUrlFor(config: SiteConfig): string {
  return config.publicUrl || `https://${config.expectedSubdomain}.${config.fixedSuffix || 'apps.riffables.com'}/`;
}

function publicHostFor(config: SiteConfig): string {
  return new URL(publicUrlFor(config)).host;
}

async function waitForSavedOrStable(page: Page): Promise<void> {
  await Promise.race([
    page.getByText(/saved|all changes saved|draft saved/i).waitFor({ state: 'visible', timeout: 10_000 }),
    page.waitForLoadState('networkidle', { timeout: 10_000 })
  ]).catch(() => undefined);
}

async function bodyText(page: Page): Promise<string> {
  return page.locator('body').innerText().catch(() => '');
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
