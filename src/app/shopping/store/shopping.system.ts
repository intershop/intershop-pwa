import { ActionReducerMap } from '@ngrx/store';
import { CategoriesEffects } from './categories/categories.effects';
import * as fromCategories from './categories/categories.reducer';
import { CompareListEffects } from './compare-list/compare-list.effects';
import * as fromCompareList from './compare-list/compare-list.reducer';
import { ProductsEffects } from './products/products.effects';
import * as fromProducts from './products/products.reducer';
import { ShoppingState } from './shopping.state';

export const reducers: ActionReducerMap<ShoppingState> = {
  categories: fromCategories.reducer,
  products: fromProducts.reducer,
  compareList: fromCompareList.reducer
};

export const effects: any[] = [CategoriesEffects, ProductsEffects, CompareListEffects];
