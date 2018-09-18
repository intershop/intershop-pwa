import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Basket } from '../../../models/basket/basket.model';
import { HttpError } from '../../../models/http-error/http-error.model';
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
export class BasketPageContainerComponent implements OnInit {
  basket$: Observable<Basket>;
  basketLoading$: Observable<boolean>;
  basketError$: Observable<HttpError>;
  quoteRequestLoading$: Observable<boolean>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
    this.basketLoading$ = this.store.pipe(select(getBasketLoading));
    this.basketError$ = this.store.pipe(select(getBasketError));
    this.quoteRequestLoading$ = this.store.pipe(select(getQuoteRequestLoading));
  }

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
