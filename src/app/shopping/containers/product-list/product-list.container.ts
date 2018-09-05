import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';
import { ViewType } from '../../../models/viewtype/viewtype.types';
import {
  ChangeSortBy,
  ChangeViewType,
  canRequestMore,
  getPageIndices,
  getPagingLoading,
  getPagingPage,
  getSortBy,
  getSortKeys,
  getTotalItems,
  getViewType,
  getVisibleProducts,
  isEndlessScrollingEnabled,
  isEveryProductDisplayed,
} from '../../store/viewconf';

@Component({
  selector: 'ish-product-list-container',
  templateUrl: './product-list.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListContainerComponent implements OnInit {
  @Input()
  category?: Category;

  @Input()
  pageUrl: string;

  @Output()
  loadMore = new EventEmitter<void>();

  products$: Observable<Product[]>;
  totalItems$: Observable<number>;
  viewType$: Observable<ViewType>;
  sortBy$: Observable<string>;
  sortKeys$: Observable<string[]>;
  loadingMore$: Observable<boolean>;
  currentPage$: Observable<number>;
  pageIndices$: Observable<number[]>;
  displayPaging$: Observable<boolean>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.products$ = this.store.pipe(select(getVisibleProducts));
    this.totalItems$ = this.store.pipe(select(getTotalItems));
    this.viewType$ = this.store.pipe(select(getViewType));
    this.sortBy$ = this.store.pipe(select(getSortBy));
    this.sortKeys$ = this.store.pipe(select(getSortKeys));
    this.loadingMore$ = this.store.pipe(select(getPagingLoading));
    this.currentPage$ = this.store.pipe(
      select(getPagingPage),
      map(x => x + 1)
    );
    this.pageIndices$ = this.store.pipe(select(getPageIndices));
    this.displayPaging$ = this.store.pipe(
      select(isEveryProductDisplayed),
      map(b => !b)
    );
  }

  /**
   * Emits the event for switching the view type of the product list.
   * @param viewType The new view type.
   */
  changeViewType(viewType: ViewType) {
    this.store.dispatch(new ChangeViewType(viewType));
  }

  /**
   * Emits the event for changing the sorting of the product list.
   * @param sortBy The new sorting value.
   */
  changeSortBy(sortBy: string) {
    this.store.dispatch(new ChangeSortBy(sortBy));
  }

  /**
   * Emits the event for loading more products.
   */
  loadMoreProducts() {
    combineLatest(this.store.pipe(select(canRequestMore)), this.store.pipe(select(isEndlessScrollingEnabled)))
      .pipe(
        take(1),
        filter(([moreAvailable, endlessScrolling]) => moreAvailable && endlessScrolling)
      )
      .subscribe(() => this.loadMore.emit());
  }
}
