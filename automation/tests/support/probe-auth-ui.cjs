const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${process.env.BASE_URL}/sign-in`);
  await page.locator('input[type=email]').fill(process.env.LOGIN_EMAIL);
  await page.locator('button[type=submit]').click();
  await page.locator('input[type=password]').fill(process.env.LOGIN_PASSWORD);
  await page.locator('button[type=submit]').click();
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(1500);

  if (page.url().includes('setup-organization')) {
    const selectButtons = page.locator('button').filter({ hasText: /select/i });
    if ((await selectButtons.count()) > 0) {
      await Promise.all([
        page.waitForURL((url) => !url.pathname.includes('setup-organization'), { timeout: 15_000 }).catch(() => undefined),
        selectButtons.first().click()
      ]);
      await page.waitForLoadState('networkidle').catch(() => undefined);
    }
  }

  const seenBefore = page.locator('button').filter({ hasText: "I've been here before" });
  if (await seenBefore.first().isVisible().catch(() => false)) {
    await seenBefore.first().click();
    await page.waitForTimeout(500);
  }

  const body = await page.locator('body').innerText();
  const buttons = await page.locator('button').evaluateAll((items) =>
    items
      .map((button, index) => ({
        index,
        text: button.innerText.trim(),
        aria: button.getAttribute('aria-label'),
        type: button.getAttribute('type'),
        disabled: button.disabled
      }))
      .filter((item) => item.text || item.aria)
  );
  const links = await page.locator('a').evaluateAll((items) =>
    items
      .map((link, index) => ({
        index,
        text: link.innerText.trim(),
        href: link.href
      }))
      .filter((item) => item.text || item.href)
  );

  console.log(JSON.stringify({
    url: page.url(),
    title: await page.title(),
    body: body.replace(/\s+/g, ' ').slice(0, 2000),
    buttons,
    links
  }, null, 2));

  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
