import { createSelector } from '@ngrx/store';

import { getSolrInstantsearchState } from '../solr-instantsearch-store';

import { initialState } from './solr-instant-search.reducer';

const getSolrInstantSearchState = createSelector(
  getSolrInstantsearchState,
  state => state?.solrInstantSearch ?? initialState
);

export const getProductListingID = createSelector(getSolrInstantSearchState, state => state.productListingID);
