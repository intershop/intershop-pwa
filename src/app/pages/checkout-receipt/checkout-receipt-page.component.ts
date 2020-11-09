import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Order } from 'ish-core/models/order/order.model';

@Component({
  selector: 'ish-checkout-receipt-page',
  templateUrl: './checkout-receipt-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReceiptPageComponent implements OnInit {
  order$: Observable<Order>;
  loading$: Observable<boolean>;
  submittedBasket$: Observable<Basket>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.order$ = this.checkoutFacade.selectedOrder$;
    this.loading$ = this.checkoutFacade.basketLoading$;
    this.submittedBasket$ = this.checkoutFacade.submittedBasket$;
  }
}
