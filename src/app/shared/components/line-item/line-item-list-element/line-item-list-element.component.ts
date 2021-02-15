import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderLineItem } from 'ish-core/models/order/order.model';

@Component({
  selector: 'ish-line-item-list-element',
  templateUrl: './line-item-list-element.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemListElementComponent implements OnInit {
  @Input() pli: Partial<LineItemView & OrderLineItem>;
  @Input() editable = true;
  @Input() lineItemViewType?: 'simple' | 'availability';

  constructor(private context: ProductContextFacade, private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.context.hold(this.context.validDebouncedQuantityUpdate$(), quantity => {
      this.checkoutFacade.updateBasketItem({ itemId: this.pli.id, quantity });
    });
  }

  onUpdateItem(update: LineItemUpdate) {
    this.checkoutFacade.updateBasketItem(update);
  }

  onDeleteItem(itemId: string) {
    this.checkoutFacade.deleteBasketItem(itemId);
  }
}
