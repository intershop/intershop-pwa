import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Order } from 'ish-core/models/order/order.model';

/**
 * The Order Page Component displays the details of an order.
 *
 * @example
 * <ish-order-page [order]="order" />
 */
@Component({
  selector: 'ish-account-order',
  templateUrl: './account-order.component.html',
  styleUrl: './account-order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderComponent {
  @Input({ required: true }) order: Order;

  hasCustomFields(): boolean {
    return this.order?.customFields && Object.keys(this.order.customFields).length > 0;
  }
}
