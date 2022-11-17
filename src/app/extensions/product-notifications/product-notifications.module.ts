import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductNotificationDialogComponent } from './shared/product-notification-dialog/product-notification-dialog.component';
import { ProductNotificationEditFormComponent } from './shared/product-notification-edit-form/product-notification-edit-form.component';
import { ProductNotificationEditComponent } from './shared/product-notification-edit/product-notification-edit.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    ProductNotificationDialogComponent,
    ProductNotificationEditComponent,
    ProductNotificationEditFormComponent,
  ],
  exports: [
    ProductNotificationDialogComponent,
    ProductNotificationEditComponent,
    ProductNotificationEditFormComponent,
    SharedModule,
  ],
})
export class ProductNotificationsModule {}
