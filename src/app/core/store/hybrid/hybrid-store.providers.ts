import {
  EnvironmentProviders,
  TransferState,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { Router } from '@angular/router';
import { provideEffects } from '@ngrx/effects';

import { hybridRedirectGuard } from 'ish-core/guards/hybrid-redirect.guard';
import { addGlobalGuard } from 'ish-core/utils/routing';

import { HybridEffects, SSR_HYBRID_STATE } from './hybrid.effects';

const hybridStoreEffects = [HybridEffects];

function initializeHybridStore() {
  const router = inject(Router);
  const transferState = inject(TransferState);
  // enable the Hybrid Approach handling for the browser side if Hybrid Approach is configured
  if (!SSR && transferState.get(SSR_HYBRID_STATE, false)) {
    addGlobalGuard(router, hybridRedirectGuard);
  }
}

export function provideHybridStore(): EnvironmentProviders {
  return makeEnvironmentProviders([provideEffects(hybridStoreEffects), provideAppInitializer(initializeHybridStore)]);
}

export class HybridStoreProviders {}
