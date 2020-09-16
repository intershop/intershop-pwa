import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { CookiesOptions, CookiesService as ForeignCookiesService } from 'ngx-utils-cookies-port';

import { COOKIE_CONSENT_OPTIONS } from 'ish-core/configurations/injection-keys';
import { COOKIE_CONSENT_VERSION } from 'ish-core/configurations/state-keys';
import { CookieConsentOptions, CookieConsentSettings } from 'ish-core/models/cookies/cookies.model';

/**
 * The Cookies Service handles any interaction of the PWA with cookies.
 * It is a wrapper to the basic cookie handling with the 'ngx-utils-cookies-port'.
 * in addition it provides methods for the cookie consent handling.
 */
@Injectable({ providedIn: 'root' })
export class CookiesService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(COOKIE_CONSENT_OPTIONS) private cookieConsentOptions: CookieConsentOptions,
    private transferState: TransferState,
    private cookiesService: ForeignCookiesService
  ) {}

  get(key: string): string {
    return isPlatformBrowser(this.platformId) ? this.cookiesService.get(key) : undefined;
  }

  remove(key: string) {
    this.cookiesService.remove(key);
  }

  put(key: string, value: string, options?: CookiesOptions) {
    this.cookiesService.put(key, value, options);
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
      const cookieConsentSettings = JSON.parse(
        this.cookiesService.get('cookieConsent') || 'null'
      ) as CookieConsentSettings;
      return cookieConsentSettings?.enabledOptions ? cookieConsentSettings.enabledOptions.includes(option) : false;
    } else {
      return false;
    }
  }

  /**
   * Deletes all cookies except for the ones configured as 'allowedCookies' in the environments cookie consent options.
   */
  private deleteAllCookies() {
    const allCookies = this.cookiesService.getAll();
    for (const cookie in allCookies) {
      if (!this.cookieConsentOptions?.allowedCookies.includes(cookie)) {
        this.cookiesService.remove(cookie);
      }
    }
  }
}
