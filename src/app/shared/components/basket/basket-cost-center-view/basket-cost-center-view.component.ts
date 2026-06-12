import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Basket } from 'ish-core/models/basket/basket.model';
import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { Order } from 'ish-core/models/order/order.model';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';

/**
 * The Basket Cost Center View Component displays the cost center related information for a basket/order or recurring order
 *
 */
@Component({
  selector: 'ish-basket-cost-center-view',
  templateUrl: './basket-cost-center-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketCostCenterViewComponent {
  @Input({ required: true }) set data(val: Basket | Order | RecurringOrder) {
    this.costCenter = val?.costCenter
      ? {
          costCenterId: val.costCenter,
          name:
            AttributeHelper.getAttributeValueByAttributeName<string>(
              val.attributes,
              'BusinessObjectAttributes#Order_CostCenter_Name'
            ) || // fallback for RecurringOrder
            (val as RecurringOrder).costCenterName,
        }
      : undefined;
  }

  costCenter: Partial<CostCenter>;
}
