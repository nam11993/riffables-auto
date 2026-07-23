import { expect, test, type BrowserContext, type Locator, type Page } from '@playwright/test';
import {
  dismissOnboardingIfPresent,
  hasCredentials,
  login,
  selectExistingOrganizationIfPresent,
  smokeConfig
} from '../support/smoke-config';

type AuditedRoute = {
  name: string;
  path: string;
  identity: RegExp;
};

type TargetSizeViolation = {
  label: string;
  selector: string;
  width: number;
  height: number;
};

type AccessibilitySnapshot = {
  unnamedControls: string[];
  imageIssues: string[];
  landmarkCount: {
    main: number;
    navigation: number;
  };
};

type FocusSnapshot = {
  label: string;
  selector: string;
  width: number;
  height: number;
  hasIndicator: boolean;
};

const WRONG_PASSWORD = 'WrongPasswordForA11yBaseline12@';

test.describe('A11Y baseline regression', () => {
  test.describe.serial('Authenticated console and editor baseline', () => {
    let context: BrowserContext;
    let page: Page;

    test.beforeAll(async ({ browser }) => {
      const config = smokeConfig();
      test.skip(!hasCredentials(config), 'Set SMOKE_EMAIL and SMOKE_PASSWORD to run A11Y baseline automation.');

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

    test('TC-A11Y-001 TC-A11Y-002 TC-A11Y-011 @a11y-baseline critical controls meet 24px target size baseline', async () => {
      test.fail(
        a11yTargetSizeGapExpected(),
        'Current staging has a 20px-tall editor `Open the live site` action, below the 24px target-size baseline.'
      );

      const violations: TargetSizeViolation[] = [];

      for (const route of auditedRoutes()) {
        await openRoute(page, route);
        violations.push(...(await collectTargetSizeViolations(page, route.name)));
      }

      await openEditorFromSites(page);
      violations.push(...(await collectTargetSizeViolations(page, 'Editor')));

      expect(violations).toEqual([]);
    });

    test('TC-A11Y-007 @a11y-baseline audited surfaces keep landmarks, accessible names, and image alt baseline', async () => {
      test.fail(
        a11yAccessibleNameGapExpected(),
        'Current staging exposes the Sources backfill date input without an accessible name.'
      );

      const failures: string[] = [];

      for (const route of auditedRoutes()) {
        await openRoute(page, route);
        const snapshot = await collectAccessibilitySnapshot(page);

        if (snapshot.landmarkCount.main < 1) {
          failures.push(`${route.name}: missing main landmark`);
        }
        if (snapshot.landmarkCount.navigation < 1) {
          failures.push(`${route.name}: missing navigation landmark`);
        }
        failures.push(...snapshot.unnamedControls.map((control) => `${route.name}: unnamed control ${control}`));
        failures.push(...snapshot.imageIssues.map((issue) => `${route.name}: ${issue}`));
      }

      await openEditorFromSites(page);
      const editorSnapshot = await collectAccessibilitySnapshot(page);
      if (editorSnapshot.landmarkCount.navigation < 1) {
        failures.push('Editor: missing navigation landmark');
      }
      failures.push(...editorSnapshot.unnamedControls.map((control) => `Editor: unnamed control ${control}`));
      failures.push(...editorSnapshot.imageIssues.map((issue) => `Editor: ${issue}`));

      expect(failures).toEqual([]);
    });

    test('TC-A11Y-006 @a11y-baseline editor exposes navigable headings for major regions', async () => {
      await openEditorFromSites(page);

      await expect(page).toHaveURL(/\/sites\/editor/);
      await expect(page.getByRole('heading', { name: /page sections/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /section settings/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /^preview$/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /^publish$/i })).toBeVisible();
      await expect.poll(() => page.getByRole('navigation').count()).toBeGreaterThan(0);

      const headingLabels = await visibleHeadingLabels(page);
      expect(headingLabels.join(' ')).toMatch(/page sections/i);
      expect(headingLabels.join(' ')).toMatch(/section settings/i);
    });

    test('TC-A11Y-004 @a11y-baseline publish error state does not expose View live site action', async () => {
      await openEditorFromSites(page);
      await page.getByRole('button', { name: /^publish$/i }).click();

      const dialog = page
        .locator('[role="dialog"]:visible, dialog:visible, [data-radix-portal]:visible')
        .filter({ hasText: /publish site|domain|hostname|subdomain/i })
        .first();
      await dialog.waitFor({ state: 'visible', timeout: 3_000 }).catch(() => undefined);
      test.skip(!(await dialog.isVisible().catch(() => false)), 'Publish dialog is not available in the current editor state.');

      const input = subdomainControl(dialog);
      test.skip(!(await input.isVisible().catch(() => false)), 'Publish dialog does not expose editable subdomain input.');

      await input.fill('Invalid Host With Spaces!');
      await expect(dialog).toContainText(/invalid|lowercase|letters|numbers|hyphen|available|required|saniti/i);
      await expect(viewLiveSiteControl(page)).toHaveCount(0);
      await dismissDialogIfPresent(page);
    });

    test('TC-A11Y-008 @a11y-baseline keyboard focus order has visible indicators', async () => {
      test.fail(
        a11yFocusIndicatorGapExpected(),
        'Current staging focus stops are reachable but do not expose a measurable visible focus indicator on core console controls.'
      );

      const failures: string[] = [];

      for (const route of auditedRoutes()) {
        await openRoute(page, route);
        const focusStops = await collectTabFocusStops(page, 12);
        if (focusStops.length < 3) {
          failures.push(`${route.name}: fewer than 3 visible keyboard focus stops`);
        }
        failures.push(
          ...focusStops
            .filter((stop) => !stop.hasIndicator)
            .map((stop) => `${route.name}: focus stop lacks visible indicator ${stop.selector} ${stop.label}`)
        );
      }

      expect(failures).toEqual([]);
    });

    test('TC-A11Y-010 TC-A11Y-012 @a11y-baseline keyboard reaches core workflow and icon buttons are named', async () => {
      const failures: string[] = [];

      for (const route of auditedRoutes()) {
        await openRoute(page, route);
        const focusStops = await collectTabFocusStops(page, 12);
        if (focusStops.length < 3) {
          failures.push(`${route.name}: fewer than 3 visible keyboard focus stops`);
        }
        failures.push(...focusStops.filter((stop) => !stop.label).map((stop) => `${route.name}: unnamed focus stop ${stop.selector}`));
      }

      await openRoute(page, {
        name: 'Sources catalog',
        path: '/sources',
        identity: /Source management|Sources/i
      });
      const videos = page.getByRole('button', { name: /^Videos$/ }).first();
      test.skip(!(await videos.isVisible().catch(() => false)), 'Connected source fixture with Videos action is required.');
      await videos.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('[role="dialog"], dialog').filter({ hasText: /channel videos/i }).first()).toBeVisible();
      await page.keyboard.press('Tab');
      const dialogFocus = await currentFocusSnapshot(page);
      if (!dialogFocus || !dialogFocus.label) {
        failures.push('Sources catalog: focus did not move to a named control inside the Channel Videos dialog');
      }
      await dismissDialogIfPresent(page);

      await openEditorFromSites(page);
      const unnamedIconButtons = await collectUnnamedIconButtons(page);
      failures.push(...unnamedIconButtons.map((button) => `Editor: unnamed icon button ${button}`));
      for (const name of [/^preview$/i, /^publish$/i, /^design$/i, /^media$/i, /help|product tour/i]) {
        const control = page.getByRole('button', { name }).first();
        if (await control.isVisible().catch(() => false)) {
          await control.focus();
          const snapshot = await currentFocusSnapshot(page);
          if (!snapshot?.label) {
            failures.push(`Editor: focused control ${name.toString()} has no accessible name`);
          }
        }
      }

      expect(failures).toEqual([]);
    });
  });

  test('TC-A11Y-009 @a11y-baseline validation errors expose alert/live semantics and keep focus usable', async ({ page }) => {
    const config = smokeConfig();

    test.skip(!config.email, 'Set SMOKE_EMAIL to run validation error A11Y automation.');

    await page.goto(config.loginPath);
    await page.waitForLoadState('domcontentloaded').catch(() => undefined);
    await emailInput(page).fill(config.email!);
    await submitButton(page).click();
    await passwordInput(page).fill(WRONG_PASSWORD);
    await submitButton(page).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(validationAlert(page)).toContainText(/invalid email or password/i);

    await page.keyboard.press('Tab');
    const focus = await currentFocusSnapshot(page);
    expect(focus, 'Keyboard focus should remain usable after validation error').toBeTruthy();
    expect(focus!.label).toBeTruthy();
    expect(focus!.width).toBeGreaterThan(0);
    expect(focus!.height).toBeGreaterThan(0);
  });
});

function auditedRoutes(): AuditedRoute[] {
  return [
    { name: 'Home', path: '/', identity: /Overview|Welcome back|Let.s get started/i },
    { name: 'Sources', path: '/sources', identity: /Source management|Sources/i },
    { name: 'Content', path: '/content', identity: /Content management|Crawled content|Content/i },
    { name: 'Sites', path: '/sites', identity: /Get started|Start building|Manage|Publish|Sites|Site/i }
  ];
}

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

async function openRoute(page: Page, route: AuditedRoute): Promise<void> {
  await openAuthenticated(page);
  await page.goto(route.path);
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await dismissOnboardingIfPresent(page);

  await expect(page).toHaveURL(new RegExp(`${escapeRegExp(route.path)}$`));
  await expect(page.getByText(route.identity).first()).toBeVisible();
}

async function openEditorFromSites(page: Page): Promise<void> {
  await openRoute(page, {
    name: 'Sites',
    path: '/sites',
    identity: /Get started|Start building|Manage|Publish|Sites|Site/i
  });

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

function subdomainControl(scope: Page | Locator): Locator {
  return scope
    .getByLabel(/subdomain|domain|host|slug/i)
    .or(scope.getByPlaceholder(/subdomain|domain|host|slug/i))
    .or(scope.locator('input[name*="subdomain" i], input[name*="domain" i], input[name*="host" i], input[name*="slug" i]'))
    .first();
}

function viewLiveSiteControl(page: Page): Locator {
  return page.getByRole('link', { name: /view live|live site|open site/i }).or(page.getByRole('button', { name: /view live|live site|open site/i }));
}

function emailInput(page: Page): Locator {
  return page
    .getByLabel(/email|e-mail|username/i)
    .or(page.getByPlaceholder(/email|e-mail|username/i))
    .or(page.locator('input[type="email"]:visible'))
    .or(page.locator('input[name*="email" i]:visible'))
    .first();
}

function passwordInput(page: Page): Locator {
  return page
    .getByLabel(/^password$/i)
    .or(page.getByPlaceholder(/^password$/i))
    .or(page.locator('input[type="password"]:visible:not([aria-hidden="true"])'))
    .first();
}

function submitButton(page: Page): Locator {
  return page
    .locator('button')
    .filter({ hasText: /^(continue|sign in|log in|submit)$/i })
    .filter({ hasNotText: /google/i })
    .first();
}

function validationAlert(page: Page): Locator {
  return page
    .getByRole('alert')
    .or(page.locator('[aria-live="assertive"]:visible, [aria-live="polite"]:visible'))
    .filter({ hasText: /invalid email or password/i })
    .first();
}

function a11yTargetSizeGapExpected(): boolean {
  return process.env.A11Y_TARGET_SIZE_GAP !== 'false';
}

function a11yAccessibleNameGapExpected(): boolean {
  return process.env.A11Y_ACCESSIBLE_NAME_GAP !== 'false';
}

function a11yFocusIndicatorGapExpected(): boolean {
  return process.env.A11Y_FOCUS_INDICATOR_GAP !== 'false';
}

async function collectTargetSizeViolations(page: Page, screenName: string): Promise<TargetSizeViolation[]> {
  return page.locator('body').evaluate((body, screen) => {
    const selector =
      'button, a[href], input:not([type="hidden"]), select, textarea, [role="button"], [role="link"], [role="textbox"], [tabindex]:not([tabindex="-1"])';

    function isVisible(element: Element): boolean {
      const html = element as HTMLElement;
      const rect = html.getBoundingClientRect();
      const style = window.getComputedStyle(html);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        !html.closest('[hidden], [aria-hidden="true"]')
      );
    }

    function accessibleLabel(element: Element): string {
      const html = element as HTMLElement;
      const labelledBy = html.getAttribute('aria-labelledby');
      const labelledByText = labelledBy
        ? labelledBy
            .split(/\s+/)
            .map((id) => document.getElementById(id)?.textContent?.trim() || '')
            .join(' ')
            .trim()
        : '';
      return (
        html.getAttribute('aria-label') ||
        labelledByText ||
        html.getAttribute('title') ||
        html.getAttribute('alt') ||
        html.getAttribute('placeholder') ||
        html.innerText ||
        html.textContent ||
        ''
      )
        .replace(/\s+/g, ' ')
        .trim();
    }

    function cssSelector(element: Element): string {
      const html = element as HTMLElement;
      if (html.id) {
        return `#${html.id}`;
      }
      const label = accessibleLabel(element);
      const role = html.getAttribute('role');
      const tag = html.tagName.toLowerCase();
      return `${tag}${role ? `[role="${role}"]` : ''}${label ? `[name="${label.slice(0, 40)}"]` : ''}`;
    }

    function isInlineProseLink(element: Element): boolean {
      return element.tagName.toLowerCase() === 'a' && Boolean(element.closest('p, article')) && !element.closest('nav, header, [role="toolbar"]');
    }

    return Array.from(body.querySelectorAll(selector))
      .filter(isVisible)
      .filter((element) => !(element as HTMLInputElement).disabled)
      .filter((element) => !['checkbox', 'radio', 'color'].includes(((element as HTMLInputElement).type || '').toLowerCase()))
      .filter((element) => !isInlineProseLink(element))
      .map((element) => {
        const rect = (element as HTMLElement).getBoundingClientRect();
        return {
          label: `${screen}: ${accessibleLabel(element) || '<unnamed>'}`,
          selector: cssSelector(element),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      })
      .filter((control) => control.width < 24 || control.height < 24);
  }, screenName);
}

async function collectAccessibilitySnapshot(page: Page): Promise<AccessibilitySnapshot> {
  return page.locator('body').evaluate((body) => {
    const interactiveSelector =
      'button, a[href], input:not([type="hidden"]), select, textarea, [role="button"], [role="link"], [role="textbox"], [tabindex]:not([tabindex="-1"])';

    function isVisible(element: Element): boolean {
      const html = element as HTMLElement;
      const rect = html.getBoundingClientRect();
      const style = window.getComputedStyle(html);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        !html.closest('[hidden], [aria-hidden="true"]')
      );
    }

    function accessibleLabel(element: Element): string {
      const html = element as HTMLElement;
      const labelledBy = html.getAttribute('aria-labelledby');
      const labelledByText = labelledBy
        ? labelledBy
            .split(/\s+/)
            .map((id) => document.getElementById(id)?.textContent?.trim() || '')
            .join(' ')
            .trim()
        : '';
      return (
        html.getAttribute('aria-label') ||
        labelledByText ||
        html.getAttribute('title') ||
        html.getAttribute('alt') ||
        html.getAttribute('placeholder') ||
        html.innerText ||
        html.textContent ||
        ''
      )
        .replace(/\s+/g, ' ')
        .trim();
    }

    function cssSelector(element: Element): string {
      const html = element as HTMLElement;
      if (html.id) {
        return `#${html.id}`;
      }
      const role = html.getAttribute('role');
      const tag = html.tagName.toLowerCase();
      const label = accessibleLabel(element);
      return `${tag}${role ? `[role="${role}"]` : ''}${label ? `[name="${label.slice(0, 40)}"]` : ''}`;
    }

    const unnamedControls = Array.from(body.querySelectorAll(interactiveSelector))
      .filter(isVisible)
      .filter((element) => !(element as HTMLInputElement).disabled)
      .filter((element) => !accessibleLabel(element))
      .map(cssSelector);

    const imageIssues = Array.from(body.querySelectorAll('img, [role="img"]'))
      .filter(isVisible)
      .filter((element) => {
        const html = element as HTMLElement;
        const role = html.getAttribute('role');
        const isDecorative = role === 'presentation' || role === 'none' || html.getAttribute('aria-hidden') === 'true';
        if (isDecorative) {
          return false;
        }

        return !accessibleLabel(element);
      })
      .map((element) => `image missing accessible text ${cssSelector(element)}`);

    return {
      unnamedControls,
      imageIssues,
      landmarkCount: {
        main: body.querySelectorAll('main, [role="main"]').length,
        navigation: body.querySelectorAll('nav, [role="navigation"]').length
      }
    };
  });
}

async function collectUnnamedIconButtons(page: Page): Promise<string[]> {
  return page.locator('button:visible, [role="button"]:visible').evaluateAll((buttons) =>
    buttons
      .filter((button) => {
        const text = (button.textContent || '').replace(/\s+/g, ' ').trim();
        const hasSvg = Boolean(button.querySelector('svg'));
        return hasSvg && !text;
      })
      .filter((button) => {
        const html = button as HTMLElement;
        return !html.getAttribute('aria-label') && !html.getAttribute('title') && !html.getAttribute('aria-labelledby');
      })
      .map((button) => {
        const html = button as HTMLElement;
        const rect = html.getBoundingClientRect();
        return `${html.tagName.toLowerCase()} ${Math.round(rect.width)}x${Math.round(rect.height)}`;
      })
  );
}

async function collectTabFocusStops(page: Page, maxTabs: number): Promise<FocusSnapshot[]> {
  await page.keyboard.press('Home').catch(() => undefined);
  await page.locator('body').click({ position: { x: 2, y: 2 } }).catch(() => undefined);

  const stops: FocusSnapshot[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < maxTabs; index += 1) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    const snapshot = await currentFocusSnapshot(page);
    if (!snapshot || snapshot.selector === 'body') {
      continue;
    }
    const key = `${snapshot.selector}|${snapshot.label}`;
    if (!seen.has(key)) {
      seen.add(key);
      stops.push(snapshot);
    }
  }

  return stops;
}

