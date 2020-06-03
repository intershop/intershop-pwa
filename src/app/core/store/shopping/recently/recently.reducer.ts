import { RecentlyAction, RecentlyActionTypes } from './recently.actions';

export interface RecentlyState {
  products: { sku: string; group?: string }[];
}

const initialState: RecentlyState = {
  products: [],
};

export function recentlyReducer(state = initialState, action: RecentlyAction): RecentlyState {
  switch (action.type) {
    case RecentlyActionTypes.AddToRecently: {
      const products = [action.payload, ...state.products];

      return { ...state, products };
    }

    case RecentlyActionTypes.ClearRecently: {
      const products = [];

      return { ...state, products };
    }
  }

  return state;
}
