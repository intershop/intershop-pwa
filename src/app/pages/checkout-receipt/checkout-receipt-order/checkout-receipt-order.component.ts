import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Order } from 'ish-core/models/order/order.model';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';

@Component({
  selector: 'ish-checkout-receipt-order',
  templateUrl: './checkout-receipt-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReceiptOrderComponent {
  @Input({ required: true }) order: Order | RecurringOrder;
}
