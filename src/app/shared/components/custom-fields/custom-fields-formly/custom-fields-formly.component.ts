import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { Observable, combineLatest, map, switchMap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CustomFields, CustomFieldsComponentInput } from 'ish-core/models/custom-field/custom-field.model';

interface ComponentState {
  form: UntypedFormGroup;
  customFields: CustomFieldsComponentInput[];
  fields: FormlyFieldConfig[];
  model: CustomFields;
}

@Component({
  selector: 'ish-custom-fields-formly',
  templateUrl: './custom-fields-formly.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFieldsFormlyComponent extends RxState<ComponentState> implements OnInit {
  @Input() set form(form: ComponentState['form']) {
    this.set({ form });
  }
  @Input() set fields(customFields: ComponentState['customFields']) {
    this.set({ customFields });
  }
  @Input() labelClass: string;
  @Input() fieldClass: string;

  fields$: Observable<ComponentState['fields']>;
  model$: Observable<ComponentState['model']>;
  form$: Observable<ComponentState['form']>;

  constructor(private appFacade: AppFacade) {
    super();
  }

  ngOnInit(): void {
    this.form$ = this.select('form');

    this.connect(
      'fields',
      this.select('customFields').pipe(
        switchMap(fields =>
          combineLatest(
            fields.map(field =>
              this.appFacade.customField$(field.name).pipe(
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

    this.connect(
      'model',
      this.select('customFields').pipe(
        map(fields => fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {}))
      )
    );
    this.model$ = this.select('model');
  }
}
