import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Order } from 'ish-core/models/order/order.model';

@Component({
  selector: 'ish-checkout-receipt-order',
  templateUrl: './checkout-receipt-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReceiptOrderComponent implements OnInit {
  @Input() order: Order;
  constructor() {}
  ngOnInit(): void {
    console.log(`Doesnt Work`);
  }
}
