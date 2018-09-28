import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Store, createSelector, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';

import { SearchMoreProducts, getSearchLoading, getSearchTerm } from '../../store/search';
import { getPagingLoading, getTotalItems, isProductsAvailable } from '../../store/viewconf';

const loading = createSelector(getSearchLoading, getPagingLoading, (a, b) => a && !b);

@Component({
  selector: 'ish-search-page-container',
  templateUrl: './search-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageContainerComponent implements OnInit, OnDestroy {
  searchTerm$ = this.store.pipe(select(getSearchTerm));
  totalItems$ = this.store.pipe(select(getTotalItems));
  productsAvailable$ = this.store.pipe(select(isProductsAvailable));
  searchLoading$ = this.store.pipe(select(loading));

  loadMore = new EventEmitter<void>();

  private destroy$ = new Subject();

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.loadMore
      .pipe(
        withLatestFrom(this.searchTerm$),
        takeUntil(this.destroy$)
      )
      .subscribe(([, searchTerm]) => this.store.dispatch(new SearchMoreProducts(searchTerm)));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
