import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Basket } from '../../../models/basket/basket.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { ShippingMethod } from '../../../models/shipping-method/shipping-method.model';
import {
  LoadBasketEligibleShippingMethods,
  UpdateBasketShippingMethod,
  getBasketEligibleShippingMethods,
  getBasketError,
  getBasketLoading,
  getCurrentBasket,
} from '../../store/basket';
import { CheckoutState } from '../../store/checkout.state';

@Component({
  selector: 'ish-checkout-shipping-page-container',
  templateUrl: './checkout-shipping-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutShippingPageContainerComponent implements OnInit {
  basket$: Observable<Basket>;
  loading$: Observable<boolean>;
  shippingMethods$: Observable<ShippingMethod[]>;
  basketError$: Observable<HttpError>;

  constructor(private store: Store<CheckoutState>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
    this.loading$ = this.store.pipe(select(getBasketLoading));
    this.basketError$ = this.store.pipe(select(getBasketError));

    this.store.dispatch(new LoadBasketEligibleShippingMethods());
    this.shippingMethods$ = this.store.pipe(select(getBasketEligibleShippingMethods));
  }

  updateBasketShippingMethod(shippingId: string) {
    this.store.dispatch(new UpdateBasketShippingMethod(shippingId));
  }
}
