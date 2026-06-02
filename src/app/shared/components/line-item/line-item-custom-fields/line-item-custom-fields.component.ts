import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { combineLatest, map } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CustomFields, CustomFieldsComponentInput } from 'ish-core/models/custom-field/custom-field.model';
import { CustomFieldsViewComponent } from 'ish-shared/components/custom-fields/custom-fields-view/custom-fields-view.component';

/**
 * The Line Item Custom Fields Component displays the custom fields of a line item.
 */
@Component({
  selector: 'ish-line-item-custom-fields',
  templateUrl: './line-item-custom-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, CustomFieldsViewComponent],
})
export class LineItemCustomFieldsComponent
  extends RxState<{
    fields: CustomFieldsComponentInput[];
    customFields: CustomFields;
    editable: boolean;
  }>
  implements OnInit
{
  @Input({ required: true }) set lineItem(val: { customFields?: CustomFields } | undefined) {
    this.set('customFields', () => val?.customFields || {});
  }
  @Input() set editable(val: boolean) {
    this.set('editable', () => val);
  }

  constructor(private checkoutFacade: CheckoutFacade) {
    super();
  }

  ngOnInit(): void {
    this.connect(
      'fields',
      combineLatest([this.select('customFields'), this.checkoutFacade.customFieldsForScope$('BasketLineItem')]).pipe(
        map(([customFields, definitions]) =>
          definitions.map(({ name, editable }) => ({
            name,
            editable,
            value: customFields[name],
          }))
        )
      )
    );
  }
}
