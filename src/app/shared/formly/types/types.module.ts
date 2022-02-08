import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule as FormlyBaseModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { CaptchaExportsModule } from 'src/app/extensions/captcha/exports/captcha-exports.module';

import { DirectivesModule } from 'ish-core/directives.module';
import { SpecialValidators, formlyValidation } from 'ish-shared/forms/validators/special-validators';

import { CaptchaFieldComponent } from './captcha-field/captcha-field.component';
import { CheckboxFieldComponent } from './checkbox-field/checkbox-field.component';
import { FieldsetFieldComponent } from './fieldset-field/fieldset-field.component';
import { PlainTextFieldComponent } from './plain-text-field/plain-text-field.component';
import { RadioFieldComponent } from './radio-field/radio-field.component';
import { SelectFieldComponent } from './select-field/select-field.component';
import { TextInputFieldComponent } from './text-input-field/text-input-field.component';
import { TextareaFieldComponent } from './textarea-field/textarea-field.component';

const fieldComponents = [
  CaptchaFieldComponent,
  CheckboxFieldComponent,
  FieldsetFieldComponent,
  PlainTextFieldComponent,
  RadioFieldComponent,
  SelectFieldComponent,
  TextareaFieldComponent,
  TextInputFieldComponent,
];

@NgModule({
  imports: [
    CaptchaExportsModule,
    CommonModule,
    DirectivesModule,
    FormlySelectModule,
    ReactiveFormsModule,

    FormlyBaseModule.forChild({
      types: [
        {
          name: 'ish-text-input-field',
          component: TextInputFieldComponent,
          wrappers: ['form-field-horizontal', 'validation'],
        },
        {
          name: 'ish-plain-text-field',
          component: PlainTextFieldComponent,
          wrappers: ['form-field-horizontal'],
        },
        {
          name: 'ish-email-field',
          extends: 'ish-text-input-field',
          defaultOptions: {
            templateOptions: {
              type: 'email',
            },
            validators: {
              email: formlyValidation('email', SpecialValidators.email),
            },
            validation: {
              messages: {
                email: 'form.email.error.invalid',
                required: 'form.email.error.required',
              },
            },
          },
        },
        {
          name: 'ish-phone-field',
          extends: 'ish-text-input-field',
          defaultOptions: {
            templateOptions: {
              attributes: { maxlength: 20 },
              type: 'tel',
            },
            validators: {
              phone: formlyValidation('phone', SpecialValidators.phone),
            },
            validation: {
              messages: {
                phone: 'form.phone.error.invalid',
                required: 'form.phone.error.required',
              },
            },
          },
        },
        {
          name: 'ish-password-field',
          extends: 'ish-text-input-field',
          defaultOptions: {
            templateOptions: {
              type: 'password',
            },
            validators: {
              password: formlyValidation('password', SpecialValidators.password),
            },
            validation: {
              messages: {
                password: 'form.password.error.invalid',
                required: 'form.password.error.required',
                equalTo: 'form.password.error.equalTo',
              },
            },
          },
        },
        {
          name: 'ish-select-field',
          component: SelectFieldComponent,
          wrappers: ['form-field-horizontal', 'validation'],
        },
        {
          name: 'ish-textarea-field',
          component: TextareaFieldComponent,
          wrappers: ['form-field-horizontal', 'textarea-description', 'validation'],
        },
        {
          name: 'ish-checkbox-field',
          component: CheckboxFieldComponent,
          wrappers: ['form-field-checkbox-horizontal'],
        },
        { name: 'ish-captcha-field', component: CaptchaFieldComponent },
        {
          name: 'ish-fieldset-field',
          component: FieldsetFieldComponent,
        },
        {
          name: 'ish-radio-field',
          component: RadioFieldComponent,
          wrappers: ['form-field-checkbox-horizontal'],
        },
      ],
    }),
  ],
  declarations: [...fieldComponents],
  exports: [...fieldComponents],
})
export class TypesModule {}
