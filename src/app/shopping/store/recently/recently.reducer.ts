import * as fromRecently from './recently.actions';

export interface RecentlyState {
  products: string[];
}

export const initialState: RecentlyState = {
  products: []
};

export function recentlyReducer(
  state = initialState,
  action: fromRecently.RecentlyAction
): RecentlyState {
  switch (action.type) {

    case fromRecently.RecentlyActionTypes.AddToRecently: {
      const newProduct = action.payload;
      const products = [newProduct, ...state.products.filter(id => id !== newProduct)];

      return { ...state, products };
    }

    case fromRecently.RecentlyActionTypes.ClearRecently: {
      const products = [];

      return { ...state, products };
    }

  }

  return state;
}
