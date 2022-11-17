import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
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
  styleUrls: ['./product-notification-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNotificationEditComponent {
  @Input() cssClass: string;

  openModal(modal: ProductNotificationDialogComponent) {
    modal.show();
  }
}
