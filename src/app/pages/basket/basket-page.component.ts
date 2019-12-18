import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';

@Component({
  selector: 'ish-basket-page',
  templateUrl: './basket-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketPageComponent implements OnInit {
  basket$: Observable<BasketView>;
  basketLoading$: Observable<boolean>;
  basketError$: Observable<HttpError>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.basketLoading$ = this.checkoutFacade.basketLoading$;
    this.basketError$ = this.checkoutFacade.basketError$;
  }

  deleteBasketItem(itemId: string) {
    this.checkoutFacade.deleteBasketItem(itemId);
  }

  updateBasketItem(formValue: LineItemUpdate) {
    this.checkoutFacade.updateBasketItem(formValue);
  }

  nextStep() {
    this.checkoutFacade.continue(1);
  }
}
