import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { InstantSearchContentComponent } from './shared/instant-search-content/instant-search-content.component';
import { InstantSearchNoResultComponent } from './shared/instant-search-no-result/instant-search-no-result.component';
import { InstantSearchResultComponent } from './shared/instant-search-result/instant-search-result.component';

@NgModule({
  imports: [SharedModule],
  declarations: [InstantSearchContentComponent, InstantSearchNoResultComponent, InstantSearchResultComponent],
  exports: [SharedModule],
})
export class SolrInstantsearchModule {}
