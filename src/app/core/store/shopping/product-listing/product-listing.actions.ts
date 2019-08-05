import { Action } from '@ngrx/store';

import { ViewType } from 'ish-core/models/viewtype/viewtype.types';

import { ProductListingID, ProductListingType } from './product-listing.reducer';

export enum ProductListingActionTypes {
  SetProductListingPages = '[ProductListing] Set Product Listing Pages',
  LoadMoreProducts = '[ProductListing] Load More Products',
  SetEndlessScrollingPageSize = '[ProductListing] Set Endless Scrolling Page Size',
  SetViewType = '[ProductListing] Set View Type',
  SetSorting = '[ProductListing] Set Sorting',
}

export class SetProductListingPages implements Action {
  readonly type = ProductListingActionTypes.SetProductListingPages;
  constructor(public payload: ProductListingType) {}
}

export class SetEndlessScrollingPageSize implements Action {
  readonly type = ProductListingActionTypes.SetEndlessScrollingPageSize;
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

export type ProductListingAction =
  | SetProductListingPages
  | LoadMoreProducts
  | SetEndlessScrollingPageSize
  | SetViewType
  | SetSorting;
