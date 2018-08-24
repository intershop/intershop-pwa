import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OrderView } from '../../../models/order/order.model';

@Component({
  selector: 'ish-order-history-page',
  templateUrl: './order-history-page.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class OrderHistoryPageComponent {
  @Input()
  orders: OrderView[];
}
