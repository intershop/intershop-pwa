import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { B2bState } from '../../../b2b/store/b2b.state';
import { AddProductToQuoteRequest } from '../../../b2b/store/quote';
import { AddProductToBasket } from '../../../checkout/store/basket';
import { CheckoutState } from '../../../checkout/store/checkout.state';
import { CategoryView } from '../../../models/category-view/category-view.model';
import { Product } from '../../../models/product/product.model';
import { getSelectedCategory } from '../../store/categories';
import { AddToCompare } from '../../store/compare';
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
  category$: Observable<CategoryView>;

  constructor(private store: Store<ShoppingState | CheckoutState | B2bState>) {}

  ngOnInit() {
    this.product$ = this.store.pipe(
      select(getSelectedProduct),
      filter(product => !!product)
    );
    this.category$ = this.store.pipe(
      select(getSelectedCategory),
      filter(category => !!category)
    );
    this.productLoading$ = this.store.pipe(select(getProductLoading));
  }

  addToBasket({ sku, quantity }) {
    this.store.dispatch(new AddProductToBasket({ sku: sku, quantity: quantity }));
  }

  addToCompare(sku) {
    this.store.dispatch(new AddToCompare(sku));
  }

  addToQuote({ sku, quantity }) {
    this.store.dispatch(new AddProductToQuoteRequest({ sku: sku, quantity: quantity }));
  }
}
