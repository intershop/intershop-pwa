import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';

import { NGRX_STATE_SK } from 'ish-core/configurations/ngrx-state-transfer';
import { getTheme } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * Service to add the configured/selected theme’s meta in the HTML’s head.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store,
    private transferState: TransferState
  ) {}

  private trySetAttribute(selector: string, attribute: string, value: string) {
    const el = this.document.querySelector(selector);
    if (el) {
      el.setAttribute(attribute, value);
    }
  }

  init() {
    if (!this.transferState.hasKey(NGRX_STATE_SK)) {
      this.store.pipe(select(getTheme), whenTruthy()).subscribe(async theme => {
        const themeData = theme.split('|');
        const themeName = themeData[0];
        const themeColor = themeData[1];

        this.trySetAttribute('link[rel="icon"]', 'href', `assets/themes/${themeName}/img/favicon.ico`);
        this.trySetAttribute('link[rel="manifest"]', 'href', `assets/themes/${themeName}/manifest.webmanifest`);
        this.trySetAttribute(
          'link[rel="apple-touch-icon"]:not([sizes])',
          'href',
          `assets/themes/${themeName}/img/logo_apple_120x120.png`
        );
        this.trySetAttribute(
          'link[rel="apple-touch-icon"][sizes="152x152"]',
          'href',
          `assets/themes/${themeName}/img/logo_apple_152x152.png`
        );
        this.trySetAttribute(
          'link[rel="apple-touch-icon"][sizes="167x167"]',
          'href',
          `assets/themes/${themeName}/img/logo_apple_167x167.png`
        );
        this.trySetAttribute(
          'link[rel="apple-touch-icon"][sizes="180x180"]',
          'href',
          `assets/themes/${themeName}/img/logo_apple_180x180.png`
        );
        this.trySetAttribute('meta[name="theme-color"]', 'content', `#${themeColor}`);
      });
    }
  }
}
