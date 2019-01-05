import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { AddProductToBasket } from 'ish-core/store/checkout/basket';
import { getICMBaseURL } from 'ish-core/store/configuration';
import { getSelectedCategory } from 'ish-core/store/shopping/categories';
import { AddToCompare } from 'ish-core/store/shopping/compare';
import { getProductLoading, getSelectedProduct } from 'ish-core/store/shopping/products';

@Component({
  selector: 'ish-product-page-container',
  templateUrl: './product-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageContainerComponent {
  product$ = this.store.pipe(select(getSelectedProduct));
  category$ = this.store.pipe(select(getSelectedCategory));
  productLoading$ = this.store.pipe(select(getProductLoading));
  currentUrl$ = this.store.pipe(
    select(getICMBaseURL),
    map(baseUrl => baseUrl + this.location.path())
  );

  constructor(private store: Store<{}>, private location: Location) {}

  addToBasket({ sku, quantity }) {
    this.store.dispatch(new AddProductToBasket({ sku, quantity }));
  }

  addToCompare(sku: string) {
    this.store.dispatch(new AddToCompare({ sku }));
  }
}
