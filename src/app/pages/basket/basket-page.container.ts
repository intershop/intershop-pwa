import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { LineItemQuantity } from 'ish-core/models/line-item-quantity/line-item-quantity.model';
import {
  DeleteBasketItem,
  UpdateBasketItems,
  getBasketError,
  getBasketLoading,
  getCurrentBasket,
} from 'ish-core/store/checkout/basket';

@Component({
  selector: 'ish-basket-page-container',
  templateUrl: './basket-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketPageContainerComponent {
  basket$ = this.store.pipe(select(getCurrentBasket));
  basketLoading$ = this.store.pipe(select(getBasketLoading));
  basketError$ = this.store.pipe(select(getBasketError));

  constructor(private store: Store<{}>) {}

  deleteBasketItem(itemId: string) {
    this.store.dispatch(new DeleteBasketItem({ itemId }));
  }

  updateBasketItem(formValue: LineItemQuantity) {
    this.store.dispatch(new UpdateBasketItems({ lineItemQuantities: [formValue] }));
  }
}
