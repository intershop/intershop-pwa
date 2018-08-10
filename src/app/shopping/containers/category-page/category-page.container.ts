import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CategoryView } from '../../../models/category-view/category-view.model';
import { Product } from '../../../models/product/product.model';
import { ViewType } from '../../../models/viewtype/viewtype.types';
import { firstTruthy } from '../../../utils/selectors';
import {
  getCategoryLoading,
  getProductCountForSelectedCategory,
  getProductsForSelectedCategory,
  getSelectedCategory,
} from '../../store/categories';
import { getFilteredProducts, getNumberOfFilteredProducts } from '../../store/filter/filter.selectors';
import { ShoppingState } from '../../store/shopping.state';
import { ChangeSortBy, ChangeViewType, getSortBy, getSortKeys, getViewType } from '../../store/viewconf';

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
    this.category$ = this.store.pipe(select(getSelectedCategory), filter(e => !!e));
    this.categoryLoading$ = this.store.pipe(select(getCategoryLoading));

    this.products$ = this.store.pipe(select(firstTruthy(getFilteredProducts, getProductsForSelectedCategory)));
    this.totalItems$ = this.store.pipe(
      select(firstTruthy(getNumberOfFilteredProducts, getProductCountForSelectedCategory))
    );
    this.viewType$ = this.store.pipe(select(getViewType));
    this.sortBy$ = this.store.pipe(select(getSortBy));
    this.sortKeys$ = this.store.pipe(select(getSortKeys));
  }

  changeViewType(viewType: ViewType) {
    this.store.dispatch(new ChangeViewType(viewType));
  }

  changeSortBy(sortBy: string) {
    this.store.dispatch(new ChangeSortBy(sortBy));
  }
}
