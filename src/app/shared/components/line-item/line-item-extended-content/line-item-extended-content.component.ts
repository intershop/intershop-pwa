import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderLineItem } from 'ish-core/models/order/order.model';

/**
 * The Extended Line Item Component displays additional line items attributes like partialOrderNo
 * and customerProductID. ALso editing of this attributes are possible with this component.
 */

@Component({
  selector: 'ish-line-item-extended-content',
  templateUrl: './line-item-extended-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemExtendedContentComponent {
  @Input() lineItem: Partial<LineItemView & OrderLineItem>;
  @Input() editable: boolean;

  keys = ['partialOrderNo', 'customerProductID'] as const;

  constructor(private checkoutFacade: CheckoutFacade) {}

  update(key: LineItemExtendedContentComponent['keys'][number], value: string) {
    this.checkoutFacade.updateBasketItem({
      itemId: this.lineItem.id,
      quantity: this.lineItem.quantity.value,
      [key]: value,
    });
  }
}
