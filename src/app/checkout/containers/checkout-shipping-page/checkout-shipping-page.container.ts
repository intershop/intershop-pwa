import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import {
  LoadBasketEligibleShippingMethods,
  UpdateBasketShippingMethod,
  getBasketEligibleShippingMethods,
  getBasketError,
  getBasketLoading,
  getCurrentBasket,
} from '../../store/basket';

@Component({
  selector: 'ish-checkout-shipping-page-container',
  templateUrl: './checkout-shipping-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutShippingPageContainerComponent implements OnInit {
  basket$ = this.store.pipe(select(getCurrentBasket));
  loading$ = this.store.pipe(select(getBasketLoading));
  shippingMethods$ = this.store.pipe(select(getBasketEligibleShippingMethods));
  basketError$ = this.store.pipe(select(getBasketError));

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.store.dispatch(new LoadBasketEligibleShippingMethods());
  }

  updateBasketShippingMethod(shippingId: string) {
    this.store.dispatch(new UpdateBasketShippingMethod(shippingId));
  }
}
