import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { SpCheckoutEffects } from './sp-checkout/sp-checkout.effect';
import { SpCheckoutReduder } from './sp-checkout/sp-checkout.reducer';
import { SpCheckoutsState } from './sp-checkout-store';

const spCheckoutsReducers: ActionReducerMap<SpCheckoutsState> = {
  spcheckout: SpCheckoutReduder,
};

const spCheckoutEffects = [SpCheckoutEffects];

const metaReducers = [resetOnLogoutMeta];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(spCheckoutEffects),
    StoreModule.forFeature('spCheckout', spCheckoutsReducers, { metaReducers }),
  ],
})
export class SpCheckoutStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<SpCheckoutsState>)[]) {
    return StoreModule.forFeature('spCheckout', pick(spCheckoutsReducers, reducers), { metaReducers });
  }
}
