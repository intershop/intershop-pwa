import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Requisition } from 'projects/requisition-management/src/app/models/requisition/requisition.model';

import { Basket } from 'ish-core/models/basket/basket.model';
import { Order } from 'ish-core/models/order/order.model';

@Component({
  selector: 'ish-basket-merchant-message-view',
  templateUrl: './basket-merchant-message-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketMerchantMessageViewComponent implements OnChanges {
  @Input() data: Basket | Order | Requisition;

  messageToMerchant: string;

  ngOnChanges(): void {
    this.messageToMerchant = this.data.attributes?.find(attr => attr.name === 'messageToMerchant')?.value as string;
  }
}
