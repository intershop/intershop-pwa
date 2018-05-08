import { filter } from 'rxjs/operators';
import { createSelector } from '@ngrx/store';
import { Product } from '../../../models/product/product.model';
import { getShoppingState, ShoppingState } from '../shopping.state';

const getFilterState = createSelector(getShoppingState, (state: ShoppingState) => state.filter);

export const getAvailableFilter = createSelector(getFilterState, state => state.availablefilter);
