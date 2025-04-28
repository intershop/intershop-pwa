import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { combineLatest, map } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CustomFields, CustomFieldsComponentInput } from 'ish-core/models/custom-field/custom-field.model';

@Component({
  selector: 'ish-line-item-custom-fields',
  templateUrl: './line-item-custom-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemCustomFieldsComponent
  extends RxState<{
    fields: CustomFieldsComponentInput[];
    customFields: CustomFields;
    editable: boolean;
  }>
  implements OnInit
{
  @Input() set lineItem(val: { customFields?: CustomFields }) {
    this.set('customFields', () => val.customFields || {});
  }
  @Input() set editable(val: boolean) {
    this.set('editable', () => val);
  }

  constructor(private appFacade: AppFacade) {
    super();
  }

  ngOnInit(): void {
    this.connect(
      'fields',
      combineLatest([this.select('customFields'), this.appFacade.customFieldsForScope$('BasketLineItem')]).pipe(
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
