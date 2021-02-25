import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';

// tslint:disable: no-any
@Component({
  selector: 'ish-formly-testing-container',
  templateUrl: './formly-testing-container.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormlyTestingContainerComponent {
  @ViewChild(FormlyForm) formlyForm: FormlyForm;

  set testComponentInputs(inputs: { fields: FormlyFieldConfig[]; form: FormGroup; model: any; options?: any }) {
    this.fields = inputs.fields;
    this.form = inputs.form;
    this.model = inputs.model;
    this.options = inputs.options ?? {};
  }

  fields: FormlyFieldConfig[];
  form: FormGroup;
  model: any;
  options: any;
}
