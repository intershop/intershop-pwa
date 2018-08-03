import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Product } from '../../../models/product/product.model';
import { ViewType } from '../../../models/viewtype/viewtype.types';
import { getLoadingStatus } from '../../store/filter';
import { getSearchLoading, getSearchTerm, SearchMoreProducts } from '../../store/search';
import { ShoppingState } from '../../store/shopping.state';
import {
  canRequestMore,
  ChangeSortBy,
  ChangeViewType,
  getPagingLoading,
  getPagingPage,
  getSortBy,
  getSortKeys,
  getTotalItems,
  getViewType,
  getVisibleProducts,
  isEndlessScrollingEnabled,
} from '../../store/viewconf';

@Component({
  selector: 'ish-search-page-container',
  templateUrl: './search-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageContainerComponent implements OnInit, OnDestroy {
  searchTerm$: Observable<string>;
  searchLoading$: Observable<boolean>;
  loadingMore$: Observable<boolean>;
  products$: Observable<Product[]>;
  totalItems$: Observable<number>;
  viewType$: Observable<ViewType>;
  sortBy$: Observable<string>;
  sortKeys$: Observable<string[]>;
  canRequestMore$: Observable<boolean>;
  currentPage$: Observable<number>;
  endlessScrolling$: Observable<boolean>;

  loadMore = new EventEmitter<void>();

  private destroy$ = new Subject();

  constructor(private store: Store<ShoppingState>) {}

  ngOnInit() {
    this.searchTerm$ = this.store.pipe(select(getSearchTerm));
    this.loadingMore$ = this.store.pipe(select(getPagingLoading));
    this.searchLoading$ = combineLatest(
      this.store.pipe(select(getSearchLoading)),
      this.store.pipe(select(getLoadingStatus)),
      this.loadingMore$
    ).pipe(map(([a, b, c]) => (a || b) && !c));
    this.products$ = this.store.pipe(select(getVisibleProducts));
    this.totalItems$ = this.store.pipe(select(getTotalItems));
    this.viewType$ = this.store.pipe(select(getViewType));
    this.sortBy$ = this.store.pipe(select(getSortBy));
    this.sortKeys$ = this.store.pipe(select(getSortKeys));

    this.canRequestMore$ = this.store.pipe(select(canRequestMore));
    this.endlessScrolling$ = this.store.pipe(select(isEndlessScrollingEnabled));
    this.loadMore
      .pipe(
        withLatestFrom(this.searchTerm$, this.canRequestMore$, this.endlessScrolling$),
        filter(([, , moreAvailable, endlessScrolling]) => moreAvailable && endlessScrolling),
        takeUntil(this.destroy$)
      )
      .subscribe(([, searchTerm]) => this.store.dispatch(new SearchMoreProducts(searchTerm)));

    this.currentPage$ = this.store.pipe(select(getPagingPage), map(x => x + 1));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  changeViewType(viewType: ViewType) {
    this.store.dispatch(new ChangeViewType(viewType));
  }

  changeSortBy(sortBy: string) {
    this.store.dispatch(new ChangeSortBy(sortBy));
  }
}
