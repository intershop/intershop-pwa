import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { BasketCreateOrderTemplateComponent } from './shared/basket/basket-create-order-template/basket-create-order-template.component';
import { OrderTemplatePreferencesDialogComponent } from './shared/order-templates/order-template-preferences-dialog/order-template-preferences-dialog.component';
import { SelectOrderTemplateModalComponent } from './shared/order-templates/select-order-template-modal/select-order-template-modal.component';
import { ProductAddToOrderTemplateComponent } from './shared/product/product-add-to-order-template/product-add-to-order-template.component';
import { OrderTemplatesStoreModule } from './store/order-templates-store.module';

@NgModule({
  imports: [OrderTemplatesStoreModule, SharedModule],
  declarations: [
    BasketCreateOrderTemplateComponent,
    OrderTemplatePreferencesDialogComponent,
    ProductAddToOrderTemplateComponent,
    SelectOrderTemplateModalComponent,
  ],
  exports: [OrderTemplatePreferencesDialogComponent, SelectOrderTemplateModalComponent],
  entryComponents: [BasketCreateOrderTemplateComponent, ProductAddToOrderTemplateComponent],
})
export class OrderTemplatesModule {}
