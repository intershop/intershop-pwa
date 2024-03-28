import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, map, startWith } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { InstantSearchFacade } from 'ish-core/facades/instant-search.facade';

@Component({
  selector: 'ish-instantsearch-overlay',
  templateUrl: './instantsearch-overlay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstantsearchOverlayComponent implements OnInit {
  showResults$: Observable<boolean>;

  constructor(private appFacade: AppFacade, private instantSearchFacade: InstantSearchFacade) {}

  ngOnInit(): void {
    this.showResults$ = this.instantSearchFacade.select('query').pipe(
      map(query => query && query?.length > 0),
      startWith(false)
    );
  }

  desactivateInstantSearch() {
    this.appFacade.setInstantSearch(false);
  }
}
