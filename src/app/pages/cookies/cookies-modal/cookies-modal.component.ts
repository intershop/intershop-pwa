import { ChangeDetectionStrategy, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';

import { COOKIE_CONSENT_OPTIONS } from 'ish-core/configurations/injection-keys';
import { CookieConsentOptions, CookieConsentSettings } from 'ish-core/models/cookies/cookies.model';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

/**
 * Cookies Modal Component
 */
@Component({
  selector: 'ish-cookies-modal',
  templateUrl: './cookies-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookiesModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  cookieConsentSettings?: CookieConsentSettings;
  selectedIds: { [id: string]: boolean } = {};

  constructor(
    @Inject(COOKIE_CONSENT_OPTIONS) public cookieConsentOptions: CookieConsentOptions,
    private cookiesService: CookiesService
  ) {}

  ngOnInit() {
    this.cookieConsentSettings = JSON.parse(this.cookiesService.get('cookieConsent') || 'null');
    Object.keys(this.cookieConsentOptions.options).forEach(option => {
      if (
        this.cookieConsentOptions.options[option].required ||
        this.cookieConsentSettings?.enabledOptions.includes(option)
      ) {
        this.selectedIds[option] = true;
      }
    });
  }

  acceptAll() {
    this.cookiesService.setCookiesConsentForAll();
  }

  submit() {
    this.cookiesService.setCookiesConsentFor(
      Object.keys(this.selectedIds).reduce((acc, x) => (this.selectedIds[x] ? acc.push(x) && acc : acc), [])
    );
    this.closeModal.emit();
  }

  hide() {
    this.closeModal.emit();
  }

  unsorted = () => 0;
}
