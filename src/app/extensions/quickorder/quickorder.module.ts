import { NgModule } from '@angular/core';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';

import { TextInputFieldComponent } from 'ish-shared/formly/types/text-input-field/text-input-field.component';
import { ColumnWrapperComponent } from 'ish-shared/formly/wrappers/column-wrapper/column-wrapper.component';
import { SharedModule } from 'ish-shared/shared.module';

import { QuickorderAddProductsFormComponent } from './shared/quickorder-add-products-form/quickorder-add-products-form.component';
import { HeaderQuickorderComponent } from './shared/header-quickorder/header-quickorder.component';
import { QuickorderCsvFormComponent } from './shared/quickorder-csv-form/quickorder-csv-form.component';
import { QuickorderRepeatFormSectionComponent } from './shared/quickorder-repeat-form-section/quickorder-repeat-form-section.component';

const quickOrderFormlyConfig: ConfigOption = {
  types: [
    {
      name: 'ish-input-field',
      component: TextInputFieldComponent,
      wrappers: ['form-field-column', 'validation'],
    },
    {
      name: 'repeat',
      component: QuickorderRepeatFormSectionComponent,
    },
  ],
  wrappers: [{ name: 'form-field-column', component: ColumnWrapperComponent }],
};

@NgModule({
  imports: [FormlyModule.forChild(quickOrderFormlyConfig), SharedModule],
  declarations: [
    ColumnWrapperComponent,
    HeaderQuickorderComponent,
    QuickorderAddProductsFormComponent,
    QuickorderCsvFormComponent,
    QuickorderRepeatFormSectionComponent,
  ],
  exports: [QuickorderAddProductsFormComponent, QuickorderCsvFormComponent, SharedModule],
})
export class QuickorderModule {}
