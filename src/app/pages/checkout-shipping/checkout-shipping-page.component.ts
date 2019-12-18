import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';

@Component({
  selector: 'ish-checkout-shipping-page',
  templateUrl: './checkout-shipping-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutShippingPageComponent implements OnInit {
  basket$: Observable<BasketView>;
  loading$: Observable<boolean>;
  shippingMethods$: Observable<ShippingMethod[]>;
  basketError$: Observable<HttpError>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.loading$ = this.checkoutFacade.basketLoading$;
    this.shippingMethods$ = this.checkoutFacade.eligibleShippingMethods$();
    this.basketError$ = this.checkoutFacade.basketError$;
  }

  updateBasketShippingMethod(shippingId: string) {
    this.checkoutFacade.updateBasketShippingMethod(shippingId);
  }

  /**
   * Validates the basket and jumps to the next checkout step (Payment)
   */
  nextStep() {
    this.checkoutFacade.continue(3);
  }
}
