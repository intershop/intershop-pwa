import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormlyModule as FormlyBaseModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CaptchaExportsModule } from 'src/app/extensions/captcha/exports/captcha-exports.module';

import { DirectivesModule } from 'ish-core/directives.module';
import { IconModule } from 'ish-core/icon.module';
import { SpecialValidators, formlyValidation } from 'ish-shared/forms/validators/special-validators';

import { CaptchaFieldComponent } from './captcha-field/captcha-field.component';
import { CheckboxFieldComponent } from './checkbox-field/checkbox-field.component';
import { DatePickerFieldComponent } from './date-picker-field/date-picker-field.component';
import { IshDatepickerI18n } from './date-picker-field/ish-datepicker-i18n';
import { LocalizedParserFormatter } from './date-picker-field/localized-parser-formatter';
import { DateRangePickerFieldComponent } from './date-range-picker-field/date-range-picker-field.component';
import { FieldsetFieldComponent } from './fieldset-field/fieldset-field.component';
import { HtmlTextFieldComponent } from './html-text-field/html-text-field.component';
import { PasswordFieldComponent } from './password-field/password-field.component';
import { PlainTextFieldComponent } from './plain-text-field/plain-text-field.component';
import { RadioFieldComponent } from './radio-field/radio-field.component';
import { SelectFieldComponent } from './select-field/select-field.component';
import { TextInputFieldComponent } from './text-input-field/text-input-field.component';
import { TextareaFieldComponent } from './textarea-field/textarea-field.component';

const fieldComponents = [
  CaptchaFieldComponent,
  CheckboxFieldComponent,
  DatePickerFieldComponent,
  DateRangePickerFieldComponent,
  FieldsetFieldComponent,
  HtmlTextFieldComponent,
  PasswordFieldComponent,
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
    IconModule,
    NgbDatepickerModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ReactiveFormsModule,
    TranslateModule,

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
          name: 'ish-html-text-field',
          component: HtmlTextFieldComponent,
          wrappers: ['form-field-horizontal'],
        },
        {
          name: 'ish-email-field',
          extends: 'ish-text-input-field',
          defaultOptions: {
            props: {
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
            props: {
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
          component: PasswordFieldComponent,
          wrappers: ['form-field-horizontal', 'validation'],
          defaultOptions: {
            validation: {
              messages: {
                password: 'form.password.error.invalid',
                required: 'form.password.error.required',
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
          wrappers: ['form-field-horizontal', 'maxlength-description', 'validation'],
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
        {
          name: 'ish-date-picker-field',
          component: DatePickerFieldComponent,
          wrappers: ['form-field-horizontal', 'validation'],
        },
        {
          name: 'ish-date-range-picker-field',
          component: DateRangePickerFieldComponent,
          wrappers: ['form-field-horizontal', 'validation'],
        },
      ],
    }),
  ],
  providers: [
    provideNgxMask(),
    { provide: NgbDateParserFormatter, useClass: LocalizedParserFormatter, deps: [TranslateService] },
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDatepickerI18n, useClass: IshDatepickerI18n },
  ],
  declarations: [...fieldComponents],
  exports: [...fieldComponents],
})
export class TypesModule {}
