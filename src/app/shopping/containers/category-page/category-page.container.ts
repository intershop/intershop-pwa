import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CategoryView } from '../../../models/category-view/category-view.model';
import { Product } from '../../../models/product/product.model';
import { ViewType } from '../../../models/viewtype/viewtype.types';
import * as fromStore from '../../store/categories';
import { getFilteredProducts, getNumberOfFilteredProducts } from '../../store/filter/filter.selectors';
import { ShoppingState } from '../../store/shopping.state';
import * as fromViewconf from '../../store/viewconf';

@Component({
  selector: 'ish-category-page-container',
  templateUrl: './category-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPageContainerComponent implements OnInit {
  category$: Observable<CategoryView>;
  categoryLoading$: Observable<boolean>;
  products$: Observable<Product[]>;
  totalItems$: Observable<number>;
  viewType$: Observable<ViewType>;
  sortBy$: Observable<string>;
  sortKeys$: Observable<string[]>;

  loadMore = new EventEmitter<void>(); // TODO: implement me

  constructor(private store: Store<ShoppingState>) {}

  ngOnInit() {
    this.category$ = this.store.pipe(
      select(fromStore.getSelectedCategory),
      filter(e => !!e)
    );
    this.categoryLoading$ = this.store.pipe(select(fromStore.getCategoryLoading));

    this.products$ = this.store.pipe(
      select(
        createSelector(
          getFilteredProducts,
          fromStore.getProductsForSelectedCategory,
          (filtered, all) => (!!filtered ? filtered : all)
        )
      )
    );
    this.totalItems$ = this.store.pipe(
      select(
        createSelector(
          getNumberOfFilteredProducts,
          fromStore.getProductCountForSelectedCategory,
          (filtered, all) => (!!filtered ? filtered : all)
        )
      )
    );
    this.viewType$ = this.store.pipe(select(fromViewconf.getViewType));
    this.sortBy$ = this.store.pipe(select(fromViewconf.getSortBy));
    this.sortKeys$ = this.store.pipe(select(fromViewconf.getSortKeys));
  }

  changeViewType(viewType: ViewType) {
    this.store.dispatch(new fromViewconf.ChangeViewType(viewType));
  }

  changeSortBy(sortBy: string) {
    this.store.dispatch(new fromViewconf.ChangeSortBy(sortBy));
  }
}
