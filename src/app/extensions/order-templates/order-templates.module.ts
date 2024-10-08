import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { BasketCreateOrderTemplateComponent } from './shared/basket-create-order-template/basket-create-order-template.component';
import { OrderCreateOrderTemplateComponent } from './shared/order-create-order-template/order-create-order-template.component';
import { OrderTemplatePreferencesDialogComponent } from './shared/order-template-preferences-dialog/order-template-preferences-dialog.component';
import { OrderTemplateWidgetComponent } from './shared/order-template-widget/order-template-widget.component';
import { ProductAddToOrderTemplateComponent } from './shared/product-add-to-order-template/product-add-to-order-template.component';
import { SelectOrderTemplateFormComponent } from './shared/select-order-template-form/select-order-template-form.component';
import { SelectOrderTemplateModalComponent } from './shared/select-order-template-modal/select-order-template-modal.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    BasketCreateOrderTemplateComponent,
    OrderCreateOrderTemplateComponent,
    OrderTemplatePreferencesDialogComponent,
    OrderTemplateWidgetComponent,
    ProductAddToOrderTemplateComponent,
    SelectOrderTemplateFormComponent,
    SelectOrderTemplateModalComponent,
  ],
  exports: [OrderTemplatePreferencesDialogComponent, OrderTemplateWidgetComponent, SelectOrderTemplateModalComponent],
})
export class OrderTemplatesModule {}
