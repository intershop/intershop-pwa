import { createAction } from '@ngrx/store';

import { ProductListingID, ProductListingType } from 'ish-core/models/product-listing/product-listing.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { payload } from 'ish-core/utils/ngrx-creators';

export const setProductListingPages = createAction(
  '[ProductListing] Set Product Listing Pages',
  payload<ProductListingType>()
);

export const setProductListingPageSize = createAction(
  '[ProductListing] Set Product Listing Page Size',
  payload<{ itemsPerPage: number }>()
);

export const loadMoreProducts = createAction(
  '[ProductListing] Load More Products',
  payload<{ id: ProductListingID; page?: number }>()
);

export const loadMoreProductsForParams = createAction(
  '[ProductListing Internal] Load More Products For Params',
  payload<{ id: ProductListingID; page: number; sorting: string; filters: string }>()
);

export const setViewType = createAction('[ProductListing] Set View Type', payload<{ viewType: ViewType }>());

export const loadPagesForMaster = createAction(
  '[ProductListing] Load Pages For Master',
  payload<{ id: ProductListingID; filters: string; sorting: string }>()
);
