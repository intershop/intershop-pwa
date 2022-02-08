import { NgModule } from '@angular/core';
import { FieldType, FormlyModule as FormlyBaseModule } from '@ngx-formly/core';

import { ExtensionsModule } from './extensions/extensions.module';
import { CaptchaFieldComponent } from './types/captcha-field/captcha-field.component';
import { SelectFieldComponent } from './types/select-field/select-field.component';
import { TextInputFieldComponent } from './types/text-input-field/text-input-field.component';
import { TextareaFieldComponent } from './types/textarea-field/textarea-field.component';
import { TypesModule } from './types/types.module';
import { ValidationMessageComponent } from './wrappers/components/validation-message/validation-message.component';
import { WrappersModule } from './wrappers/wrappers.module';

@NgModule({
  imports: [
    ExtensionsModule,
    FormlyBaseModule.forChild({
      extras: {
        lazyRender: true,
        showError: (field: FieldType) =>
          field.formControl?.invalid &&
          (field.formControl.dirty || field.options.parentForm?.submitted || !!field.field.validation?.show),
      },
    }),
    TypesModule,
    WrappersModule,
  ],
  exports: [
    CaptchaFieldComponent,
    FormlyBaseModule,
    SelectFieldComponent,
    TextareaFieldComponent,
    TextInputFieldComponent,
    ValidationMessageComponent,
  ],
})
export class FormlyModule {}
