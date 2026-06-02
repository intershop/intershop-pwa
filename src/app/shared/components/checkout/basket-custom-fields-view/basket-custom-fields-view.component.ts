import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Requisition } from 'projects/requisition-management/src/app/models/requisition/requisition.model';
import { Observable, ReplaySubject, combineLatest, map } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { CustomFields, CustomFieldsComponentInput } from 'ish-core/models/custom-field/custom-field.model';
import { Order } from 'ish-core/models/order/order.model';
import { RecurringOrder } from 'ish-core/models/recurring-order/recurring-order.model';
import { CustomFieldsViewComponent } from 'ish-shared/components/custom-fields/custom-fields-view/custom-fields-view.component';

/**
 * Component for displaying the custom fields of the basket/order. It is intended to be used in the additional information widget on checkout/order pages.
 */
@Component({
  selector: 'ish-basket-custom-fields-view',
  templateUrl: './basket-custom-fields-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, CustomFieldsViewComponent],
})
export class BasketCustomFieldsViewComponent implements OnInit {
  @Input({ required: true }) set data(val: Basket | Order | RecurringOrder | Requisition | undefined) {
    this.customFields$.next(val?.customFields || {});
  }

  private customFields$ = new ReplaySubject<CustomFields>(1);
  fields$: Observable<CustomFieldsComponentInput[]>;
  visible$: Observable<boolean>;

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
