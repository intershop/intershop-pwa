import { makeStateKey } from '@angular/platform-browser';

import { Translations } from 'ish-core/internationalization.module';

export const DISPLAY_VERSION = makeStateKey<string>('displayVersion');

export const COOKIE_CONSENT_VERSION = makeStateKey<number>('cookieConsentVersion');

export const SSR_LOCALE = makeStateKey<string>('ssrLocale');

export const SSR_TRANSLATIONS = makeStateKey<Translations>('ssrTranslation');
