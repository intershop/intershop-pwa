import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FormlyForm, FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';

// tslint:disable: project-structure

@Component({ template: 'CaptchaFieldComponent: {{ to | json }}' })
class CaptchaFieldComponent extends FieldType {}

@Component({ template: 'CheckboxFieldComponent: {{ to | json }}' })
class CheckboxFieldComponent extends FieldType {}

@Component({ template: 'FieldsetFieldComponent: {{ to | json }}' })
class FieldsetFieldComponent extends FieldType {}

@Component({ template: 'TextInputFieldComponent: {{ to | json }}' })
class TextInputFieldComponent extends FieldType {}

@Component({ template: 'EmailFieldComponent: {{ to | json }}' })
class EmailFieldComponent extends FieldType {}

@Component({ template: 'PasswordFieldComponent: {{ to | json }}' })
class PasswordFieldComponent extends FieldType {}

@Component({ template: 'SelectFieldComponent: {{ to | json }}' })
class SelectFieldComponent extends FieldType {}

@Component({ template: 'TextareaFieldComponent: {{ to | json }}' })
class TextareaFieldComponent extends FieldType {}

// tslint:enable: project-structure

@NgModule({
  declarations: [
    CaptchaFieldComponent,
    CheckboxFieldComponent,
    EmailFieldComponent,
    FieldsetFieldComponent,
    PasswordFieldComponent,
    SelectFieldComponent,
    TextInputFieldComponent,
    TextareaFieldComponent,
  ],
  imports: [
    CommonModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'ish-text-input-field',
          component: TextInputFieldComponent,
        },
        {
          name: 'ish-fieldset-field',
          component: FieldsetFieldComponent,
        },
        {
          name: 'ish-checkbox-field',
          component: CheckboxFieldComponent,
        },
        {
          name: 'ish-email-field',
          component: EmailFieldComponent,
        },
        {
          name: 'ish-password-field',
          component: PasswordFieldComponent,
        },
        {
          name: 'ish-select-field',
          component: SelectFieldComponent,
        },
        {
          name: 'ish-textarea-field',
          component: TextareaFieldComponent,
        },
        { name: 'ish-captcha-field', component: CaptchaFieldComponent },
      ],
    }),
    FormlySelectModule,
    ReactiveFormsModule,
  ],
  exports: [FormlyForm, ReactiveFormsModule],
  providers: [],
})
// tslint:disable-next-line: project-structure
export class FormlyTestingModule {}
