import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { Observable, combineLatest, map, switchMap } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CustomFields, CustomFieldsComponentInput } from 'ish-core/models/custom-field/custom-field.model';

interface ComponentState {
  form: FormGroup;
  customFields: CustomFieldsComponentInput[];
  fields: FormlyFieldConfig[];
  model: CustomFields;
}

/**
 * The Custom Fields Formly Component displays the custom fields form using RxState functionality.
 */
@Component({
  selector: 'ish-custom-fields-formly',
  templateUrl: './custom-fields-formly.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFieldsFormlyComponent extends RxState<ComponentState> implements OnInit, OnChanges {
  @Input({ required: true }) set form(form: ComponentState['form']) {
    this.set({ form });
  }
  @Input({ required: true }) set fields(customFields: ComponentState['customFields']) {
    this.set({ customFields });
  }
  @Input() labelClass: string;
  @Input() fieldClass: string;

  fields$: Observable<ComponentState['fields']>;
  model$: Observable<ComponentState['model']>;
  form$: Observable<ComponentState['form']>;

  constructor(private checkoutFacade: CheckoutFacade) {
    super();
  }

  ngOnChanges(s: SimpleChanges): void {
    // reset model if the user has cancelled the form
    if (s.form?.currentValue && !s.form.firstChange) {
      this.setModel();
    }
  }

  ngOnInit(): void {
    this.form$ = this.select('form');

    this.connect(
      'fields',
      this.select('customFields').pipe(
        switchMap(fields =>
          combineLatest(
            fields.map(field =>
              this.checkoutFacade.customField$(field.name).pipe(
                map(definition => ({
                  key: field.name,
                  type: 'ish-text-input-field',
                  templateOptions: {
                    label: definition.displayName,
                    labelClass: this.labelClass,
                    fieldClass: this.fieldClass,
                  },
                }))
              )
            )
          )
        )
      )
    );
    this.fields$ = this.select('fields');

    this.setModel();
  }

  private setModel() {
    this.connect(
      'model',
      this.select('customFields').pipe(
        map(fields => fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {}))
      )
    );
    this.model$ = this.select('model');
  }
}
