import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, merge } from 'rxjs';

import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { getBasketError, getBasketLoading, getCurrentBasket } from 'ish-core/store/checkout/basket';
import { CreateOrder, getOrdersError } from 'ish-core/store/orders';

@Component({
  selector: 'ish-checkout-review-page-container',
  templateUrl: './checkout-review-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReviewPageContainerComponent implements OnInit {
  error$: Observable<HttpError>;

  basket$ = this.store.pipe(select(getCurrentBasket));
  loading$ = this.store.pipe(select(getBasketLoading));

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.error$ = merge(this.store.pipe(select(getBasketError)), this.store.pipe(select(getOrdersError)));
  }

  /**
   * creates an order and routes to receipt page in case of success
   */
  onCreateOrder(basket: Basket) {
    this.store.dispatch(new CreateOrder({ basket }));
  }
}
