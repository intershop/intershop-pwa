import { NgModule } from '@angular/core';

import { INSTANTSEARCH_COMPONENT_PROVIDER } from 'ish-core/facades/instant-search.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { SolrInstantSearchContentProvider } from './solr-instantsearch-content/solr-instantsearch-content.provider';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'solrInstantsearch',
        location: () => import('../store/solr-instantsearch-store.module').then(m => m.SolrInstantsearchStoreModule),
      },
      multi: true,
    },
    {
      provide: INSTANTSEARCH_COMPONENT_PROVIDER,
      useClass: SolrInstantSearchContentProvider,
      multi: true,
    },
  ],
  declarations: [],
  exports: [],
})
export class SolrInstantsearchExportsModule {}
