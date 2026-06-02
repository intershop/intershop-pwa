import { EnvironmentProviders, Type, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { ActionReducerMap, StoreModule, provideState } from '@ngrx/store';
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

export function provideStoreLocatorStore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState('storeLocator', storeLocatorReducers),
    provideEffects(storeLocatorEffects),
  ]);
}

export class StoreLocatorStoreProviders {
  static forTesting(...reducers: (keyof ActionReducerMap<StoreLocatorState>)[]) {
    return StoreModule.forFeature('storeLocator', pick(storeLocatorReducers, reducers));
  }
}
