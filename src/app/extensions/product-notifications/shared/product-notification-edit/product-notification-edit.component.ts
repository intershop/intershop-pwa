import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductNotification } from '../../models/product-notification/product-notification.model';
import { ProductNotificationDialogComponent } from '../product-notification-dialog/product-notification-dialog.component';

/**
 * The Product Notification Component shows the customer a link to open the dialog to edit the product notification.
 *
 * @example
 * <ish-product-notification-edit></ish-product-notification-edit>
 */
@Component({
  selector: 'ish-product-notification-edit',
  templateUrl: './product-notification-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNotificationEditComponent {
  @Input() productNotification: ProductNotification;

  openModal(modal: ProductNotificationDialogComponent) {
    modal.show();
  }
}
