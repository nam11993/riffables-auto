import { expect, test, type Browser, type BrowserContext, type Locator, type Page } from '@playwright/test';

type Account = {
  email: string;
  name: string;
  password: string;
  uniqueId: string;
};

type Credentials = {
  email?: string;
  password?: string;
};

const MAIN_SCREENS = [
  { name: 'Home', path: '/' },
  { name: 'Sources', path: '/sources' },
  { name: 'Content', path: '/content' },
  { name: 'Sites', path: '/sites' }
] as const;

test.describe('New-creator console and editor onboarding', () => {
  test.describe.configure({ mode: 'serial' });

  let context: BrowserContext;
  let page: Page;
  let account: Account;

  test.beforeAll(async ({ browser }) => {
    test.skip(!canCreateAccount(), signupConfigurationMessage());

    account = newSignupAccount('tour');
    context = await browser.newContext({ baseURL: baseURL(), viewport: { width: 1440, height: 900 } });
    page = await context.newPage();
    await createAccountAndOrganization(page, account, { dismissChecklist: true });
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test('TC-ONBOARD-008 new-user choice starts the current screen tour immediately', async () => {
    markConsentExpectedFailure();
    await expectConsentDialog(page);
    await page.getByRole('button', { name: /show me around/i }).click();

    await expectConsentDialogHidden(page);
    await expectTourVisible(page);
    await expect(page).toHaveURL(/\/$/);
  });

  test('TC-ONBOARD-004 tour provides Back, Next, and progress affordances', async () => {
    if (!(await tourProgress(page).isVisible().catch(() => false))) {
      await page.goto('/sources');
      await page.waitForLoadState('networkidle').catch(() => undefined);
      await expectConsentDialog(page);
      await page.getByRole('button', { name: /show me around/i }).click();
    }
    await expectTourVisible(page);
    const initialProgress = await tourProgress(page).innerText();
    const next = page.getByRole('button', { name: /^next$/i });
    await expect(next).toBeVisible();
    await next.click();

    const secondProgress = await tourProgress(page).innerText();
    expect(secondProgress).not.toBe(initialProgress);

    const back = page.getByRole('button', { name: /^back$/i });
    await expect(back).toBeVisible();
    await back.click();
    await expect(tourProgress(page)).toHaveText(initialProgress);
  });

  test('TC-ONBOARD-001 each main screen starts its own tour on first visit', async () => {
    const tourOrder = [
      { name: 'Sources', path: '/sources' },
      { name: 'Home', path: '/' },
      { name: 'Content', path: '/content' },
      { name: 'Sites', path: '/sites' }
    ];

    for (const screen of tourOrder) {
      if (!page.url().endsWith(screen.path)) {
        await page.goto(screen.path);
        await page.waitForLoadState('networkidle').catch(() => undefined);
      }
      await expectTourVisible(page);
      await expect(tourRoot(page), `${screen.name} should expose its own first-visit tour`).toBeVisible();
      await closeTour(page);
    }
  });

  test('TC-ONBOARD-006 first-visit main-screen tour appears only once', async () => {
    markTourSeenExpectedFailure();
    await page.goto('/sources');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expect.soft(tourProgress(page), 'Closed tour should not auto-start on revisit').toBeHidden();
    if (await tourProgress(page).isVisible().catch(() => false)) {
      await closeTour(page);
    }

    await page.reload();
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expect.soft(tourProgress(page), 'Seen state should survive refresh').toBeHidden();
    if (await tourProgress(page).isVisible().catch(() => false)) {
      await closeTour(page);
    }

    await openHelpTour(page);
    await expectTourVisible(page);
    await closeTour(page);
  });

  test('TC-ONBOARD-002 closing early records seen state while Help can replay', async () => {
    markTourSeenExpectedFailure();
    await page.goto('/content');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expect.soft(tourProgress(page), 'Previously closed Content tour should remain hidden').toBeHidden();
    if (await tourProgress(page).isVisible().catch(() => false)) {
      await closeTour(page);
    }

    await openHelpTour(page);
    await expectTourVisible(page);
    await closeTour(page);

    await page.reload();
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expect.soft(tourProgress(page), 'Closing Help replay early should record seen state').toBeHidden();
    if (await tourProgress(page).isVisible().catch(() => false)) {
      await closeTour(page);
    }

    await openHelpTour(page);
    await expectTourVisible(page);
    await closeTour(page);
  });

  test('TC-ONBOARD-003 editor tour covers major regions, remembers seen state, and replays', async () => {
    markTourSeenExpectedFailure();
    await openEditorFromSites(page);
    await expectTourVisible(page);

    const tourCopy: string[] = [];
    for (let guard = 0; guard < 10; guard += 1) {
      tourCopy.push(await tourRoot(page).innerText());
      const next = page.getByRole('button', { name: /^next$/i });
      if (!(await next.isVisible().catch(() => false))) {
        break;
      }
      await next.click();
    }

    const combinedCopy = tourCopy.join(' ');
    expect(combinedCopy).toMatch(/add|arrange|section/i);
    expect(combinedCopy).toMatch(/canvas|page/i);
    expect(combinedCopy).toMatch(/inspector|content|data|theme|settings/i);
    expect(combinedCopy).toMatch(/preview/i);
    expect(combinedCopy).toMatch(/publish/i);
    await finishOrCloseTour(page);

    await page.reload();
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expect.soft(tourProgress(page), 'Completed editor tour should not auto-start after reload').toBeHidden();
    if (await tourProgress(page).isVisible().catch(() => false)) {
      await closeTour(page);
    }

    await openHelpTour(page);
    await expectTourVisible(page);
    await closeTour(page);
  });
});

test.describe('Onboarding consent dismissal and returning-creator behavior', () => {
  test.describe.configure({ mode: 'serial' });

  let context: BrowserContext;
  let page: Page;
  let account: Account;

  test.beforeAll(async ({ browser }) => {
    test.skip(!canCreateAccount(), signupConfigurationMessage());

    account = newSignupAccount('returning');
    context = await browser.newContext({ baseURL: baseURL(), viewport: { width: 1440, height: 900 } });
    page = await context.newPage();
    await createAccountAndOrganization(page, account, { dismissChecklist: true });
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test('TC-ONBOARD-010 dismissing consent saves no decision and re-offers it', async () => {
    await page.goto('/sources');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expectConsentDialog(page);
    await dismissConsentWithoutChoice(page);
    await expectConsentDialogHidden(page);

    await page.reload();
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expectConsentDialog(page);
  });

  test('TC-ONBOARD-009 returning-user choice suppresses auto tours but keeps Help replay', async () => {
    await expectConsentDialog(page);
    await page.getByRole('button', { name: "I've been here before" }).click();
    await expectConsentDialogHidden(page);

    for (const screen of MAIN_SCREENS) {
      await page.goto(screen.path);
      await page.waitForLoadState('networkidle').catch(() => undefined);
      await expectTourHidden(page);
      await expect(helpTourControl(page), `${screen.name} should keep manual tour replay`).toBeVisible();
    }

    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await openHelpTour(page);
    await expectTourVisible(page);
    await closeTour(page);
  });

  test('TC-ONBOARD-012 editor honors returning-user consent and retains manual replay', async () => {
    await openEditorFromSites(page);
    await expectTourHidden(page);
    await expect(helpTourControl(page)).toBeVisible();

    await openHelpTour(page);
    await expectTourVisible(page);
    await closeTour(page);
  });
});

test('TC-ONBOARD-005 tour state is isolated by creator identity', async ({ browser }) => {
  test.slow();
  test.skip(!canCreateAccount(), signupConfigurationMessage());
  markTourSeenExpectedFailure();

  const creatorA = newSignupAccount('creator-a');
  const creatorB = newSignupAccount('creator-b');
  const context = await browser.newContext({ baseURL: baseURL(), viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await createAccountAndOrganization(page, creatorA, { dismissChecklist: true });
    await page.goto('/sources');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expectConsentDialog(page);
    await page.getByRole('button', { name: /show me around/i }).click();
    await expectTourVisible(page);
    await closeTour(page);
    await signOut(page);

    await createAccountAndOrganization(page, creatorB, { dismissChecklist: true });
    await page.goto('/sources');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expectConsentDialog(page);
    await page.getByRole('button', { name: /show me around/i }).click();
    await expectTourVisible(page);
    await closeTour(page);
    await signOut(page);

    await signIn(page, creatorA);
    await selectFirstOrganizationIfPresent(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expectConsentDialogHidden(page);
    await expectTourHidden(page);
    await expect(helpTourControl(page)).toBeVisible();
  } finally {
    await context.close();
  }
});

test('TC-ONBOARD-011 grandfathered creator is not forced through new consent', async ({ page }) => {
  const credentials = grandfatheredCredentials();
  test.skip(
    !credentials.email ||
      !credentials.password ||
      process.env.ONBOARD_GRANDFATHERED_CONFIRMED !== 'true',
    'Needs a browser fixture that already contains the completed Home-tour key; credentials alone do not satisfy this precondition.'
  );

  await signIn(page, credentials);
  await selectFirstOrganizationIfPresent(page);

  for (const screen of MAIN_SCREENS) {
    await page.goto(screen.path);
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expectConsentDialogHidden(page);
    await expectTourHidden(page);
  }

  await expect(helpTourControl(page)).toBeVisible();
});

test.describe('Getting-started checklist on empty tenant', () => {
  test.describe.configure({ mode: 'serial' });

  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    test.skip(!canCreateAccount(), signupConfigurationMessage());

    const account = newSignupAccount('checklist-empty');
    context = await browser.newContext({ baseURL: baseURL(), viewport: { width: 1440, height: 900 } });
    page = await context.newPage();
    await createAccountAndOrganization(page, account);
    await expect(checklistSurface(page)).toBeVisible();
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test('TC-ONBOARD-013 checklist auto-opens for the active zero-source tenant', async () => {
    markChecklistExpectedFailure();

    const checklist = checklistSurface(page);
    await expect(checklist).toBeVisible();
    await expect(checklist).toContainText(/connect a source/i);
    await expect(checklist).toContainText(/0 of 3 done/i);
  });

  test('TC-ONBOARD-014 checklist orders three steps and routes the current action', async () => {
    markChecklistExpectedFailure();

    const checklist = checklistSurface(page);
    await expect(checklist).toBeVisible();
    const copy = await checklist.innerText();
    expect(copy).toMatch(/connect a source[\s\S]*turn videos into riffs[\s\S]*edit your site/i);

    const connectAction = checklist.getByRole('link', { name: /connect|source/i }).or(
      checklist.getByRole('button', { name: /connect|source/i })
    );
    await expect(connectAction.first()).toBeVisible();
    await connectAction.first().click();
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expect(page).toHaveURL(/\/sources/);
    if (await consentDialog(page).isVisible().catch(() => false)) {
      await page.getByRole('button', { name: "I've been here before" }).click();
      await expectConsentDialogHidden(page);
    }

    await openHome(page);
    await expect(checklistSurface(page)).toContainText(/connect a source/i);
  });

  test('TC-ONBOARD-017 incomplete checklist can be dismissed and reopened without changing progress', async () => {
    markChecklistExpectedFailure();
    await openHome(page);

    const checklist = checklistSurface(page);
    await expect(checklist).toBeVisible();
    const before = await checklist.innerText();
    await closeChecklist(page);
    await expect(checklistSurface(page)).toBeHidden();
    if (await consentDialog(page).isVisible().catch(() => false)) {
      await page.getByRole('button', { name: "I've been here before" }).click();
      await expectConsentDialogHidden(page);
    }
    await expect(page.getByText(/overview/i).first()).toBeVisible();

    await page.reload();
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expect(checklistSurface(page)).toBeHidden();

    const reopen = checklistReopenControl(page);
    await expect(reopen).toBeVisible();
    await reopen.click();
    await expect(checklistSurface(page)).toBeVisible();
    expect(normalizeText(await checklistSurface(page).innerText())).toBe(normalizeText(before));
  });

  test('TC-ONBOARD-020 checklist remains independent from tours and adds no checklist polling endpoint', async () => {
    markChecklistExpectedFailure();
    const checklistRequests: string[] = [];
    const recordChecklistRequest = (request: { resourceType(): string; url(): string }) => {
      if (/xhr|fetch/i.test(request.resourceType()) && /onboard|checklist|getting-started/i.test(request.url())) {
        checklistRequests.push(request.url());
      }
    };
    page.on('request', recordChecklistRequest);

    try {
      await openHome(page);
      await ensureChecklistOpen(page);
      const checklistBefore = await checklistSurface(page).innerText();
      await closeChecklist(page);

      await openHelpTour(page);
      await expectTourVisible(page);
      await closeTour(page);

      await checklistReopenControl(page).click();
      await expect(checklistSurface(page)).toBeVisible();
      expect(normalizeText(await checklistSurface(page).innerText())).toBe(normalizeText(checklistBefore));
      await page.waitForTimeout(3_000);
      expect(checklistRequests).toEqual([]);
    } finally {
      page.off('request', recordChecklistRequest);
    }
  });
});

test('TC-ONBOARD-015 checklist advances only from real tenant state', async ({ browser }) => {
  const credentials = partialChecklistCredentials();
  test.skip(
    !credentials.email || !credentials.password || process.env.ONBOARD_STATE_MUTATION_ENABLED !== 'true',
    'Needs a controlled partial tenant plus ONBOARD_STATE_MUTATION_ENABLED=true so source/site state can be changed and cleaned up.'
  );

  await withAuthenticatedPage(browser, credentials, async (page) => {
    await openHome(page);
    const checklist = checklistSurface(page);
    await expect(checklist).toBeVisible();
    await expect(checklist).toContainText(/turn videos into riffs|edit your site/i);
    const before = await checklist.innerText();

    const currentAction = checklist.getByRole('link').or(checklist.getByRole('button')).filter({ hasText: /video|riff|site/i }).first();
    await expect(currentAction).toBeVisible();
    await currentAction.click();
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await openHome(page);
    await expect(checklistSurface(page)).toContainText(before);
  });
});

test('TC-ONBOARD-016 queued crawl completes the riffs step immediately', async ({ browser }) => {
  const credentials = queuedChecklistCredentials();
  test.skip(
    !credentials.email || !credentials.password || process.env.ONBOARD_CRAWL_MUTATION_ENABLED !== 'true',
    'Needs a connected source with a fresh eligible video and ONBOARD_CRAWL_MUTATION_ENABLED=true.'
  );

  await withAuthenticatedPage(browser, credentials, async (page) => {
    await openHome(page);
    await expect(checklistSurface(page)).toContainText(/turn videos into riffs/i);

    const action = checklistSurface(page).getByRole('link').or(
      checklistSurface(page).getByRole('button')
    ).filter({ hasText: /video|riff/i }).first();
    await expect(action).toBeVisible();
    await action.click();
    await page.waitForLoadState('networkidle').catch(() => undefined);

    const queue = page.getByRole('button', { name: /ingest selected|run crawl|queue/i }).first();
    await expect(queue).toBeVisible();
    await queue.click();
    await openHome(page);
    await expect(checklistSurface(page)).toContainText(/edit your site/i);
  });
});

test('TC-ONBOARD-018 completed checklist retires from automatic display', async ({ browser }) => {
  const credentials = completedChecklistCredentials();
  test.skip(!credentials.email || !credentials.password, 'Set ONBOARD_COMPLETED_EMAIL and ONBOARD_COMPLETED_PASSWORD.');

  await withAuthenticatedPage(browser, credentials, async (page) => {
    await openHome(page);
    await expect(checklistSurface(page)).toBeHidden();
    await expect(page.getByText(/overview/i).first()).toBeVisible();

    await page.reload();
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expect(checklistSurface(page)).toBeHidden();
    await expect(page.locator('h1:visible')).toBeVisible();
  });
});

test('TC-ONBOARD-019 checklist state is isolated per operator and tenant', async ({ browser }) => {
  const operatorA = multiTenantOperatorCredentials();
  const operatorB = secondOperatorCredentials();
  test.skip(
    !operatorA.email || !operatorA.password || !operatorB.email || !operatorB.password,
    'Needs Operator A with two tenants and Operator B in Tenant A.'
  );

  await withAuthenticatedPage(browser, operatorA, async (page) => {
    await openHome(page);
    await expect(checklistSurface(page)).toBeVisible();
    await closeChecklist(page);
    await switchWorkspace(page, 1);
    await expect(checklistSurface(page)).toBeVisible();
    await switchWorkspace(page, 0);
    await expect(checklistSurface(page)).toBeHidden();
  });

  await withAuthenticatedPage(browser, operatorB, async (page) => {
    await openHome(page);
    await expect(checklistSurface(page)).toBeVisible();
  });
});

async function withAuthenticatedPage(
  browser: Browser,
  credentials: Credentials,
  callback: (page: Page) => Promise<void>
): Promise<void> {
  const context = await browser.newContext({ baseURL: baseURL(), viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    await signIn(page, credentials);
    await selectFirstOrganizationIfPresent(page);
    await callback(page);
  } finally {
    await context.close();
  }
}

async function createAccountAndOrganization(
  page: Page,
  account: Account,
  options: { dismissChecklist?: boolean } = {}
): Promise<void> {
  await page.goto('/sign-in');
  await page.getByRole('button', { name: 'Create an account' }).click();
  await expect(page.getByText('Create your account')).toBeVisible();
  await page.locator('input[type="text"]').fill(account.name);
  await page.locator('input[type="email"]').fill(account.email);
  await page.locator('button[type="submit"]').click();
  await expect(page.getByText(new RegExp(escapeRegExp(account.email), 'i'))).toBeVisible();
  await page.locator('input[type="password"]').fill(account.password);
  await submitAccountWithRetry(page);
  await expect(page).toHaveURL(/\/setup-organization/);

  const organizationName = `Onboard ${account.uniqueId}`;
  const organizationSlug = `onboard-${account.uniqueId.toLowerCase()}`;
  const inputs = page.locator('input[type="text"]');
  await inputs.nth(0).fill(organizationName);
  await inputs.nth(1).fill(organizationSlug);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes('/setup-organization'), { timeout: 20_000 }),
    page.getByRole('button', { name: 'Create organization' }).click()
  ]);
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await expect(page).toHaveURL(/\/$/);
  if (options.dismissChecklist && await checklistSurface(page).isVisible().catch(() => false)) {
    await closeChecklist(page);
  }
}

async function submitAccountWithRetry(page: Page): Promise<void> {
  const submit = page.locator('button[type="submit"]');
  const delays = [0, 15_000, 30_000];

  for (const delay of delays) {
    if (delay) {
      await page.waitForTimeout(delay);
    }
    await submit.click();
    if (await page.waitForURL(/\/setup-organization/, { timeout: 15_000 }).then(() => true).catch(() => false)) {
      return;
    }
    if (!(await page.getByText(/too many requests/i).isVisible().catch(() => false))) {
      break;
    }
  }

  await expect(page).toHaveURL(/\/setup-organization/);
}

async function signIn(page: Page, credentials: Credentials): Promise<void> {
  await page.goto('/sign-in');
  await page.locator('input[type="email"]').fill(credentials.email!);
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await page.locator('input[type="password"]').fill(credentials.password!);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes('/sign-in'), { timeout: 30_000 }),
    page.locator('button[type="submit"]').click()
  ]);
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

async function signOut(page: Page): Promise<void> {
  const direct = page.getByRole('button', { name: /^sign out$/i });
  if (!(await direct.isVisible().catch(() => false))) {
    const accountMenu = page.locator('aside button').first();
    await accountMenu.click();
  }
  await page.getByRole('button', { name: /^sign out$/i }).click();
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await expect(page).toHaveURL(/\/sign-in/);
}

async function selectFirstOrganizationIfPresent(page: Page): Promise<void> {
  if (!page.url().includes('/setup-organization')) {
    return;
  }

  const select = page.locator('button').filter({ hasText: /select$/i }).filter({ hasNotText: /create|sign out/i }).first();
  await expect(select).toBeVisible();
  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes('/setup-organization'), { timeout: 20_000 }),
    select.click()
  ]);
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

