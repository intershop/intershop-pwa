import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, ReplaySubject, combineLatest, map } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Basket } from 'ish-core/models/basket/basket.model';
import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { CustomFields, CustomFieldsComponentInput } from 'ish-core/models/custom-field/custom-field.model';
import { Order } from 'ish-core/models/order/order.model';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';

/**
 * Component for displaying the custom fields of the basket/order. It is intended to be used in the additional information widget on checkout/order pages.
 */
@Component({
  selector: 'ish-basket-custom-fields-view',
  templateUrl: './basket-custom-fields-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketCustomFieldsViewComponent implements OnInit {
  @Input({ required: true }) set data(val: Basket | Order | RecurringOrder) {
    this.customFields$.next(val.customFields || {});
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

  private customFields$ = new ReplaySubject<CustomFields>(1);
  fields$: Observable<CustomFieldsComponentInput[]>;
  visible$: Observable<boolean>;

  costCenter: Partial<CostCenter>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit(): void {
    this.fields$ = combineLatest([
      this.customFields$.asObservable(),
      this.checkoutFacade.customFieldsForScope$('Basket'),
    ]).pipe(
      map(([customFields, customFieldsForScope]) =>
        customFieldsForScope.map(({ name, editable }) => ({ name, value: customFields[name], editable }))
      )
    );

    this.visible$ = this.fields$.pipe(map(fields => fields.some(field => field.value)));
  }
}
