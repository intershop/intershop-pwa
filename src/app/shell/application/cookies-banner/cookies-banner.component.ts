import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  Renderer2,
  TransferState,
  afterNextRender,
  signal,
} from '@angular/core';

import { COOKIE_CONSENT_VERSION } from 'ish-core/configurations/state-keys';
import { CookieConsentSettings } from 'ish-core/models/cookies/cookies.model';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

/**
 * Cookies Banner Component
 *
 * The banner markup is always rendered (also during SSR) but kept hidden by default. It is revealed via the
 * 'show-cookie-banner' root class, which is set pre-hydration by an inline script in index.html when no consent
 * cookie exists, so first-time visitors see the banner at FCP instead of waiting for Angular to bootstrap.
 */
@Component({
  selector: 'ish-cookies-banner',
  standalone: false,
  templateUrl: './cookies-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookiesBannerComponent implements OnInit {
  transitionBanner: string = undefined;
  // The banner buttons require client-side JS, so they stay disabled until the component hydrates.
  protected interactive = signal(false);
  private cookiesConsentFor: string[] = undefined;

  constructor(
    private transferState: TransferState,
    private cookiesService: CookiesService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    afterNextRender(() => this.interactive.set(true));
  }

  ngOnInit() {
    this.reconcileBannerVisibility();
  }

  /**
   * Reconcile the pre-hydration reveal with the authoritative consent version:
   * show if consent is missing or outdated, otherwise hide.
   */
  private reconcileBannerVisibility() {
    if (!SSR) {
      const cookieConsentSettings = JSON.parse(
        this.cookiesService.get('cookieConsent') || 'null'
      ) as CookieConsentSettings;
      const cookieConsentVersion = this.transferState.get<number>(COOKIE_CONSENT_VERSION, 1);
      const showBanner = !cookieConsentSettings || cookieConsentSettings.version < cookieConsentVersion;
      if (showBanner) {
        this.renderer.addClass(this.document.documentElement, 'show-cookie-banner');
      } else {
        this.renderer.removeClass(this.document.documentElement, 'show-cookie-banner');
      }
    }
  }

  acceptAll() {
    this.transitionBanner = 'bottom-out';
    this.cookiesConsentFor = undefined;
  }

  acceptOnlyRequired() {
    this.transitionBanner = 'bottom-out';
    this.cookiesConsentFor = ['required'];
  }

  setCookiesConsent(event: TransitionEvent): void {
    if (
      event.target === event.currentTarget &&
      event.propertyName === 'transform' &&
      this.transitionBanner === 'bottom-out'
    ) {
      if (this.cookiesConsentFor === undefined) {
        this.cookiesService.setCookiesConsentForAll();
      } else {
        this.cookiesService.setCookiesConsentFor(this.cookiesConsentFor);
      }
    }
  }
}
