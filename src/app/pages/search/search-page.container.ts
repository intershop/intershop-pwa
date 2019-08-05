import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { debounceTime, map, switchMap } from 'rxjs/operators';

import { getProductListingView } from 'ish-core/store/shopping/product-listing';
import { getSearchLoading, getSearchTerm } from 'ish-core/store/shopping/search';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-search-page-container',
  templateUrl: './search-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageContainerComponent {
  searchTerm$ = this.store.pipe(select(getSearchTerm));
  numberOfItems$ = this.searchTerm$.pipe(
    whenTruthy(),
    switchMap(term =>
      this.activatedRoute.queryParamMap.pipe(
        map(params => params && { sorting: params.get('sorting') || undefined }),
        switchMap(({ sorting }) =>
          this.store.pipe(
            select(getProductListingView, { type: 'search', value: term, sorting }),
            whenTruthy(),
            map(view => view.itemCount)
          )
        )
      )
    )
  );
  searchLoading$ = this.store.pipe(
    select(getSearchLoading),
    debounceTime(500)
  );

  constructor(private store: Store<{}>, private activatedRoute: ActivatedRoute) {}
}
