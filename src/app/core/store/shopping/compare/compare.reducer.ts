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
      const productSKU = action.payload;
      const products = state.products.includes(productSKU) ? [...state.products] : [...state.products, productSKU];

      return { ...state, products };
    }

    case fromCompare.CompareActionTypes.RemoveFromCompare: {
      const productSKU = action.payload;
      const products = state.products.filter(sku => sku !== productSKU);

      return { ...state, products };
    }
  }

  return state;
}
