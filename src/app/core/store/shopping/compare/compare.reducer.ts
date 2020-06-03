import { CompareAction, CompareActionTypes } from './compare.actions';

export interface CompareState {
  products: string[];
}

export const initialState: CompareState = {
  products: [],
};

export function compareReducer(state = initialState, action: CompareAction): CompareState {
  switch (action.type) {
    case CompareActionTypes.AddToCompare: {
      const { sku } = action.payload;
      const products = state.products.includes(sku) ? [...state.products] : [...state.products, sku];

      return { ...state, products };
    }

    case CompareActionTypes.RemoveFromCompare: {
      const { sku } = action.payload;
      const products = state.products.filter(current => current !== sku);

      return { ...state, products };
    }
  }

  return state;
}
