import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { SolrInstantSearchEffects } from './solr-instant-search/solr-instant-search.effects';
import { solrInstantSearchReducer } from './solr-instant-search/solr-instant-search.reducer';
import { SolrInstantsearchState } from './solr-instantsearch-store';

const solrInstantsearchReducers: ActionReducerMap<SolrInstantsearchState> = {
  solrInstantSearch: solrInstantSearchReducer,
};

const solrInstantsearchEffects = [SolrInstantSearchEffects];

@NgModule({
  imports: [
    EffectsModule.forFeature(solrInstantsearchEffects),
    StoreModule.forFeature('solrInstantsearch', solrInstantsearchReducers),
  ],
})
export class SolrInstantsearchStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<SolrInstantsearchState>)[]) {
    return StoreModule.forFeature('solrInstantsearch', pick(solrInstantsearchReducers, reducers));
  }
}
