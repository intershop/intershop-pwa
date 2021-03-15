import { APP_BASE_HREF, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';

import { COOKIE_CONSENT_OPTIONS } from 'ish-core/configurations/injection-keys';
import { COOKIE_CONSENT_VERSION } from 'ish-core/configurations/state-keys';
import { CookieConsentOptions, CookieConsentSettings } from 'ish-core/models/cookies/cookies.model';

interface CookiesOptions {
  path?: string;
  domain?: string;
  expires?: string | Date;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
}

/**
 * The Cookies Service handles any interaction of the PWA with cookies.
 * Implementation is mostly transferred from the 'ngx-utils-cookies-port' library (https://github.com/junekpavel/ngx-utils-cookies-port).
 * in addition it provides methods for the cookie consent handling.
 */
@Injectable({ providedIn: 'root' })
export class CookiesService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(COOKIE_CONSENT_OPTIONS) private cookieConsentOptions: CookieConsentOptions,
    private transferState: TransferState,
    @Inject(APP_BASE_HREF) private baseHref: string,
    @Inject(DOCUMENT) private document: Document
  ) {}

  get(key: string): string {
    return isPlatformBrowser(this.platformId) ? (this.cookiesReader()[key] as string) : undefined;
  }

  remove(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.cookiesWriter()(key, undefined);
    }
  }

  put(key: string, value: string, options?: CookiesOptions) {
    if (isPlatformBrowser(this.platformId)) {
      this.cookiesWriter()(key, value, options);
    }
  }

  /**
   * Saves the given cookie consent options settings together with the current cookie consent version
   * to a users cookie named 'cookieConsent' and reloads the PWA application with the new settings.
   * @param options The selected cookie consent options that should be enabled.
   */
  setCookiesConsentFor(options: string[]) {
    const cookieConsentVersion = this.transferState.get<number>(COOKIE_CONSENT_VERSION, 1);
    this.deleteAllCookies();
    this.put('cookieConsent', JSON.stringify({ enabledOptions: options, version: cookieConsentVersion }), {
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      sameSite: 'Strict',
    });
    window.location.reload();
  }

  setCookiesConsentForAll() {
    this.setCookiesConsentFor(Object.keys(this.cookieConsentOptions.options));
  }

  /**
   * Check if consent was given for {option}.
   * @param option The cookie consent option of interest.
   * @returns      'true' if the user has given the consent for the requested option, 'false' otherwise.
   */
  cookieConsentFor(option: string): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const cookieConsentSettings = JSON.parse(this.get('cookieConsent') || 'null') as CookieConsentSettings;
      return cookieConsentSettings?.enabledOptions ? cookieConsentSettings.enabledOptions.includes(option) : false;
    } else {
      return false;
    }
  }

  /**
   * Deletes all cookies except for the ones configured as 'allowedCookies' in the environments cookie consent options.
   */
  private deleteAllCookies() {
    const allCookies = this.cookiesReader();
    for (const cookie in allCookies) {
      if (!this.cookieConsentOptions?.allowedCookies.includes(cookie)) {
        this.cookiesWriter()(cookie, undefined);
      }
    }
  }

  private cookiesReader(): { [key: string]: unknown } {
    let lastCookies: { [key: string]: unknown } = {};
    let lastCookieString = '';
    let cookiesArray: string[];
    let cookie: string;
    let i: number;
    let index: number;
    let name: string;
    const currentCookieString = this.document.cookie || '';

    if (currentCookieString !== lastCookieString) {
      lastCookieString = currentCookieString;
      cookiesArray = lastCookieString.split('; ');
      lastCookies = {};
      for (i = 0; i < cookiesArray.length; i++) {
        cookie = cookiesArray[i];
        index = cookie.indexOf('=');
        if (index > 0) {
          name = decodeURIComponent(cookie.substring(0, index));
          if (!lastCookies[name]) {
            const cookieValue = decodeURIComponent(cookie.substring(index + 1));
            if (cookieValue) {
              lastCookies[name] = cookieValue;
            }
          }
        }
      }
    }
    return lastCookies;
  }

  private cookiesWriter(): (name: string, value: string | undefined, options?: CookiesOptions) => void {
    return (name, value, options?) => {
      this.document.cookie = this.buildCookieString(name, value, options);
    };
  }

  private buildCookieString(name: string, value: string | undefined, opts: CookiesOptions = {}): string {
    let path = opts.path;
    if (!path) {
      path = this.baseHref;
    }

    let expires = opts.expires;
    if (!value) {
      expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
    }
    if (typeof expires === 'string') {
      expires = new Date(expires);
    }
    let str = `${encodeURIComponent(name)}=${encodeURIComponent(value || '')}`;
    str += ';path=' + path;
    str += opts.domain ? ';domain=' + opts.domain : '';
    str += expires ? ';expires=' + expires.toUTCString() : '';
    str += opts.sameSite ? ';SameSite=' + opts.sameSite : '';
    str += opts.secure ? ';secure' : '';
    const cookiesLength = str.length + 1;
    if (cookiesLength > 4096) {
      // tslint:disable-next-line: no-console
      console.log(`Cookie \'${name}\' possibly not set or overflowed because it was too
      large (${cookiesLength} > 4096 bytes)!`);
    }
    return str;
  }
}
