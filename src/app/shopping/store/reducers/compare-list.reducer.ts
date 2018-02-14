import * as fromCompareList from '../actions/compare-list.actions';
import { CompareListActionTypes } from '../actions/compare-list.actions';

export interface CompareListState {
  skus: string[];
}


export const initialState: CompareListState = {
  skus: []
};

export function reducer(
  state = initialState,
  action: fromCompareList.CompareListAction
): CompareListState {
  switch (action.type) {

    case CompareListActionTypes.ADD_TO_COMPARE_LIST: {
      const newSku = action.payload;
      const skus = state.skus.includes(newSku) ?
        [...state.skus] :
        [...state.skus, newSku];

      return { ...state, skus };
    }

    case CompareListActionTypes.REMOVE_FROM_COMPARE_LIST: {
      const sku = action.payload;
      const skus = state.skus.filter(e => e !== sku);

      return { ...state, skus };
    }
  }

  return state;
}
