import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderLineItem } from 'ish-core/models/order/order.model';
import { Price } from 'ish-core/models/price/price.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { PagingComponent } from 'ish-shared/components/common/paging/paging.component';
import { LineItemListElementComponent } from 'ish-shared/components/line-item/line-item-list-element/line-item-list-element.component';

/**
 * The Line Item List Component displays line items of orders and baskets.
 * It provides optional delete and edit functionality
 * It provides optional lineItemView (string 'simple')
 * It provides optional total cost output
 *
 * @example
 * <ish-line-item-list
 *   lineItemViewType="simple"  // simple = no edit-button, inventory, shipment
 *   [editable]="editable"
 *   [lineItems]="lineItems"
 *   [total]="total"
 * />
 */
@Component({
  selector: 'ish-line-item-list',
  templateUrl: './line-item-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TranslatePipe,
    PricePipe,
    NgIf,
    LineItemListElementComponent,
    ProductContextDirective,
    PagingComponent,
    NgForOf,
  ],
})
export class LineItemListComponent implements OnChanges {
  @Input({ required: true }) lineItems: Partial<LineItemView & OrderLineItem>[];
  @Input() editable = true;
  @Input() total: Price;
  @Input() lineItemViewType: 'simple' | 'availability';
  /**
   * If pageSize > 0 only <pageSize> items are shown at once and a paging bar is shown below the line item list.
   */
  @Input() pageSize = 25;

  currentPage = 1;
  lastPage: number;
  displayItems: Partial<LineItemView & OrderLineItem>[] = [];

  ngOnChanges(c: SimpleChanges) {
    if (c.lineItems) {
      this.lastPage = Math.ceil(this.lineItems?.length / this.pageSize);
      this.goToPage(this.currentPage);
    }
  }

  get showPagingBar() {
    return this.pageSize && this.lineItems?.length > this.pageSize;
  }

  /**
   * Refresh items to display after changing the current page
   *
   * @param page current page
   */
  goToPage(page: number) {
    this.currentPage = page;

    this.displayItems = this.pageSize
      ? this.lineItems.slice((page - 1) * this.pageSize, page * this.pageSize)
      : this.lineItems;
  }
}
