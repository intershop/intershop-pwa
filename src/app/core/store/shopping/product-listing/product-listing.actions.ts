import { Action } from '@ngrx/store';

import { ViewType } from 'ish-core/models/viewtype/viewtype.types';

import { ProductListingID, ProductListingType } from './product-listing.reducer';

export enum ProductListingActionTypes {
  SetProductListingPages = '[ProductListing] Set Product Listing Pages',
  LoadMoreProducts = '[ProductListing] Load More Products',
  SetProductListingPageSize = '[ProductListing] Set Product Listing Page Size',
  SetViewType = '[ProductListing] Set View Type',
  SetSorting = '[ProductListing] Set Sorting',
  SetFilters = '[ProductListing] Set Filters',
}

export class SetProductListingPages implements Action {
  readonly type = ProductListingActionTypes.SetProductListingPages;
  constructor(public payload: ProductListingType) {}
}

export class SetProductListingPageSize implements Action {
  readonly type = ProductListingActionTypes.SetProductListingPageSize;
  constructor(public payload: { itemsPerPage: number }) {}
}

export class LoadMoreProducts implements Action {
  readonly type = ProductListingActionTypes.LoadMoreProducts;
  constructor(public payload: { id: ProductListingID; page: number }) {}
}

export class SetViewType implements Action {
  readonly type = ProductListingActionTypes.SetViewType;
  constructor(public payload: { viewType: ViewType }) {}
}

export class SetSorting implements Action {
  readonly type = ProductListingActionTypes.SetSorting;
  constructor(public payload: { id: ProductListingID; sorting: string }) {}
}

export class SetFilters implements Action {
  readonly type = ProductListingActionTypes.SetFilters;
  constructor(public payload: { id: ProductListingID; filters: string }) {}
}

export type ProductListingAction =
  | SetProductListingPages
  | LoadMoreProducts
  | SetProductListingPageSize
  | SetViewType
  | SetSorting
  | SetFilters;
