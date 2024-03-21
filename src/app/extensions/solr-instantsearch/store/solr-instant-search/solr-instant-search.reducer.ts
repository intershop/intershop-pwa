import { createReducer, on } from '@ngrx/store';

import { ProductListingID } from 'ish-core/models/product-listing/product-listing.model';

import { setProductListing } from './solr-instant-search.action';

export interface SolrInstantSearchState {
  productListingID: ProductListingID;
}

export const initialState: SolrInstantSearchState = {
  productListingID: undefined,
};

export const solrInstantSearchReducer = createReducer(
  initialState,
  on(
    setProductListing,
    (state, action): SolrInstantSearchState => ({ ...state, productListingID: action.payload.productListingID })
  )
);
