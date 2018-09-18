import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Basket } from '../../../models/basket/basket.model';
import { CreateOrder, getBasketError, getBasketLoading, getCurrentBasket } from '../../store/basket';

@Component({
  selector: 'ish-checkout-review-page-container',
  templateUrl: './checkout-review-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReviewPageContainerComponent {
  basket$ = this.store.pipe(select(getCurrentBasket));
  basketError$ = this.store.pipe(select(getBasketError));
  loading$ = this.store.pipe(select(getBasketLoading));

  constructor(private store: Store<{}>) {}

  /**
   * creates an order and routes to receipt page in case of success
   */
  onCreateOrder(basket: Basket) {
    this.store.dispatch(new CreateOrder(basket));
  }
}
