import { createAction } from '@ngrx/store';

import { ProductListingID, ProductListingType } from 'ish-core/models/product-listing/product-listing.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { payload } from 'ish-core/utils/ngrx-creators';
import { URLFormParams } from 'ish-core/utils/url-form-params';

export const setProductListingPages = createAction(
  '[Product Listing Internal] Set Product Listing Pages',
  payload<ProductListingType>()
);

export const setProductListingPageSize = createAction(
  '[Product Listing Internal] Set Product Listing Page Size',
  payload<{ itemsPerPage: number }>()
);

export const loadMoreProducts = createAction(
  '[Product Listing] Load More Products',
  payload<{ id: ProductListingID; page?: number }>()
);

export const loadMoreProductsForParams = createAction(
  '[Product Listing Internal] Load More Products For Params',
  payload<{ id: ProductListingID; page: number; sorting: string; filters: URLFormParams }>()
);

export const setViewType = createAction('[Product Listing Internal] Set View Type', payload<{ viewType: ViewType }>());
