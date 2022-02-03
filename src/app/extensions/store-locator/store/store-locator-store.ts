import { createFeatureSelector } from '@ngrx/store';

import { StoreLocatorConfigState } from './store-locator-config/store-locator-config.reducer';
import { StoresState } from './stores/stores.reducer';

export interface StoreLocatorState {
  stores: StoresState;
  storeLocatorConfig: StoreLocatorConfigState;
}

export const getStoreLocatorState = createFeatureSelector<StoreLocatorState>('storeLocator');
