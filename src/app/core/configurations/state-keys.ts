import { makeStateKey } from '@angular/platform-browser';

export const DISPLAY_VERSION = makeStateKey<string>('displayVersion');

export const COOKIE_CONSENT_VERSION = makeStateKey<number>('cookieConsentVersion');
