import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Basket } from '../../../models/basket/basket.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { CreateOrder, getBasketError, getBasketLoading, getCurrentBasket } from '../../store/basket';
import { CheckoutState } from '../../store/checkout.state';

@Component({
  selector: 'ish-checkout-review-page-container',
  templateUrl: './checkout-review-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReviewPageContainerComponent implements OnInit {
  basket$: Observable<Basket>;
  basketError$: Observable<HttpError>;
  loading$: Observable<boolean>;

  constructor(private store: Store<CheckoutState>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
    this.loading$ = this.store.pipe(select(getBasketLoading));
    this.basketError$ = this.store.pipe(select(getBasketError));
  }

  /**
   * creates an order and routes to receipt page in case of success
   */
  onCreateOrder(basket: Basket) {
    this.store.dispatch(new CreateOrder(basket));
  }
}
