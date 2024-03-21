import { Injectable, Injector, ViewContainerRef, createNgModule } from '@angular/core';

import { InstantSearchComponentProvider } from 'ish-core/facades/instant-search.facade';
import { FeatureToggleType } from 'ish-core/utils/feature-toggle/feature-toggle.service';

@Injectable()
export class SolrInstantSearchContentProvider implements InstantSearchComponentProvider {
  constructor(private injector: Injector) {}

  feature() {
    return 'solrInstantsearch' as FeatureToggleType;
  }

  async renderComponent(anchor: ViewContainerRef) {
    const module = await import(`../../solr-instantsearch.module`).then(m => m.SolrInstantsearchModule);

    const { InstantSearchContentComponent: originalComponent } = await import(
      '../../shared/instant-search-content/instant-search-content.component'
    );

    const ngModuleRef = createNgModule(module, this.injector);

    const component = anchor.createComponent(originalComponent, { ngModuleRef });

    component.changeDetectorRef.markForCheck();
  }
}
