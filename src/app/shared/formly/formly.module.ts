import { NgModule } from '@angular/core';
import { FieldType, FormlyModule as FormlyBaseModule } from '@ngx-formly/core';

import { ComponentsModule } from './components/components.module';
import { FieldTooltipComponent } from './components/field-tooltip/field-tooltip.component';
import { ValidationIconsComponent } from './components/validation-icons/validation-icons.component';
import { ValidationMessageComponent } from './components/validation-message/validation-message.component';
import { ExtensionsModule } from './extensions/extensions.module';
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
    ExtensionsModule,
    TypesModule,
    WrappersModule,
  ],
  exports: [FieldTooltipComponent, FormlyBaseModule, ValidationIconsComponent, ValidationMessageComponent],
})
export class FormlyModule {}
