import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FORMLY_CONFIG, FormlyConfig, FormlyModule as FormlyBaseModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DirectivesModule } from 'ish-core/directives.module';
import { IconModule } from 'ish-core/icon.module';

import { CaptchaExportsModule } from '../../extensions/captcha/exports/captcha-exports.module';

import { FieldTooltipComponent } from './components/field-tooltip/field-tooltip.component';
import { ValidationIconsComponent } from './components/validation-icons/validation-icons.component';
import { ValidationMessageComponent } from './components/validation-message/validation-message.component';
import { criticalDefaultValuesExtension } from './extensions/critical-default-values.extension';
import { hideIfEmptyOptionsExtension } from './extensions/hide-if-empty-options.extension';
import { registerPostWrappersExtension } from './extensions/post-wrappers-extension';
import { registerTranslateSelectOptionsExtension } from './extensions/translate-select-options.extension';
import { CaptchaFieldComponent } from './types/captcha-field/captcha-field.component';
import { CheckboxFieldComponent } from './types/checkbox-field/checkbox-field.component';
import { EmailFieldComponent } from './types/email-field/email-field.component';
import { FieldsetFieldComponent } from './types/fieldset-field/fieldset-field.component';
import { PasswordFieldComponent } from './types/password-field/password-field.component';
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
    FormlyBaseModule.forRoot({
      types: [
        {
          name: 'ish-text-input-field',
          component: TextInputFieldComponent,
          wrappers: ['form-field-horizontal', 'validation'],
        },
        {
          name: 'ish-email-field',
          component: EmailFieldComponent,
          wrappers: ['form-field-horizontal', 'validation'],
        },
        {
          name: 'ish-password-field',
          component: PasswordFieldComponent,
          wrappers: ['form-field-horizontal', 'validation'],
        },
        {
          name: 'ish-select-field',
          component: SelectFieldComponent,
          wrappers: ['form-field-horizontal', 'validation'],
        },
        {
          name: 'ish-textarea-field',
          component: TextareaFieldComponent,
          wrappers: ['form-field-horizontal', 'validation', 'textarea-description'],
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
      extensions: [
        { name: 'critical-default-values-extension', extension: criticalDefaultValuesExtension },
        { name: 'hide-if-empty-options-extension', extension: hideIfEmptyOptionsExtension },
      ],
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
    EmailFieldComponent,
    FieldTooltipComponent,
    FieldsetFieldComponent,
    HorizontalCheckboxWrapperComponent,
    HorizontalWrapperComponent,
    InputAddonWrapperComponent,
    PasswordFieldComponent,
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
