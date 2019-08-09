import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { debounceTime, map, switchMap } from 'rxjs/operators';

import { getProductListingView } from 'ish-core/store/shopping/product-listing';
import { getSearchLoading, getSearchTerm } from 'ish-core/store/shopping/search';

@Component({
  selector: 'ish-search-page-container',
  templateUrl: './search-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageContainerComponent {
  searchTerm$ = this.store.pipe(select(getSearchTerm));
  numberOfItems$ = this.searchTerm$.pipe(
    switchMap(term =>
      this.store.pipe(
        select(getProductListingView, { type: 'search', value: term }),
        map(view => view.itemCount)
      )
    )
  );
  searchLoading$ = this.store.pipe(
    select(getSearchLoading),
    debounceTime(500)
  );

  constructor(private store: Store<{}>) {}
}
