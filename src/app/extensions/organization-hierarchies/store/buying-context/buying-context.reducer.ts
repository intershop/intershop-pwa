import { createReducer, on } from '@ngrx/store';

import { assignBuyingContextSuccess } from './buying-context.actions';

export interface BuyingContextState {
  bctx: string;
}

const initialState: BuyingContextState = {
  bctx: undefined,
};

export const buyingContextReducer = createReducer(
  initialState,
  on(assignBuyingContextSuccess, (state: BuyingContextState, action): BuyingContextState => {
    const payload = action.payload;
    return {
      ...state,
      bctx: payload.bctx,
    };
  })
);