async function currentFocusSnapshot(page: Page): Promise<FocusSnapshot | null> {
  return page.evaluate(() => {
    const element = document.activeElement as HTMLElement | null;
    if (!element || element === document.body) {
      return null;
    }

    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    const labelledBy = element.getAttribute('aria-labelledby');
    const labelledByText = labelledBy
      ? labelledBy
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent?.trim() || '')
          .join(' ')
          .trim()
      : '';
    const label = (
      element.getAttribute('aria-label') ||
      labelledByText ||
      element.getAttribute('title') ||
      element.getAttribute('placeholder') ||
      element.innerText ||
      element.textContent ||
      ''
    )
      .replace(/\s+/g, ' ')
      .trim();
    const hasIndicator =
      (style.outlineStyle !== 'none' && style.outlineWidth !== '0px') ||
      style.boxShadow !== 'none' ||
      style.textDecorationLine.includes('underline');

    return {
      label,
      selector: element.id ? `#${element.id}` : element.tagName.toLowerCase(),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      hasIndicator
    };
  });
}

async function visibleHeadingLabels(page: Page): Promise<string[]> {
  return page.locator('h1:visible, h2:visible, h3:visible, [role="heading"]:visible').evaluateAll((headings) =>
    headings.map((heading) => (heading.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean)
  );
}

async function dismissDialogIfPresent(page: Page): Promise<void> {
  const dialog = page.locator('[role="dialog"]:visible, dialog:visible').first();
  if (!(await dialog.isVisible().catch(() => false))) {
    return;
  }

  const close = dialog.getByRole('button', { name: /close|cancel/i }).first();
  if (await close.isVisible().catch(() => false)) {
    await close.click();
  } else {
    await page.keyboard.press('Escape');
  }
  await dialog.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
