import { NgModule, TransferState } from '@angular/core';
import { Router } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { hybridRedirectGuard } from 'ish-core/guards/hybrid-redirect.guard';
import { addGlobalGuard } from 'ish-core/utils/routing';

import { HybridEffects, SSR_HYBRID_STATE } from './hybrid.effects';

@NgModule({
  imports: [EffectsModule.forFeature([HybridEffects])],
})
export class HybridStoreModule {
  constructor(router: Router, transferState: TransferState) {
    // enable the Hybrid Approach handling for the browser side if Hybrid Approach is configured
    if (!SSR && transferState.get(SSR_HYBRID_STATE, false)) {
      addGlobalGuard(router, hybridRedirectGuard);
    }
  }
}
