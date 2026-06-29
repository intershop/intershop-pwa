import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { COOKIE_CONSENT_OPTIONS } from 'ish-core/configurations/injection-keys';
import { CookieConsentSettings } from 'ish-core/models/cookies/cookies.model';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { InjectSingle } from 'ish-core/utils/injection';

/**
 * Cookies Modal Component
 */
@Component({
  selector: 'ish-cookies-modal',
  imports: [KeyValuePipe, TranslatePipe],
  standalone: true,
  templateUrl: './cookies-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookiesModalComponent implements OnInit {
  @Output() readonly closeModal = new EventEmitter<void>();

  cookieConsentSettings?: CookieConsentSettings;
  selectedIds: Record<string, boolean> = {};

  constructor(
    @Inject(COOKIE_CONSENT_OPTIONS) public cookieConsentOptions: InjectSingle<typeof COOKIE_CONSENT_OPTIONS>,
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
