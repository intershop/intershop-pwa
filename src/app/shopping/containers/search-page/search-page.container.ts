import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { map, takeUntil, withLatestFrom } from 'rxjs/operators';

import { SearchMoreProducts, getSearchLoading, getSearchTerm } from '../../store/search';
import { getPagingLoading, getTotalItems, isProductsAvailable } from '../../store/viewconf';

@Component({
  selector: 'ish-search-page-container',
  templateUrl: './search-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageContainerComponent implements OnInit, OnDestroy {
  searchTerm$ = this.store.pipe(select(getSearchTerm));
  totalItems$ = this.store.pipe(select(getTotalItems));
  productsAvailable$ = this.store.pipe(select(isProductsAvailable));
  searchLoading$ = combineLatest(
    this.store.pipe(select(getSearchLoading)),
    this.store.pipe(select(getPagingLoading))
  ).pipe(map(([a, b]) => a && !b));

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
