import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { TransferState } from '@angular/platform-browser';

import { THEME_COLOR } from 'ish-core/configurations/injection-keys';
import { NGRX_STATE_SK } from 'ish-core/configurations/ngrx-state-transfer';

/**
 * Service to add the configured/selected theme’s meta in the HTML’s head.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private transferState: TransferState,
    @Inject(THEME_COLOR) private themeColor: string
  ) {}

  private trySetAttribute(selector: string, attribute: string, value: string) {
    const el = this.document.querySelector(selector);
    if (el) {
      el.setAttribute(attribute, value);
    }
  }

  init() {
    if (!this.transferState.hasKey(NGRX_STATE_SK)) {
      this.trySetAttribute('link[rel="icon"]', 'href', `assets/themes/${THEME}/img/favicon.ico`);
      this.trySetAttribute('link[rel="manifest"]', 'href', `assets/themes/${THEME}/manifest.webmanifest`);
      this.trySetAttribute(
        'link[rel="apple-touch-icon"]:not([sizes])',
        'href',
        `assets/themes/${THEME}/img/logo_apple_120x120.png`
      );
      this.trySetAttribute(
        'link[rel="apple-touch-icon"][sizes="152x152"]',
        'href',
        `assets/themes/${THEME}/img/logo_apple_152x152.png`
      );
      this.trySetAttribute(
        'link[rel="apple-touch-icon"][sizes="167x167"]',
        'href',
        `assets/themes/${THEME}/img/logo_apple_167x167.png`
      );
      this.trySetAttribute(
        'link[rel="apple-touch-icon"][sizes="180x180"]',
        'href',
        `assets/themes/${THEME}/img/logo_apple_180x180.png`
      );
      if (this.themeColor) {
        this.trySetAttribute('meta[name="theme-color"]', 'content', `${this.themeColor}`);
      }
    }
  }
}
