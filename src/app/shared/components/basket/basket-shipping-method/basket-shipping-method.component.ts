import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Requisition } from 'projects/requisition-management/src/app/models/requisition/requisition.model';

import { Basket } from 'ish-core/models/basket/basket.model';
import { Order } from 'ish-core/models/order/order.model';
import { DatePipe } from 'ish-core/pipes/date.pipe';

@Component({
  selector: 'ish-basket-shipping-method',
  templateUrl: './basket-shipping-method.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, TranslatePipe, DatePipe],
})
export class BasketShippingMethodComponent implements OnChanges {
  @Input({ required: true }) data: Basket | Order | Requisition;

  desiredDeliveryDate: string;

  ngOnChanges(): void {
    this.desiredDeliveryDate = this.data.attributes?.find(attr => attr.name === 'desiredDeliveryDate')?.value as string;
  }
}
