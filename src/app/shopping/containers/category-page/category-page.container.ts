import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { CategoryView } from '../../../models/category-view/category-view.model';
import { Product } from '../../../models/product/product.model';
import { ViewType } from '../../../models/viewtype/viewtype.types';
import { firstTruthy } from '../../../utils/selectors';
import {
  getCategoryLoading,
  getProductsForSelectedCategory,
  getSelectedCategory,
  getSelectedCategoryId,
} from '../../store/categories';
import { getFilteredProducts, getLoadingStatus, getNumberOfFilteredProducts } from '../../store/filter';
import { LoadMoreProductsForCategory } from '../../store/products';
import { ShoppingState } from '../../store/shopping.state';
import {
  ChangeSortBy,
  ChangeViewType,
  getPagingLoading,
  getSortBy,
  getSortKeys,
  getTotalItems,
  getViewType,
} from '../../store/viewconf';

@Component({
  selector: 'ish-category-page-container',
  templateUrl: './category-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPageContainerComponent implements OnInit, OnDestroy {
  category$: Observable<CategoryView>;
  categoryLoading$: Observable<boolean>;
  loadingMore$: Observable<boolean>;
  products$: Observable<Product[]>;
  totalItems$: Observable<number>;
  viewType$: Observable<ViewType>;
  sortBy$: Observable<string>;
  sortKeys$: Observable<string[]>;

  loadMore = new EventEmitter<void>();

  private destroy$ = new Subject();

  constructor(private store: Store<ShoppingState>) {}

  ngOnInit() {
    this.category$ = this.store.pipe(select(getSelectedCategory), filter(e => !!e));
    this.categoryLoading$ = combineLatest(
      this.store.pipe(select(getCategoryLoading)),
      this.store.pipe(select(getLoadingStatus))
    ).pipe(map(([a, b]) => a || b));
    this.loadingMore$ = combineLatest(this.store.pipe(select(getPagingLoading)), this.categoryLoading$).pipe(
      map(([a, b]) => a && !b)
    );

    this.products$ = this.store.pipe(select(firstTruthy(getFilteredProducts, getProductsForSelectedCategory)));
    this.totalItems$ = this.store.pipe(select(firstTruthy(getNumberOfFilteredProducts, getTotalItems)));
    this.viewType$ = this.store.pipe(select(getViewType));
    this.sortBy$ = this.store.pipe(select(getSortBy));
    this.sortKeys$ = this.store.pipe(select(getSortKeys));

    this.loadMore
      .pipe(
        withLatestFrom(this.store.pipe(select(getSelectedCategoryId)), this.store.pipe(select(getFilteredProducts))),
        filter(([, , filterMode]) => !filterMode),
        takeUntil(this.destroy$)
      )
      .subscribe(([, categoryUniqueId]) => this.store.dispatch(new LoadMoreProductsForCategory(categoryUniqueId)));
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
