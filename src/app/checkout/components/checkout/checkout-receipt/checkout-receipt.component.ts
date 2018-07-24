import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Order } from '../../../../models/order/order.model';
import { User } from '../../../../models/user/user.model';

@Component({
  selector: 'ish-checkout-receipt',
  templateUrl: './checkout-receipt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReceiptComponent {
  @Input() order: Order;
  @Input() user: User;
}
