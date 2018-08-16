import { ViewconfActionTypes, ViewconfActions } from './viewconf.actions';

export interface ViewconfState {
  checkoutStep: number;
}

export const initialState: ViewconfState = {
  checkoutStep: undefined,
};

export function viewconfReducer(state: ViewconfState = initialState, action: ViewconfActions) {
  switch (action.type) {
    case ViewconfActionTypes.SetCheckoutStep:
      return {
        ...state,
        checkoutStep: action.payload,
      };
  }

  return state;
}
