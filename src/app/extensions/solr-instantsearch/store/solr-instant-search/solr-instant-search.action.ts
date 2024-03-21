import { createAction } from '@ngrx/store';

import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';
import { payload } from 'ish-core/utils/ngrx-creators';

export const setProductListing = createAction(
  '[InstantSearch] Set Product Listing',
  payload<{ productListingID: ProductListingID }>()
);
