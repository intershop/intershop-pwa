import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

@Component({
  selector: 'ish-checkout-review-page',
  templateUrl: './checkout-review-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReviewPageComponent implements OnInit {
  basket$: Observable<BasketView>;
  loading$: Observable<boolean>;
  orderLoading$: Observable<boolean>;
  error$: Observable<HttpError>;

  constructor(private checkoutFacade: CheckoutFacade, private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.loading$ = this.checkoutFacade.basketLoading$;
    this.orderLoading$ = this.accountFacade.ordersLoading$;
    this.error$ = this.checkoutFacade.basketOrOrdersError$;
  }

  /**
   * creates an order and routes to receipt page in case of success
   */
  onCreateOrder() {
    this.checkoutFacade.continue(5);
  }
}
