import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { filter } from 'rxjs/operators';
import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';
import { getSelectedCategory, getSelectedCategoryPath } from '../../store/categories';
import { getProductLoading, getSelectedProduct } from '../../store/products';
import { ShoppingState } from '../../store/shopping.state';

@Component({
  selector: 'ish-product-page-container',
  templateUrl: './product-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProductPageContainerComponent implements OnInit {

  product$: Observable<Product>;
  productLoading$: Observable<boolean>;
  category$: Observable<Category>;
  categoryPath$: Observable<Category[]> = of([]);

  constructor(
    private store: Store<ShoppingState>
  ) { }

  ngOnInit() {
    // TODO: find a nicer way to filter out the case of an 'undefined' product when the router state change is not waiting for the guard to actually do the routing
    this.product$ = this.store.pipe(
      select(getSelectedProduct),
      filter(product => !!product)
    );

    // TODO: find a nicer way to filter out the case of an 'undefined' category when the router state change is not waiting for the guard to actually do the routing
    this.category$ = this.store.pipe(
      select(getSelectedCategory),
      filter(category => !!category)
    );

    this.productLoading$ = this.store.pipe(select(getProductLoading));

    // TODO: only category should be needed once the REST call returns the categoryPath as part of the category
    this.categoryPath$ = this.store.pipe(select(getSelectedCategoryPath));
  }

}
