#!/usr/bin/env node

/**
 * LHCI puppeteer hook: seeds a valid `cookieConsent` cookie before each audit so
 * the cookie banner is not displayed, measuring the returning/consented-user
 * experience. Keep the payload in sync with `cookieConsentVersion` and the
 * configured options in `src/environments/environment.model.ts`.
 */
module.exports = async (browser, context) => {
  const page = await browser.newPage();
  await page.setCookie({
    name: 'cookieConsent',
    // encoded to mirror how the app writes/reads the cookie (CookiesService uses encode/decodeURIComponent)
    value: encodeURIComponent(JSON.stringify({ enabledOptions: ['required', 'functional', 'tracking'], version: 1 })),
    url: context.url,
  });
  await page.close();
};
