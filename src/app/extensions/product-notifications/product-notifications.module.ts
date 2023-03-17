import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductNotificationDeleteComponent } from './shared/product-notification-delete/product-notification-delete.component';
import { ProductNotificationEditDialogComponent } from './shared/product-notification-edit-dialog/product-notification-edit-dialog.component';
import { ProductNotificationEditFormComponent } from './shared/product-notification-edit-form/product-notification-edit-form.component';
import { ProductNotificationEditComponent } from './shared/product-notification-edit/product-notification-edit.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    ProductNotificationDeleteComponent,
    ProductNotificationEditComponent,
    ProductNotificationEditDialogComponent,
    ProductNotificationEditFormComponent,
  ],
  exports: [ProductNotificationDeleteComponent, ProductNotificationEditComponent],
})
export class ProductNotificationsModule {}
