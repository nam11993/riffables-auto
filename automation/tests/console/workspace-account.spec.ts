import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { dismissOnboardingIfPresent } from '../support/smoke-config';

test.describe('Workspace and account menu flows', () => {
  test.describe.configure({ mode: 'serial' });

  let context: BrowserContext;
  let page: Page;
  let credentials: Credentials;

  test.beforeAll(async ({ browser }) => {
    credentials = workspaceCredentials();
    test.skip(!credentials.email || !credentials.password, 'Set WORKSPACE_EXISTING_EMAIL and WORKSPACE_EXISTING_PASSWORD to run workspace and account menu automation.');

    context = await browser.newContext({ baseURL: process.env.BASE_URL || 'http://localhost:3000' });
    page = await context.newPage();
    await openHome(page, credentials);
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test('TC-AUTH-049 Home workspace menu lists workspaces and account actions', async () => {
    await openHome(page, credentials);
    await openWorkspaceMenu(page);

    await expect(page.getByText('WORKSPACES')).toBeVisible();
    await expect(page.getByRole('button', { name: /Create workspace/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Account settings/i })).toBeVisible();
    await expect(workspaceMenuOption(page).first()).toBeVisible();
  });

  test('TC-AUTH-050 Account settings opens from the Home workspace menu', async () => {
    await openHome(page, credentials);
    await openWorkspaceMenu(page);
    await page.getByRole('button', { name: /Account settings/i }).click();
    await page.waitForLoadState('networkidle').catch(() => undefined);

    await expect(page).toHaveURL(/\/settings$/);
    await expect(page.getByText('Account')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sign-in methods' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Change password$/ })).toBeVisible();
  });

  test('TC-AUTH-051 Create workspace modal validates blank input and auto-generates slug', async () => {
    await openHome(page, credentials);
    await openCreateWorkspaceModal(page);

    const inputs = workspaceInputs(page);
    const createButton = page.getByRole('button', { name: /^Create workspace$/ });

    await expect(page.getByText('Create a workspace')).toBeVisible();
    await expect(createButton).toBeDisabled();

    await inputs.name.fill('Auto Workspace Slug');
    await expect(inputs.slug).toHaveValue('auto-workspace-slug');
    await expect(createButton).toBeEnabled();

    await inputs.slug.fill('Bad Slug !@#');
    await expect(createButton).toBeDisabled();
    await expect(page.getByText(/use lowercase letters, numbers, and single dashes only/i)).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Create a workspace')).toBeHidden();
  });

  test('TC-AUTH-052 Created workspace becomes active and selectable from the setup selector', async () => {
    const workspace = newWorkspaceData();

    test.slow();

    await openHome(page, credentials);
    await openCreateWorkspaceModal(page);

    const inputs = workspaceInputs(page);
    await inputs.name.fill(workspace.name);
    await inputs.slug.fill(workspace.slug);

    await page.getByRole('button', { name: /^Create workspace$/ }).click();
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await expect(page.getByText(workspace.name, { exact: false })).toBeVisible();
    await expectHome(page);

    await signOut(page);
    await signIn(page, credentials);
    await ensureSetupOrganizationPage(page);

    const createdWorkspaceOption = workspaceOption(page).filter({ hasText: new RegExp(escapeRegExp(workspace.name)) }).first();
    await expect(createdWorkspaceOption).toBeVisible();

    await Promise.all([
      page.waitForURL((url) => !url.pathname.includes('/setup-organization'), { timeout: 20_000 }),
      createdWorkspaceOption.click()
    ]);
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await dismissOnboardingIfPresent(page);

    await expect(page.getByText(workspace.name, { exact: false })).toBeVisible();
    await expectHome(page);
  });
});

type Credentials = {
  email?: string;
  password?: string;
};

type WorkspaceData = {
  name: string;
  slug: string;
};

async function openHome(page: Page, credentials: Credentials): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => undefined);

  if (page.url().includes('/sign-in')) {
    await signIn(page, credentials);
  }

  await selectExistingOrganizationIfPresent(page);
  await dismissOnboardingIfPresent(page);
  await page.goto('/');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await dismissOnboardingIfPresent(page);
  await expectHome(page);
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

async function selectExistingOrganizationIfPresent(page: Page): Promise<void> {
  if (!page.url().includes('/setup-organization')) {
    return;
  }

  const selectButton = workspaceOption(page).first();
  await expect(selectButton).toBeVisible();
  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes('/setup-organization'), { timeout: 20_000 }),
    selectButton.click()
  ]);
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

async function ensureSetupOrganizationPage(page: Page): Promise<void> {
  if (!page.url().includes('/setup-organization')) {
    await page.goto('/setup-organization');
    await page.waitForLoadState('networkidle').catch(() => undefined);
  }

  await expect(page).toHaveURL(/\/setup-organization/);
  await expect(page.getByText('Select an organization')).toBeVisible();
}

async function openWorkspaceMenu(page: Page): Promise<void> {
  await page.locator('aside button').first().click();
  await expect(page.getByText('WORKSPACES')).toBeVisible();
}

async function openCreateWorkspaceModal(page: Page): Promise<void> {
  await openWorkspaceMenu(page);
  await page.getByRole('button', { name: /Create workspace/i }).click();
  await expect(page.getByText('Create a workspace')).toBeVisible();
}

async function expectHome(page: Page): Promise<void> {
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('Overview')).toBeVisible();
  await expect(page.locator('h1:visible')).toHaveText(/let.s get started/i);
}

function workspaceOption(page: Page) {
  return page
    .locator('button')
    .filter({ hasText: /Select$/ })
    .filter({ hasNotText: /Create workspace|Account settings|Sign out/i });
}

function workspaceMenuOption(page: Page) {
  return page
    .locator('[role="dialog"] button')
    .filter({ hasText: /\// })
    .filter({ hasNotText: /Create workspace|Account settings/i });
}

async function signOut(page: Page): Promise<void> {
  await page.getByRole('button', { name: /^Sign out$/ }).click();
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await expect(page).toHaveURL(/\/sign-in/);
}

function workspaceInputs(page: Page) {
  const inputs = page.locator('input');
  return {
    name: inputs.nth(0),
    slug: inputs.nth(1)
  };
}

function workspaceCredentials(): Credentials {
  return {
    email: process.env.WORKSPACE_EXISTING_EMAIL || process.env.SMOKE_EMAIL,
    password: process.env.WORKSPACE_EXISTING_PASSWORD || process.env.SMOKE_PASSWORD
  };
}

function newWorkspaceData(): WorkspaceData {
  const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    name: `Auto Workspace ${uniqueId}`,
    slug: `auto-workspace-${uniqueId.toLowerCase()}`
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
