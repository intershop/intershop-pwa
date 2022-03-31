import { NgModule } from '@angular/core';
import { FieldType, FormlyModule as FormlyBaseModule } from '@ngx-formly/core';

import { ComponentsModule } from './components/components.module';
import { ExtensionsModule } from './extensions/extensions.module';
import { FieldLibraryModule } from './field-library/field-library.module';
import { TypesModule } from './types/types.module';
import { WrappersModule } from './wrappers/wrappers.module';

@NgModule({
  imports: [
    ComponentsModule,
    FormlyBaseModule.forChild({
      extras: {
        lazyRender: true,
        showError: (field: FieldType) =>
          field.formControl?.invalid &&
          (field.formControl.dirty || field.options.parentForm?.submitted || !!field.field.validation?.show),
      },
    }),
    FieldLibraryModule,
    // ToDo: with formly 6.x the default module sorting will work again
    // eslint-disable-next-line @angular-eslint/sort-ngmodule-metadata-arrays
    ExtensionsModule,
    TypesModule,
    WrappersModule,
  ],
  exports: [ComponentsModule, FormlyBaseModule],
})
export class FormlyModule {}
