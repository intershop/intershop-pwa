import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductNotificationDialogComponent } from './shared/product-notification-dialog/product-notification-dialog.component';
import { ProductNotificationEditComponent } from './shared/product-notification-edit/ProductNotificationEditComponent';

@NgModule({
  imports: [SharedModule],
  declarations: [ProductNotificationDialogComponent, ProductNotificationEditComponent],
  exports: [ProductNotificationDialogComponent, ProductNotificationEditComponent, SharedModule],
})
export class ProductNotificationsModule {}
