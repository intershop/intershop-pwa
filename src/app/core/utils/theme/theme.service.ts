import { Inject, Injectable, TransferState } from '@angular/core';

import { THEME_COLOR } from 'ish-core/configurations/injection-keys';
import { NGRX_STATE_SK } from 'ish-core/configurations/ngrx-state-transfer';
import { DomService } from 'ish-core/utils/dom/dom.service';
import { InjectSingle } from 'ish-core/utils/injection';

/**
 * Service to add the configured/selected theme’s meta in the HTML’s head.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  constructor(
    private domService: DomService,
    private transferState: TransferState,
    @Inject(THEME_COLOR) private themeColor: InjectSingle<typeof THEME_COLOR>
  ) {}

  init() {
    if (!this.transferState.hasKey(NGRX_STATE_SK)) {
      this.domService.setAttributeForSelector('link[rel="icon"]', 'href', `assets/themes/${THEME}/img/favicon.ico`);
      this.domService.setAttributeForSelector(
        'link[rel="manifest"]',
        'href',
        `assets/themes/${THEME}/manifest.webmanifest`
      );
      this.domService.setAttributeForSelector(
        'link[rel="apple-touch-icon"]:not([sizes])',
        'href',
        `assets/themes/${THEME}/img/logo_apple_120x120.png`
      );
      this.domService.setAttributeForSelector(
        'link[rel="apple-touch-icon"][sizes="152x152"]',
        'href',
        `assets/themes/${THEME}/img/logo_apple_152x152.png`
      );
      this.domService.setAttributeForSelector(
        'link[rel="apple-touch-icon"][sizes="167x167"]',
        'href',
        `assets/themes/${THEME}/img/logo_apple_167x167.png`
      );
      this.domService.setAttributeForSelector(
        'link[rel="apple-touch-icon"][sizes="180x180"]',
        'href',
        `assets/themes/${THEME}/img/logo_apple_180x180.png`
      );
      if (this.themeColor) {
        this.domService.setAttributeForSelector('meta[name="theme-color"]', 'content', `${this.themeColor}`);
      }
    }
  }
}
