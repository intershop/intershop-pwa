import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, takeUntil, withLatestFrom } from 'rxjs/operators';

import { SearchMoreProducts, getSearchLoading, getSearchTerm } from '../../store/search';
import { ShoppingState } from '../../store/shopping.state';
import { getPagingLoading, getTotalItems, isProductsAvailable } from '../../store/viewconf';

@Component({
  selector: 'ish-search-page-container',
  templateUrl: './search-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageContainerComponent implements OnInit, OnDestroy {
  searchTerm$: Observable<string>;
  totalItems$: Observable<number>;
  searchLoading$: Observable<boolean>;
  productsAvailable$: Observable<boolean>;

  loadMore = new EventEmitter<void>();

  private destroy$ = new Subject();

  constructor(private store: Store<ShoppingState>) {}

  ngOnInit() {
    this.searchTerm$ = this.store.pipe(select(getSearchTerm));
    this.totalItems$ = this.store.pipe(select(getTotalItems));

    this.searchLoading$ = combineLatest(
      this.store.pipe(select(getSearchLoading)),
      this.store.pipe(select(getPagingLoading))
    ).pipe(map(([a, b]) => a && !b));

    this.productsAvailable$ = this.store.pipe(select(isProductsAvailable));

    this.loadMore
      .pipe(withLatestFrom(this.searchTerm$), takeUntil(this.destroy$))
      .subscribe(([, searchTerm]) => this.store.dispatch(new SearchMoreProducts(searchTerm)));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
