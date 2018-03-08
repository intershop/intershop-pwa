import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { filter } from 'rxjs/operators';
import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';
import { ViewType } from '../../../models/types';
import * as fromStore from '../../store/categories';
import * as fromViewconf from '../../store/viewconf';

@Component({
  selector: 'ish-category-page-container',
  templateUrl: './category-page.container.html'
})

export class CategoryPageContainerComponent implements OnInit {

  category$: Observable<Category>;
  categoryLoading$: Observable<boolean>;
  categoryPath$: Observable<Category[]> = of([]); // TODO: only category should be needed once the REST call returns the categoryPath as part of the category
  products$: Observable<Product[]>;
  totalItems$: Observable<number>;
  viewType$: Observable<ViewType>;
  sortBy$: Observable<string>;
  sortKeys$: Observable<string[]>;

  constructor(
    private store: Store<fromStore.ShoppingState>
  ) { }

  ngOnInit() {
    // TODO: find a nicer way to filter out the case of an 'undefined' category
    this.category$ = this.store.pipe(
      select(fromStore.getSelectedCategory),
      filter(e => !!e)
    );
    this.categoryLoading$ = this.store.pipe(select(fromStore.getCategoryLoading));

    this.products$ = this.store.pipe(select(fromStore.getProductsForSelectedCategory));
    this.totalItems$ = this.store.pipe(select(fromStore.getProductCountForSelectedCategory));
    this.viewType$ = this.store.pipe(select(fromViewconf.getViewType));
    this.sortBy$ = this.store.pipe(select(fromViewconf.getSortBy));
    this.sortKeys$ = this.store.pipe(select(fromViewconf.getSortKeys));

    // TODO: only category should be needed once the REST call returns the categoryPath as part of the category
    this.categoryPath$ = this.store.pipe(select(fromStore.getSelectedCategoryPath));
  }

  changeViewType(viewType: ViewType) {
    this.store.dispatch(new fromViewconf.ChangeViewType(viewType));
  }

  changeSortBy(sortBy: string) {
    this.store.dispatch(new fromViewconf.ChangeSortBy(sortBy));
  }
}
