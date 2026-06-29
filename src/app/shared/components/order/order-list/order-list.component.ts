import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CdkTable,
} from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { Order } from 'ish-core/models/order/order.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

export type OrderColumnsType =
  | 'buyer'
  | 'creationDate'
  | 'destination'
  | 'lineItems'
  | 'lineItems'
  | 'orderNo'
  | 'orderNoWithLink'
  | 'orderTotal'
  | 'status';

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
  imports: [
    AddressComponent,
    CdkCell,
    CdkCellDef,
    CdkColumnDef,
    CdkHeaderCell,
    CdkHeaderCellDef,
    CdkHeaderRow,
    CdkHeaderRowDef,
    CdkRow,
    CdkRowDef,
    CdkTable,
    DatePipe,
    LoadingComponent,
    PricePipe,
    RouterLink,
    TranslatePipe,
  ],
  standalone: true,
  templateUrl: './order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
