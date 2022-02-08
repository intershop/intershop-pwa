import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn } from 'ish-core/utils/ngrx-creators';

import { Store } from '../../models/store/store.model';

import { highlightStore, loadStores, loadStoresFail, loadStoresSuccess } from './stores.actions';

export interface StoresState extends EntityState<Store> {
  loading: boolean;
  highlighted: string;
  error: HttpError;
}

export const storesAdapter = createEntityAdapter<Store>({ selectId: store => store.id });

export const initialState: StoresState = storesAdapter.getInitialState({
  loading: false,
  highlighted: undefined,
  error: undefined,
});

export const storesReducer = createReducer(
  initialState,
  on(loadStores, state => ({ ...state, loading: true })),
  setErrorOn(loadStoresFail),
  on(highlightStore, (state, action) => {
    const { storeId } = action.payload;
    return { ...state, highlighted: storeId };
  }),
  on(loadStoresSuccess, (state, action) => {
    const { stores } = action.payload;
    return storesAdapter.setAll(stores, { ...state, loading: false, error: undefined });
  })
);
