import { NgModule } from '@angular/core';
import { FieldType, FormlyModule as FormlyBaseModule } from '@ngx-formly/core';

import { ExtensionsModule } from './extensions/extensions.module';
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
  exports: [FormlyBaseModule, ValidationMessageComponent],
})
export class FormlyModule {}
