import { makeStateKey } from '@angular/core';

export const DISPLAY_VERSION = makeStateKey<string>('displayVersion');

export const COOKIE_CONSENT_VERSION = makeStateKey<number>('cookieConsentVersion');

export const SSR_LOCALE = makeStateKey<string>('ssrLocale');
