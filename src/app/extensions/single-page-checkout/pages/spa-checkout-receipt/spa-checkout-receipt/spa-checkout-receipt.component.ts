import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Order } from 'ish-core/models/order/order.model';
import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'ish-spa-checkout-receipt',
  templateUrl: './spa-checkout-receipt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpaCheckoutReceiptComponent {
  @Input() order: Order;
  @Input() user: User;
}