async function openHome(page: Page): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await expect(page).toHaveURL(/\/$/);
}

async function openEditorFromSites(page: Page): Promise<void> {
  await page.goto('/sites');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  if (await tourProgress(page).isVisible().catch(() => false)) {
    await closeTour(page);
  }

  const entrypoint = page
    .locator('a[href*="/sites/editor"]')
    .filter({ hasText: /template|start|edit|customize|site|builder|create|new|open editor/i })
    .first();
  await expect(entrypoint).toBeVisible();
  await Promise.all([
    page.waitForURL((url) => /\/sites\/editor/.test(url.pathname), { timeout: 20_000 }),
    entrypoint.click()
  ]);
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await expect(page).toHaveURL(/\/sites\/editor/);
}

async function expectConsentDialog(page: Page): Promise<void> {
  await expect(consentDialog(page)).toBeVisible();
  await expect(page.getByRole('button', { name: /show me around/i })).toBeVisible();
  await expect(page.getByRole('button', { name: "I've been here before" })).toBeVisible();
}

async function expectConsentDialogHidden(page: Page): Promise<void> {
  await expect(consentDialog(page)).toBeHidden();
}

function consentDialog(page: Page): Locator {
  return page.getByRole('dialog').filter({ hasText: /first time in riffables/i });
}

