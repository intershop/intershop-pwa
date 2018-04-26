import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';
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

  constructor(private store: Store<ShoppingState | CheckoutState>) {}

  ngOnInit() {
    this.product$ = this.store.pipe(select(getSelectedProduct), filter(product => !!product));
    this.category$ = this.store.pipe(select(getSelectedCategory), filter(category => !!category));
    this.productLoading$ = this.store.pipe(select(getProductLoading));
  }

  addToBasket({ sku, quantity }) {
    this.store.dispatch(new AddProductToBasket({ sku: sku, quantity: quantity }));
  }

  addToCompare(sku) {
    this.store.dispatch(new AddToCompare(sku));
  }
}
