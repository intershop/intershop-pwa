'use strict';

const COOKIE_CONSENT_OPTIONS = ['required', 'functional', 'tracking'];

function cookieConsentVersion() {
  const version = Number.parseInt(
    process.env.LIGHTHOUSE_COOKIE_CONSENT_VERSION || process.env.COOKIE_CONSENT_VERSION,
    10
  );
  return Number.isFinite(version) ? version : 1;
}

module.exports = async (browser, context) => {
  const page = await browser.newPage();
  const origin = new URL(context.url).origin;

  try {
    await page.setCookie({
      name: 'cookieConsent',
      value: JSON.stringify({
        enabledOptions: COOKIE_CONSENT_OPTIONS,
        version: cookieConsentVersion(),
      }),
      url: origin,
      path: '/',
      sameSite: 'Strict',
    });
  } finally {
    await page.close();
  }
};
