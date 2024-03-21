import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

import { SolrInstantsearchFacade } from '../../facades/solr-instantsearch.facade';

@Component({
  selector: 'ish-instant-search-content',
  templateUrl: './instant-search-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstantSearchContentComponent implements OnInit {
  hasResults$: Observable<boolean>;
  hasNoResults$: Observable<boolean>;
  constructor(private solrInstantSearchFacade: SolrInstantsearchFacade) {}

  ngOnInit() {
    this.hasResults$ = this.solrInstantSearchFacade.numberOfItems$.pipe(map(number => number > 0));
    this.hasNoResults$ = this.hasResults$.pipe(map(value => !value));
  }
}
