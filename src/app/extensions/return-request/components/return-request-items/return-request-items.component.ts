import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { ReturnRequest } from '../../models/return-request/return-request.model';

@Component({
  selector: 'ish-return-request-items',
  templateUrl: './return-request-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnRequestItemsComponent implements OnInit {
  @Input() orders: ReturnRequest[] = [];

  groupOrders: { [key: string]: ReturnRequest[] };

  orderIds: string[];

  ngOnInit() {
    this.groupOrders = this.orders.reduce<{ [key: string]: ReturnRequest[] }>((acc, nxt) => {
      acc[nxt.orderId] = acc[nxt.orderId] ? [...acc[nxt.orderId], nxt] : [nxt];
      return acc;
    }, {});

    this.orderIds = Object.keys(this.groupOrders);
  }
}
