import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OrderView } from '../../../models/order/order.model';

@Component({
  selector: 'ish-order-list',
  templateUrl: './order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent {
  @Input()
  orders: OrderView[];

  @Input()
  maxListItems = 30; // count of displayed items, 0 = all items

  @Input()
  compact = false; // indicates a compact view (single row) of the list
}
