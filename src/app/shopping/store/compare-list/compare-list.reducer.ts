import * as fromCompareList from './compare-list.actions';
import { CompareListActionTypes } from './compare-list.actions';

export interface CompareListState {
  skus: string[];
}


export const initialState: CompareListState = {
  skus: []
};

export function compareListReducer(
  state = initialState,
  action: fromCompareList.CompareListAction
): CompareListState {
  switch (action.type) {

    case CompareListActionTypes.AddToCompareList: {
      const newSku = action.payload;
      const skus = state.skus.includes(newSku) ?
        [...state.skus] :
        [...state.skus, newSku];

      return { ...state, skus };
    }

    case CompareListActionTypes.RemoveFromCompareList: {
      const sku = action.payload;
      const skus = state.skus.filter(e => e !== sku);

      return { ...state, skus };
    }
  }

  return state;
}
