import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AddProductToBasket } from '../../../checkout/store/basket';
import { CheckoutState } from '../../../checkout/store/checkout.state';
import { Product } from '../../../models/product/product.model';
import { getCompareProducts, getCompareProductsCount, RemoveFromCompare } from '../../store/compare';
import { ShoppingState } from '../../store/shopping.state';

@Component({
  selector: 'ish-compare-page-container',
  templateUrl: './compare-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparePageContainerComponent implements OnInit {
  compareProducts$: Observable<Product[]>;
  compareProductsCount$: Observable<number>;

  constructor(private store: Store<ShoppingState | CheckoutState>) {}

  ngOnInit() {
    this.compareProducts$ = this.store.pipe(select(getCompareProducts));
    this.compareProductsCount$ = this.store.pipe(select(getCompareProductsCount));
  }

  addToBasket({ sku, quantity }) {
    this.store.dispatch(new AddProductToBasket({ sku: sku, quantity: quantity }));
  }

  removeFromCompare(sku: string) {
    this.store.dispatch(new RemoveFromCompare(sku));
  }
}
