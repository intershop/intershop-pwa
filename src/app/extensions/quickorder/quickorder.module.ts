import { NgModule } from '@angular/core';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';

import { SharedModule } from 'ish-shared/shared.module';

import { DirectOrderComponent } from './shared/direct-order/direct-order.component';
import { QuickorderRepeatFieldComponent } from './shared/formly/quickorder-repeat-field/quickorder-repeat-field.component';
import { QuickorderAddProductsFormComponent } from './shared/quickorder-add-products-form/quickorder-add-products-form.component';
import { QuickorderCsvFormComponent } from './shared/quickorder-csv-form/quickorder-csv-form.component';
import { QuickorderLinkComponent } from './shared/quickorder-link/quickorder-link.component';

const quickOrderFormlyConfig: ConfigOption = {
  types: [
    {
      name: 'repeat',
      component: QuickorderRepeatFieldComponent,
    },
  ],
};

@NgModule({
  imports: [FormlyModule.forChild(quickOrderFormlyConfig), SharedModule],
  declarations: [
    DirectOrderComponent,
    QuickorderAddProductsFormComponent,
    QuickorderCsvFormComponent,
    QuickorderLinkComponent,
    QuickorderRepeatFieldComponent,
  ],
  exports: [QuickorderAddProductsFormComponent, QuickorderCsvFormComponent, SharedModule],
})
export class QuickorderModule {}
