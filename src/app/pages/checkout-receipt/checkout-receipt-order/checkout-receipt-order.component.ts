import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatomoTracker } from '@ngx-matomo/tracker';

import { Order } from 'ish-core/models/order/order.model';

@Component({
  selector: 'ish-checkout-receipt-order',
  templateUrl: './checkout-receipt-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReceiptOrderComponent implements OnInit {
  @Input() order: Order;
  constructor(private readonly tracker: MatomoTracker) {}
  ngOnInit(): void {
    this.tracker.trackEcommerceOrder(this.order.id, this.order.totals.total.gross);
    this.tracker.trackPageView();
    console.log(`Tracking order with id ${this.order.id} and total amount of ${this.order.totals.total.gross}`);
  }
}
