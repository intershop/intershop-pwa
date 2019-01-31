import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Store, createSelector, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';

import { getCategoryLoading, getSelectedCategory, getSelectedCategoryId } from 'ish-core/store/shopping/categories';
import { LoadMoreProductsForCategory } from 'ish-core/store/shopping/products';
import { getPagingLoading } from 'ish-core/store/shopping/viewconf';

const loading = createSelector(
  getCategoryLoading,
  getPagingLoading,
  (a, b) => a && !b
);

@Component({
  selector: 'ish-category-page-container',
  templateUrl: './category-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPageContainerComponent implements OnInit, OnDestroy {
  category$ = this.store.pipe(select(getSelectedCategory));
  categoryLoading$ = this.store.pipe(select(loading));

  loadMore = new EventEmitter<void>();

  private destroy$ = new Subject();

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.loadMore
      .pipe(
        withLatestFrom(this.store.pipe(select(getSelectedCategoryId))),
        takeUntil(this.destroy$)
      )
      .subscribe(([, categoryUniqueId]) =>
        this.store.dispatch(new LoadMoreProductsForCategory({ categoryId: categoryUniqueId }))
      );
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
