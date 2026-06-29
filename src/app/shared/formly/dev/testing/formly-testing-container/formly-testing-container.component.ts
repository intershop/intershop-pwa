import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

/* eslint-disable @typescript-eslint/no-explicit-any */
@Component({
  selector: 'ish-formly-testing-container',
  imports: [FormlyModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './formly-testing-container.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormlyTestingContainerComponent {
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
