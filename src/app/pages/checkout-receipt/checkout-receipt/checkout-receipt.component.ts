import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Basket } from 'ish-core/models/basket/basket.model';
import { Order } from 'ish-core/models/order/order.model';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';

@Component({
  selector: 'ish-checkout-receipt',
  templateUrl: './checkout-receipt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReceiptComponent {
  @Input({ required: true }) order: Basket | Order | RecurringOrder;

  hasCustomFields(): boolean {
    return this.order?.customFields && Object.keys(this.order.customFields).length > 0;
  }
}
