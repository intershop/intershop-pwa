import { AnimationEvent } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit, TransferState } from '@angular/core';

import bottomOutAnimation from 'ish-core/animations/bottom-out.animation';
import { COOKIE_CONSENT_VERSION } from 'ish-core/configurations/state-keys';
import { CookieConsentSettings } from 'ish-core/models/cookies/cookies.model';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

/**
 * Cookies Banner Component
 */
@Component({
  selector: 'ish-cookies-banner',
  templateUrl: './cookies-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [bottomOutAnimation()],
})
export class CookiesBannerComponent implements OnInit {
  showBanner = false;
  transitionBanner: string = undefined;
  private cookiesConsentFor: string[] = undefined;

  constructor(private transferState: TransferState, private cookiesService: CookiesService) {}

  ngOnInit() {
    this.showBannerIfNecessary();
  }

  /**
   * show banner if:
   * - consent not yet given
   * - consent outdated
   */
  private showBannerIfNecessary() {
    if (!SSR) {
      const cookieConsentSettings = JSON.parse(
        this.cookiesService.get('cookieConsent') || 'null'
      ) as CookieConsentSettings;
      const cookieConsentVersion = this.transferState.get<number>(COOKIE_CONSENT_VERSION, 1);
      if (!cookieConsentSettings || cookieConsentSettings.version < cookieConsentVersion) {
        this.showBanner = true;
      }
    }
  }

  acceptAll() {
    this.transitionBanner = 'bottom-out';
  }

  acceptOnlyRequired() {
    this.transitionBanner = 'bottom-out';
    this.cookiesConsentFor = ['required'];
  }

  setCookiesConsent(event: AnimationEvent): void {
    if (event.toState === this.transitionBanner) {
      if (this.cookiesConsentFor === undefined) {
        this.cookiesService.setCookiesConsentForAll();
      } else {
        this.cookiesService.setCookiesConsentFor(this.cookiesConsentFor);
      }
    }
  }
}
