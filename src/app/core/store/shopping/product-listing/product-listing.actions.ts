import { Action } from '@ngrx/store';

import { ProductListingID, ProductListingType } from 'ish-core/models/product-listing/product-listing.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';

export enum ProductListingActionTypes {
  SetProductListingPages = '[ProductListing] Set Product Listing Pages',
  LoadMoreProducts = '[ProductListing] Load More Products',
  LoadMoreProductsForParams = '[ProductListing Internal] Load More Products For Params',
  SetProductListingPageSize = '[ProductListing] Set Product Listing Page Size',
  SetViewType = '[ProductListing] Set View Type',
  LoadPagesForMaster = '[ProductListing] Load Pages For Master',
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
  constructor(public payload: { id: ProductListingID; page?: number }) {}
}

export class LoadMoreProductsForParams implements Action {
  readonly type = ProductListingActionTypes.LoadMoreProductsForParams;
  constructor(public payload: { id: ProductListingID; page: number; sorting: string; filters: string }) {}
}

export class SetViewType implements Action {
  readonly type = ProductListingActionTypes.SetViewType;
  constructor(public payload: { viewType: ViewType }) {}
}

export class LoadPagesForMaster implements Action {
  readonly type = ProductListingActionTypes.LoadPagesForMaster;
  constructor(public payload: { id: ProductListingID; filters: string; sorting: string }) {}
}

export type ProductListingAction =
  | SetProductListingPages
  | LoadMoreProducts
  | LoadMoreProductsForParams
  | SetProductListingPageSize
  | SetViewType
  | LoadPagesForMaster;
