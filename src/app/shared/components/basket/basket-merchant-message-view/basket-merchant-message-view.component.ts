import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Requisition } from 'projects/requisition-management/src/app/models/requisition/requisition.model';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Order } from 'ish-core/models/order/order.model';

/**
 * The Basket Merchant Message View Component displays the message to merchant on related pages like basket review, order details and requisition details page.
 *
 */
@Component({
  selector: 'ish-basket-merchant-message-view',
  templateUrl: './basket-merchant-message-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketMerchantMessageViewComponent implements OnChanges {
  @Input({ required: true }) data: Basket | Order | Requisition;
  @Input() editRouterLink: string;

  messageToMerchant: string;

  ngOnChanges(): void {
    this.messageToMerchant =
      this.data.messageToMerchant ||
      (AttributeHelper.getAttributeValueByAttributeName(
        this.data.attributes,
        'BusinessObjectAttributes#Order_MessageToMerchant'
      ) as string);
  }
}
