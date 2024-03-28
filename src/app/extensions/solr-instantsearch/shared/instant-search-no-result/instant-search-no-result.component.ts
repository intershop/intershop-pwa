import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { InstantSearchFacade } from 'ish-core/facades/instant-search.facade';

@Component({
  selector: 'ish-instant-search-no-result',
  templateUrl: './instant-search-no-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstantSearchNoResultComponent implements OnInit {
  searchTerm$: Observable<string>;

  constructor(private instantSearchFacade: InstantSearchFacade) {}

  ngOnInit() {
    this.searchTerm$ = this.instantSearchFacade.select('query');
  }
}
