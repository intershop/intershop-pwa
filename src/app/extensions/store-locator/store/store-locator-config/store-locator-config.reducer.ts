import { createReducer, on } from '@ngrx/store';

import { setGMAKey } from './store-locator-config.actions';

export interface StoreLocatorConfigState {
  gmaKey: string;
}

export const initialState: StoreLocatorConfigState = {
  gmaKey: undefined,
};

export const storeLocatorConfigReducer = createReducer(
  initialState,
  on(setGMAKey, (state, action): StoreLocatorConfigState => {
    const { gmaKey } = action.payload;
    return { ...state, gmaKey };
  })
);