async function dismissConsentWithoutChoice(page: Page): Promise<void> {
  const dialog = page.getByRole('dialog').filter({ hasText: /first time in riffables/i });
  const close = dialog.getByRole('button', { name: /close|dismiss/i });
  if (await close.isVisible().catch(() => false)) {
    await close.click();
    return;
  }
  await page.keyboard.press('Escape');
}

function tourProgress(page: Page): Locator {
  return page.getByText(/^\s*(?:step\s*)?\d+\s+(?:of|\/)\s+\d+\s*$/i).first();
}

function tourRoot(page: Page): Locator {
  return page.locator('.driver-popover').first();
}

async function expectTourVisible(page: Page): Promise<void> {
  await expect(tourProgress(page)).toBeVisible();
  await expect(
    page.getByRole('button', { name: /^next$/i }).or(page.getByRole('button', { name: /^(done|finish|got it)$/i })).first()
  ).toBeVisible();
}

async function expectTourHidden(page: Page): Promise<void> {
  await expect(tourProgress(page)).toBeHidden();
}

async function closeTour(page: Page): Promise<void> {
  const close = page.locator('.driver-popover-close-btn').first();
  await expect(close).toBeVisible();
  await close.click();
  await expectTourHidden(page);
}

async function finishOrCloseTour(page: Page): Promise<void> {
  const finish = page.getByRole('button', { name: /^(done|finish|got it)$/i });
  if (await finish.isVisible().catch(() => false)) {
    await finish.click();
    await expectTourHidden(page);
    return;
  }
  await closeTour(page);
}

