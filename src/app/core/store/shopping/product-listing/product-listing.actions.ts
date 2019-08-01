import { Action } from '@ngrx/store';

import { ProductListingID, ProductListingType } from './product-listing.reducer';

export enum ProductListingActionTypes {
  SetProductListingPages = '[ProductListing] Set Product Listing Pages',
  LoadMoreProducts = '[ProductListing] Load More Products',
  SetEndlessScrollingPageSize = '[ProductListing] Set Endless Scrolling Page Size',
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

export type ProductListingAction = SetProductListingPages | LoadMoreProducts | SetEndlessScrollingPageSize;
