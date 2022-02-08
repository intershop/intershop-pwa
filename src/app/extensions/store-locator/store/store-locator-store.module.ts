import { NgModule, Type } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { StoreLocatorConfigEffects } from './store-locator-config/store-locator-config.effects';
import { storeLocatorConfigReducer } from './store-locator-config/store-locator-config.reducer';
import { StoreLocatorState } from './store-locator-store';
import { StoresEffects } from './stores/stores.effects';
import { storesReducer } from './stores/stores.reducer';

const storeLocatorReducers: ActionReducerMap<StoreLocatorState> = {
  stores: storesReducer,
  storeLocatorConfig: storeLocatorConfigReducer,
};

const storeLocatorEffects: Type<unknown>[] = [StoresEffects, StoreLocatorConfigEffects];

@NgModule({
  imports: [
    EffectsModule.forFeature(storeLocatorEffects),
    StoreModule.forFeature('storeLocator', storeLocatorReducers),
  ],
})
export class StoreLocatorStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<StoreLocatorState>)[]) {
    return StoreModule.forFeature('storeLocator', pick(storeLocatorReducers, reducers));
  }
}
