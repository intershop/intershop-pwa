/* eslint-disable unicorn/no-null */
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { PunchoutFacade } from '../../../facades/punchout.facade';
import { CxmlConfiguration } from '../../../models/cxml-configuration/cxml-configuration.model';

@Component({
  selector: 'ish-cxml-configuration-form',
  templateUrl: './cxml-configuration-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CxmlConfigurationFormComponent implements OnDestroy, OnInit {
  @Input({ required: true }) cxmlConfiguration: CxmlConfiguration[];

  form: FormGroup = new FormGroup({});
  model: { [key: string]: string };
  fields: FormlyFieldConfig[];

  private submitted = false;
  cxmlConfigurationError$: Observable<HttpError>;

  constructor(private punchoutFacade: PunchoutFacade) {}

  ngOnInit() {
    this.cxmlConfigurationError$ = this.punchoutFacade.cxmlConfigurationError$;
    this.fields = this.getFields();
    this.model = this.getModel();
  }

  ngOnDestroy(): void {
    this.resetConfiguration();
  }

  private getFields() {
    return this.cxmlConfiguration.map(cxmlConfig => ({
      fieldGroupClassName: 'row list-item-row mb-0',
      fieldGroup: [
        {
          key: cxmlConfig.name.replaceAll('.', ':'),
          type: cxmlConfig.inputType === 'text-long' ? 'ish-textarea-field' : 'ish-text-input-field',
          wrappers: ['cxml-help-text', 'form-field-horizontal', 'description'],
          className: 'list-item col-md-12',
          props: {
            rows: 3,
            label: cxmlConfig.name,
            labelNoTranslate: true,
            placeholder: cxmlConfig.defaultValue,
            helpText: cxmlConfig.description,
            customDescription: {
              key: 'account.punchout.cxml.configuration.default.description',
              args: { defaultValue: cxmlConfig.defaultValue },
            },
            fieldClass: 'col-sm-7 pl-md-0',
            labelClass: 'col-sm-5 mr-sm-0 pl-5',
          },
        },
      ],
    }));
  }

  private getModel() {
    return this.cxmlConfiguration.reduce(
      (acc, config) => ({
        ...acc,
        [config.name.replaceAll('.', ':')]: config.value === config.defaultValue ? null : config.value,
      }),
      {}
    );
  }

  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      focusFirstInvalidField(this.form);
      return;
    }

    const updateData = Object.entries(this.form.value).map(([name, value]) => ({
      name: name.replaceAll(':', '.'),
      value: value ? value : null,
    }));

    this.updateConfiguration(updateData as CxmlConfiguration[]);
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }

  private updateConfiguration(cxmlConfig: CxmlConfiguration[]) {
    this.punchoutFacade.updateCxmlConfiguration(cxmlConfig);
  }

  private resetConfiguration() {
    this.punchoutFacade.resetCxmlConfiguration();
  }
}
