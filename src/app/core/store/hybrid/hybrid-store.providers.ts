import {
  APP_INITIALIZER,
  EnvironmentProviders,
  TransferState,
  makeEnvironmentProviders,
} from '@angular/core';
import { Router } from '@angular/router';
import { provideEffects } from '@ngrx/effects';

import { hybridRedirectGuard } from 'ish-core/guards/hybrid-redirect.guard';
import { addGlobalGuard } from 'ish-core/utils/routing';

import { HybridEffects, SSR_HYBRID_STATE } from './hybrid.effects';

const hybridStoreEffects = [HybridEffects];

function initializeHybridStore(router: Router, transferState: TransferState) {
  return () => {
    // enable the Hybrid Approach handling for the browser side if Hybrid Approach is configured
    if (!SSR && transferState.get(SSR_HYBRID_STATE, false)) {
      addGlobalGuard(router, hybridRedirectGuard);
    }
  };
}

export function provideHybridStore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEffects(hybridStoreEffects),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeHybridStore,
      deps: [Router, TransferState],
      multi: true,
    },
  ]);
}

export class HybridStoreProviders {}