function helpTourControl(page: Page): Locator {
  return page.getByRole('button', { name: /help|product tour|show.*tour|take.*tour/i }).first();
}

async function openHelpTour(page: Page): Promise<void> {
  const help = helpTourControl(page);
  await expect(help).toBeVisible();
  await help.click({ force: true });
}

function checklistSurface(page: Page): Locator {
  return page
    .locator('[role="dialog"], [data-state="open"], [data-testid*="checklist" i]')
    .filter({ hasText: /connect a source/i })
    .filter({ hasText: /turn videos into riffs/i })
    .first();
}

function checklistReopenControl(page: Page): Locator {
  return page.getByRole('button', { name: /getting started|checklist|setup guide/i }).or(
    page.getByRole('link', { name: /getting started|checklist|setup guide/i })
  ).first();
}

async function closeChecklist(page: Page): Promise<void> {
  const checklist = checklistSurface(page);
  const close = checklist.getByRole('button', { name: /maybe later|close|dismiss/i });
  await expect(close.first()).toBeVisible();
  await close.first().click();
}

async function ensureChecklistOpen(page: Page): Promise<void> {
  if (await checklistSurface(page).isVisible().catch(() => false)) {
    return;
  }
  const reopen = checklistReopenControl(page);
  await expect(reopen).toBeVisible();
  await reopen.click();
  await expect(checklistSurface(page)).toBeVisible();
}

