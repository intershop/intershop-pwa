import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { ProductConfigurationEffects } from './product-configuration/product-configuration.effects';
import { productConfigurationReducer } from './product-configuration/product-configuration.reducer';
import { TactonConfigEffects } from './tacton-config/tacton-config.effects';
import { tactonConfigReducer } from './tacton-config/tacton-config.reducer';
import { TactonState } from './tacton-store';

const tactonReducers: ActionReducerMap<TactonState> = {
  productConfiguration: productConfigurationReducer,
  tactonConfig: tactonConfigReducer,
};

const tactonEffects = [ProductConfigurationEffects, TactonConfigEffects];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(tactonEffects), StoreModule.forFeature('tacton', tactonReducers)],
})
export class TactonStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<TactonState>)[]) {
    return StoreModule.forFeature('tacton', pick(tactonReducers, reducers));
  }
}
