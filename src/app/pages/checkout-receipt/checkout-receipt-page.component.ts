import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CheckoutReceiptRequisitionComponent } from 'requisition-management';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Order } from 'ish-core/models/order/order.model';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CheckoutReceiptOrderComponent } from './checkout-receipt-order/checkout-receipt-order.component';
import { CheckoutReceiptComponent } from './checkout-receipt/checkout-receipt.component';

@Component({
  selector: 'ish-checkout-receipt-page',
  templateUrl: './checkout-receipt-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    CheckoutReceiptComponent,
    LoadingComponent,
    CheckoutReceiptOrderComponent,
    CheckoutReceiptRequisitionComponent,
  ],
})
export class CheckoutReceiptPageComponent implements OnInit {
  order$: Observable<Order | RecurringOrder>;
  loading$: Observable<boolean>;
  submittedBasket$: Observable<Basket>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.order$ = this.checkoutFacade.submittedOrder$;
    this.loading$ = this.checkoutFacade.basketLoading$;
    this.submittedBasket$ = this.checkoutFacade.submittedBasket$;
  }
}
