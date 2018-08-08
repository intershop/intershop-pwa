import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Product } from '../../../models/product/product.model';
import { ViewType } from '../../../models/viewtype/viewtype.types';
import { firstTruthy } from '../../../utils/selectors';
import { getFilteredProducts, getNumberOfFilteredProducts } from '../../store/filter';
import { getSearchLoading, getSearchProducts, getSearchTerm, SearchMoreProducts } from '../../store/search';
import { ShoppingState } from '../../store/shopping.state';
import { ChangeSortBy, ChangeViewType, getSortBy, getSortKeys, getTotalItems, getViewType } from '../../store/viewconf';

@Component({
  selector: 'ish-search-page-container',
  templateUrl: './search-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageContainerComponent implements OnInit, OnDestroy {
  searchTerm$: Observable<string>;
  searchLoading$: Observable<boolean>;
  products$: Observable<Product[]>;
  totalItems$: Observable<number>;
  viewType$: Observable<ViewType>;
  sortBy$: Observable<string>;
  sortKeys$: Observable<string[]>;

  loadMore = new EventEmitter<void>();

  private destroy$ = new Subject();

  constructor(private store: Store<ShoppingState>) {}

  ngOnInit() {
    this.searchTerm$ = this.store.pipe(select(getSearchTerm));
    this.searchLoading$ = this.store.pipe(select(getSearchLoading));
    this.products$ = this.store.pipe(select(firstTruthy(getFilteredProducts, getSearchProducts)));
    this.totalItems$ = this.store.pipe(select(firstTruthy(getNumberOfFilteredProducts, getTotalItems)));
    this.viewType$ = this.store.pipe(select(getViewType));
    this.sortBy$ = this.store.pipe(select(getSortBy));
    this.sortKeys$ = this.store.pipe(select(getSortKeys));

    this.loadMore
      .pipe(
        withLatestFrom(this.searchTerm$, this.store.pipe(select(getFilteredProducts))),
        filter(([, , filterMode]) => !filterMode),
        takeUntil(this.destroy$)
      )
      .subscribe(([, searchTerm]) => this.store.dispatch(new SearchMoreProducts(searchTerm)));
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
