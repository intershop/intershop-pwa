import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { LineItemQuantity } from '../../../models/line-item-quantity/line-item-quantity.model';
import { AddBasketToQuoteRequest, getQuoteRequestLoading } from '../../../quoting/store/quote-request';
import {
  DeleteBasketItem,
  UpdateBasketItems,
  getBasketError,
  getBasketLoading,
  getCurrentBasket,
} from '../../store/basket';

@Component({
  selector: 'ish-basket-page-container',
  templateUrl: './basket-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketPageContainerComponent {
  basket$ = this.store.pipe(select(getCurrentBasket));
  basketLoading$ = this.store.pipe(select(getBasketLoading));
  basketError$ = this.store.pipe(select(getBasketError));
  quoteRequestLoading$ = this.store.pipe(select(getQuoteRequestLoading));

  constructor(private store: Store<{}>) {}

  deleteBasketItem(itemId: string) {
    this.store.dispatch(new DeleteBasketItem(itemId));
  }

  updateBasketItem(formValue: LineItemQuantity) {
    this.store.dispatch(new UpdateBasketItems([formValue]));
  }

  addBasketToQuote() {
    this.store.dispatch(new AddBasketToQuoteRequest());
  }
}
