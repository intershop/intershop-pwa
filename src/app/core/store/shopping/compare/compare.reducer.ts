import * as fromCompare from './compare.actions';

export interface CompareState {
  products: string[];
}

export const initialState: CompareState = {
  products: [],
};

export function compareReducer(state = initialState, action: fromCompare.CompareAction): CompareState {
  switch (action.type) {
    case fromCompare.CompareActionTypes.AddToCompare: {
      const { sku } = action.payload;
      const products = state.products.includes(sku) ? [...state.products] : [...state.products, sku];

      return { ...state, products };
    }

    case fromCompare.CompareActionTypes.RemoveFromCompare: {
      const { sku } = action.payload;
      const products = state.products.filter(current => current !== sku);

      return { ...state, products };
    }
  }

  return state;
}
