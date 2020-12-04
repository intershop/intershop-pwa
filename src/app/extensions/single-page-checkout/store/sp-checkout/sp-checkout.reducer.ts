import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setLoadingOn } from 'ish-core/utils/ngrx-creators';
import { spContinueCheckout, spContinueCheckoutFail } from './sp-checkout.action';

export interface SpCheckoutState {
  loading: boolean;
  selected: string;
  error: HttpError;
}

const initialState: SpCheckoutState = {
  loading: false,
  selected: undefined,
  error: undefined,
};

export const SpCheckoutReduder = createReducer(
  initialState,
  setLoadingOn(spContinueCheckout),
  on(spContinueCheckoutFail, (state: SpCheckoutState, action) => {
    const { error } = action.payload;
    return {
      ...state,
      loading: false,
      error,
      selected: undefined,
    };
  })
);
