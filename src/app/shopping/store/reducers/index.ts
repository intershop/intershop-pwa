import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import * as fromCategories from './categories.reducer';

export interface ShoppingState {
  categories: fromCategories.CategoriesState;
}

export const reducers: ActionReducerMap<ShoppingState> = {
  categories: fromCategories.reducer,
};

export const getShoppingState = createFeatureSelector<ShoppingState>('shopping');
