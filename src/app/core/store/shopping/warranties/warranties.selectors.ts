import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { Warranty } from 'ish-core/models/warranty/warranty.model';
import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { warrantiesAdapter } from './warranties.reducer';

const getWarrantiesState = createSelector(getShoppingState, (state: ShoppingState) => state.warranties);

const { selectEntities: selectAllWarranties } = warrantiesAdapter.getSelectors(getWarrantiesState);

export const getWarranty = (warrantyId: string) =>
  createSelector(selectAllWarranties, (entities: Dictionary<Warranty>): Warranty => warrantyId && entities[warrantyId]);

export const getWarrantyLoading = createSelector(getWarrantiesState, state => state.loading);

export const getWarrantyError = createSelector(getWarrantiesState, state => state.error);
