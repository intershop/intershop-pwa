import { createFeatureSelector } from '@ngrx/store';

import { SolrInstantSearchState } from './solr-instant-search/solr-instant-search.reducer';

export interface SolrInstantsearchState {
  solrInstantSearch: SolrInstantSearchState;
}

export const getSolrInstantsearchState = createFeatureSelector<SolrInstantsearchState>('solrInstantsearch');
