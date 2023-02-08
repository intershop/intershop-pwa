import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductNotificationEditDialogComponent } from './shared/product-notification-edit-dialog/product-notification-edit-dialog.component';
import { ProductNotificationEditFormComponent } from './shared/product-notification-edit-form/product-notification-edit-form.component';
import { ProductNotificationEditComponent } from './shared/product-notification-edit/product-notification-edit.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    ProductNotificationEditComponent,
    ProductNotificationEditDialogComponent,
    ProductNotificationEditFormComponent,
  ],
  exports: [
    ProductNotificationEditComponent,
    ProductNotificationEditDialogComponent,
    ProductNotificationEditFormComponent,
    SharedModule,
  ],
})
export class ProductNotificationsModule {}
