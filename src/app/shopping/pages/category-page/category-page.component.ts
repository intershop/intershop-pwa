import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { filter } from 'rxjs/operators';
import * as fromRoot from '../../../core/store';
import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';
import * as fromStore from '../../store';
import * as fromCategories from '../../store/reducers/categories.reducer';


@Component({
  selector: 'ish-category-page',
  templateUrl: './category-page.component.html'
})

export class CategoryPageComponent implements OnInit {

  category$: Observable<Category>;
  categoryLoading$: Observable<boolean>;
  categoryPath$: Observable<Category[]> = of([]); // TODO: only category should be needed once the REST call returns the categoryPath as part of the category
  productsForCategory$: Observable<Product[]>;

  // TODO: these properties were copied from family-page.component and their relevance needs to be evaluated
  listView: boolean;
  sortBy: any;
  totalItems$: Observable<number>;

  itemsPluralMapping = {
    '=0': 'No Items',
    '=1': '1 List Item',
    'other': '# List Items'
  };

  constructor(
    private store: Store<fromCategories.CategoriesState>
  ) { }

  ngOnInit() {
    // TODO: find a nicer way to filter out the case of an 'undefined' category
    this.category$ = this.store.select(fromStore.getSelectedCategory).pipe(filter(e => !!e));
    this.categoryLoading$ = this.store.select(fromStore.getCategoryLoading);

    this.productsForCategory$ = this.store.select(fromStore.getProductsForSelectedCategory);
    this.totalItems$ = this.store.select(fromStore.getProductCountForSelectedCategory);

    // TODO: only category should be needed once the REST call returns the categoryPath as part of the category
    this.categoryPath$ = this.store.select(fromStore.getSelectedCategoryPath);
  }
}
