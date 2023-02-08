import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductNotificationEditDialogComponent } from './shared/product-notification-edit-dialog/product-notification-edit-dialog.component';
import { ProductNotificationEditFormComponent } from './shared/product-notification-edit-form/product-notification-edit-form.component';
import { ProductNotificationEditComponent } from './shared/product-notification-edit/product-notification-edit.component';
import { ProductNotificationRemoveDialogComponent } from './shared/product-notification-remove-dialog/product-notification-remove-dialog.component';
import { ProductNotificationRemoveComponent } from './shared/product-notification-remove/product-notification-remove.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    ProductNotificationEditComponent,
    ProductNotificationEditDialogComponent,
    ProductNotificationEditFormComponent,
    ProductNotificationRemoveComponent,
    ProductNotificationRemoveDialogComponent,
  ],
  exports: [
    ProductNotificationEditComponent,
    ProductNotificationEditDialogComponent,
    ProductNotificationEditFormComponent,
    ProductNotificationRemoveComponent,
    ProductNotificationRemoveDialogComponent,
    SharedModule,
  ],
})
export class ProductNotificationsModule {}
