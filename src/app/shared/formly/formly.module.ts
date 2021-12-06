import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FORMLY_CONFIG, FormlyConfig, FormlyModule as FormlyBaseModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DirectivesModule } from 'ish-core/directives.module';
import { IconModule } from 'ish-core/icon.module';
import { SpecialValidators, formlyValidation } from 'ish-shared/forms/validators/special-validators';

import { CaptchaExportsModule } from '../../extensions/captcha/exports/captcha-exports.module';

import { FieldTooltipComponent } from './components/field-tooltip/field-tooltip.component';
import { ValidationIconsComponent } from './components/validation-icons/validation-icons.component';
import { ValidationMessageComponent } from './components/validation-message/validation-message.component';
import { hideIfEmptyOptionsExtension } from './extensions/hide-if-empty-options.extension';
import { registerPostWrappersExtension } from './extensions/post-wrappers-extension';
import { registerTranslatePlaceholderExtension } from './extensions/translate-placeholder.extension';
import { registerTranslateSelectOptionsExtension } from './extensions/translate-select-options.extension';
import { CaptchaFieldComponent } from './types/captcha-field/captcha-field.component';
import { CheckboxFieldComponent } from './types/checkbox-field/checkbox-field.component';
import { FieldsetFieldComponent } from './types/fieldset-field/fieldset-field.component';
import { PlainTextFieldComponent } from './types/plain-text-field/plain-text-field.component';
import { RadioFieldComponent } from './types/radio-field/radio-field.component';
import { SelectFieldComponent } from './types/select-field/select-field.component';
import { TextInputFieldComponent } from './types/text-input-field/text-input-field.component';
import { TextareaFieldComponent } from './types/textarea-field/textarea-field.component';
import { DescriptionWrapperComponent } from './wrappers/description-wrapper/description-wrapper.component';
import { HorizontalCheckboxWrapperComponent } from './wrappers/horizontal-checkbox-wrapper/horizontal-checkbox-wrapper.component';
import { HorizontalWrapperComponent } from './wrappers/horizontal-wrapper/horizontal-wrapper.component';
import { InputAddonWrapperComponent } from './wrappers/input-addon-wrapper/input-addon-wrapper.component';
import { TextareaDescriptionWrapperComponent } from './wrappers/textarea-description-wrapper/textarea-description-wrapper.component';
import { TooltipWrapperComponent } from './wrappers/tooltip-wrapper/tooltip-wrapper.component';
import { ValidationWrapperComponent } from './wrappers/validation-wrapper/validation-wrapper.component';

@NgModule({
  imports: [
    CaptchaExportsModule,
    CommonModule,
    DirectivesModule,
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
      wrappers: [
        { name: 'form-field-horizontal', component: HorizontalWrapperComponent },
        { name: 'form-field-checkbox-horizontal', component: HorizontalCheckboxWrapperComponent },
        { name: 'input-addon', component: InputAddonWrapperComponent },
        { name: 'textarea-description', component: TextareaDescriptionWrapperComponent },
        { name: 'tooltip', component: TooltipWrapperComponent },
        { name: 'validation', component: ValidationWrapperComponent },
        { name: 'description', component: DescriptionWrapperComponent },
      ],
      extras: {
        lazyRender: true,
        showError: field =>
          field.formControl &&
          field.formControl.invalid &&
          (field.formControl.dirty ||
            (field.options.parentForm && field.options.parentForm.submitted) ||
            !!(field.field.validation && field.field.validation.show)),
      },
      extensions: [{ name: 'hide-if-empty-options-extension', extension: hideIfEmptyOptionsExtension }],
    }),
    FormlySelectModule,
    IconModule,
    NgbPopoverModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  declarations: [
    CaptchaFieldComponent,
    CheckboxFieldComponent,
    DescriptionWrapperComponent,
    FieldTooltipComponent,
    FieldsetFieldComponent,
    HorizontalCheckboxWrapperComponent,
    HorizontalWrapperComponent,
    InputAddonWrapperComponent,
    PlainTextFieldComponent,
    RadioFieldComponent,
    SelectFieldComponent,
    TextInputFieldComponent,
    TextareaDescriptionWrapperComponent,
    TextareaFieldComponent,
    TooltipWrapperComponent,
    ValidationIconsComponent,
    ValidationMessageComponent,
    ValidationWrapperComponent,
  ],
  providers: [
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerTranslateSelectOptionsExtension,
      deps: [TranslateService],
    },
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerTranslatePlaceholderExtension,
      deps: [TranslateService],
    },
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useFactory: registerPostWrappersExtension,
      deps: [FormlyConfig],
    },
  ],
  exports: [
    CaptchaFieldComponent,
    FormlyBaseModule,
    SelectFieldComponent,
    TextInputFieldComponent,
    TextareaFieldComponent,
    ValidationMessageComponent,
  ],
})
export class FormlyModule {}
