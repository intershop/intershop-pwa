import { CdkTableModule } from '@angular/cdk/table';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from 'ish-core/icon.module';

import { Order } from 'ish-core/models/order/order.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

export type OrderColumnsType =
  | 'creationDate'
  | 'orderNo'
  | 'orderNoWithLink'
  | 'buyer'
  | 'lineItems'
  | 'status'
  | 'destination'
  | 'lineItems'
  | 'orderTotal';

/**
 * The Order List Component displays the orders provided as input parameter.
 *
 * @example
 * <ish-order-list
 *   [columnsToDisplay]="['creationDate', 'orderNoWithLink', 'lineItems', 'status', 'orderTotal']"
 *   [loading]="loading$ | async"
 *   [orders]="orders$ | async"
 * />
 */
@Component({
  selector: 'ish-order-list',
  templateUrl: './order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    IconModule,
    TranslateModule,
    RouterLink,
    PricePipe,
    LoadingComponent,
    AddressComponent,
    DatePipe,
    CdkTableModule,
  ],
})
export class OrderListComponent {
  /**
   * The columns to be displayed.
   */
  @Input({ required: true }) columnsToDisplay: OrderColumnsType[];

  /**
   * The orders to be displayed.
   */
  @Input({ required: true }) orders: Partial<Order>[];

  @Input() noOrdersMessageKey = 'account.orderlist.no_orders_message';

  @Input() loading: boolean;
}
