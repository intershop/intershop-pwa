import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductNotification } from '../../models/product-notification/product-notification.model';
import { ProductNotificationRemoveDialogComponent } from '../product-notification-remove-dialog/product-notification-remove-dialog.component';

/**
 * The Product Notification Remove Component shows the customer a link to open the dialog
 * to remove the product notification.
 *
 * @example
 * <ish-product-notification-remove
 *   [cssClass]="'btn-link btn-tool'"
 *   [productNotification]="productNotification"
 * ></ish-product-notification-remove>
 */
@Component({
  selector: 'ish-product-notification-remove',
  templateUrl: './product-notification-remove.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNotificationRemoveComponent {
  @Input() productNotification: ProductNotification;
  @Input() cssClass: string;

  openModal(modal: ProductNotificationRemoveDialogComponent) {
    modal.show();
  }
}
