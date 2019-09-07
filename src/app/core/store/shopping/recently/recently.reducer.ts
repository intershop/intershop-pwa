import * as fromRecently from './recently.actions';

export interface RecentlyState {
  products: { sku: string; group?: string }[];
}

export const initialState: RecentlyState = {
  products: [],
};

export function recentlyReducer(state = initialState, action: fromRecently.RecentlyAction): RecentlyState {
  switch (action.type) {
    case fromRecently.RecentlyActionTypes.AddToRecently: {
      const products = [action.payload, ...state.products];

      return { ...state, products };
    }

    case fromRecently.RecentlyActionTypes.ClearRecently: {
      const products = [];

      return { ...state, products };
    }
  }

  return state;
}