async function switchWorkspace(page: Page, index: number): Promise<void> {
  await page.locator('aside button').first().click();
  const workspaces = page
    .locator('[role="dialog"] button')
    .filter({ hasText: /\// })
    .filter({ hasNotText: /create workspace|account settings/i });
  expect(await workspaces.count()).toBeGreaterThan(index);
  await workspaces.nth(index).click();
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

function markChecklistExpectedFailure(): void {
  test.fail(
    process.env.ONBOARD_CHECKLIST_EXPECTED_XFAIL === 'true',
    'Set ONBOARD_CHECKLIST_EXPECTED_XFAIL=true only while the checklist is unavailable in the target environment.'
  );
}

function markConsentExpectedFailure(): void {
  test.fail(
    process.env.ONBOARD_CONSENT_EXPECTED_XFAIL !== 'false',
    'The zero-source checklist currently prevents the first-time consent dialog and auto tours from appearing on staging.'
  );
}

function markTourSeenExpectedFailure(): void {
  test.fail(
    process.env.ONBOARD_TOUR_SEEN_EXPECTED_XFAIL !== 'false',
    'Closing a Driver.js tour early currently does not suppress its next automatic run on staging.'
  );
}

function canCreateAccount(): boolean {
  return Boolean(signupEmailPrefix() && signupEmailDomain() && signupPassword());
}

function signupConfigurationMessage(): string {
  return 'Set HOME_SIGNUP_EMAIL_PREFIX, HOME_SIGNUP_EMAIL_DOMAIN, and HOME_SIGNUP_PASSWORD.';
}

function newSignupAccount(label: string): Account {
  const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    name: `Onboard ${label} ${uniqueId}`,
    email: `${signupEmailPrefix()}${label}${uniqueId}@${signupEmailDomain()}`,
    password: signupPassword()!,
    uniqueId
  };
}

function signupEmailPrefix(): string | undefined {
  return process.env.HOME_SIGNUP_EMAIL_PREFIX || process.env.SETUP_SIGNUP_EMAIL_PREFIX;
}

function signupEmailDomain(): string | undefined {
  return process.env.HOME_SIGNUP_EMAIL_DOMAIN || process.env.SETUP_SIGNUP_EMAIL_DOMAIN;
}

function signupPassword(): string | undefined {
  return process.env.HOME_SIGNUP_PASSWORD || process.env.SETUP_SIGNUP_PASSWORD || process.env.SIGNUP_PASSWORD;
}

function grandfatheredCredentials(): Credentials {
  return {
    email: process.env.ONBOARD_GRANDFATHERED_EMAIL || process.env.SMOKE_EMAIL,
    password: process.env.ONBOARD_GRANDFATHERED_PASSWORD || process.env.SMOKE_PASSWORD
  };
}

function partialChecklistCredentials(): Credentials {
  return {
    email: process.env.ONBOARD_PARTIAL_EMAIL,
    password: process.env.ONBOARD_PARTIAL_PASSWORD
  };
}

function queuedChecklistCredentials(): Credentials {
  return {
    email: process.env.ONBOARD_QUEUED_EMAIL,
    password: process.env.ONBOARD_QUEUED_PASSWORD
  };
}

function completedChecklistCredentials(): Credentials {
  return {
    email: process.env.ONBOARD_COMPLETED_EMAIL,
    password: process.env.ONBOARD_COMPLETED_PASSWORD
  };
}

function multiTenantOperatorCredentials(): Credentials {
  return {
    email: process.env.ONBOARD_MULTI_TENANT_EMAIL,
    password: process.env.ONBOARD_MULTI_TENANT_PASSWORD
  };
}

function secondOperatorCredentials(): Credentials {
  return {
    email: process.env.ONBOARD_SECOND_OPERATOR_EMAIL,
    password: process.env.ONBOARD_SECOND_OPERATOR_PASSWORD
  };
}

function baseURL(): string {
  return process.env.BASE_URL || 'http://localhost:3000';
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}
