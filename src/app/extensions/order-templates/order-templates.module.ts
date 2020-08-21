import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { BasketCreateOrderTemplateComponent } from './shared/basket-create-order-template/basket-create-order-template.component';
import { OrderTemplatePreferencesDialogComponent } from './shared/order-template-preferences-dialog/order-template-preferences-dialog.component';
import { ProductAddToOrderTemplateComponent } from './shared/product-add-to-order-template/product-add-to-order-template.component';
import { SelectOrderTemplateModalComponent } from './shared/select-order-template-modal/select-order-template-modal.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    BasketCreateOrderTemplateComponent,
    OrderTemplatePreferencesDialogComponent,
    ProductAddToOrderTemplateComponent,
    SelectOrderTemplateModalComponent,
  ],
  exports: [OrderTemplatePreferencesDialogComponent, SelectOrderTemplateModalComponent],
})
export class OrderTemplatesModule {}
