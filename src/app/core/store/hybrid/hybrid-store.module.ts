import { isPlatformBrowser } from '@angular/common';
import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { HybridRedirectGuard } from 'ish-core/guards/hybrid-redirect.guard';
import { addGlobalGuard } from 'ish-core/utils/routing';

import { HybridEffects, SSR_HYBRID_STATE } from './hybrid.effects';

@NgModule({
  imports: [EffectsModule.forFeature([HybridEffects])],
})
export class HybridStoreModule {
  constructor(router: Router, transferState: TransferState, @Inject(PLATFORM_ID) platformId: string) {
    if (isPlatformBrowser(platformId) && transferState.get(SSR_HYBRID_STATE, false)) {
      addGlobalGuard(router, HybridRedirectGuard);
    }
  }
}
