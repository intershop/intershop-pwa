import * as fromCompare from './compare.actions';

export interface CompareState {
  skus: string[];
}

export const initialState: CompareState = {
  skus: []
};

export function compareReducer(
  state = initialState,
  action: fromCompare.CompareAction
): CompareState {
  switch (action.type) {

    case fromCompare.CompareActionTypes.AddToCompare: {
      const newSku = action.payload;
      const skus = state.skus.includes(newSku) ?
        [...state.skus] :
        [...state.skus, newSku];

      return { ...state, skus };
    }

    case fromCompare.CompareActionTypes.RemoveFromCompare: {
      const sku = action.payload;
      const skus = state.skus.filter(e => e !== sku);

      return { ...state, skus };
    }
  }

  return state;
}
