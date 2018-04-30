import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Basket } from '../../../models/basket/basket.model';
import { DeleteBasketItem, getBasketLoading, getCurrentBasket, UpdateBasketItems } from '../../store/basket';
import { CheckoutState } from '../../store/checkout.state';

@Component({
  selector: 'ish-basket-page-container',
  templateUrl: './basket-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketPageContainerComponent implements OnInit {
  basket$: Observable<Basket>;
  basketLoading$: Observable<boolean>;

  constructor(private store: Store<CheckoutState>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
    this.basketLoading$ = this.store.pipe(select(getBasketLoading));
  }

  deleteBasketItem(itemId: string) {
    this.store.dispatch(new DeleteBasketItem(itemId));
  }

  updateBasketQuantities(formValue: { itemId: string; quantity: number }[]) {
    this.store.dispatch(new UpdateBasketItems(formValue));
  }
}
