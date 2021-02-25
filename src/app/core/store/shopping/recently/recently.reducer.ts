import { createReducer, on } from '@ngrx/store';

import { addToRecently, clearRecently } from './recently.actions';

export interface RecentlyState {
  products: { sku: string; group?: string }[];
}

const initialState: RecentlyState = {
  products: [],
};

export const recentlyReducer = createReducer(
  initialState,
  on(addToRecently, (state: RecentlyState, action) => ({ ...state, products: [action.payload, ...state.products] })),
  on(clearRecently, (state: RecentlyState) => ({ ...state, products: [] }))
);
