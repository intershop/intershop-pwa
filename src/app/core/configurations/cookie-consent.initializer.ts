import { TransferState, inject } from '@angular/core';

import { COOKIE_CONSENT_VERSION } from 'ish-core/configurations/state-keys';

import { COOKIE_CONSENT_VERSION_VALUE } from './injection-keys';

export function initializeCookieConsent() {
  const transferState = inject(TransferState);
  if (!transferState.hasKey<number>(COOKIE_CONSENT_VERSION)) {
    transferState.set(COOKIE_CONSENT_VERSION, inject(COOKIE_CONSENT_VERSION_VALUE));
  }
}
