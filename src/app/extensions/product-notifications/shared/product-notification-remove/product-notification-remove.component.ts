import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';
import { ProductNotification } from '../../models/product-notification/product-notification.model';

/**
 * The Product Notification Remove Component shows the customer a link to open the dialog
 * to remove the product notification.
 *
 * @example
 * <ish-product-notification-remove
 *   cssClass="btn-link btn-tool"
 *   [productNotification]="productNotification"
 * ></ish-product-notification-remove>
 */
@Component({
  selector: 'ish-product-notification-remove',
  templateUrl: './product-notification-remove.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNotificationRemoveComponent implements OnInit {
  @Input() productNotification: ProductNotification;
  @Input() cssClass: string;

  productName$: Observable<string>;

  constructor(private productNotificationsFacade: ProductNotificationsFacade, private context: ProductContextFacade) {}

  ngOnInit() {
    this.productName$ = this.context.select('product', 'name');
  }

  openConfirmationDialog(modal: ModalDialogComponent<string>) {
    modal.show();
  }

  // delete the notification
  deleteProductNotification() {
    const sku = this.context.get('sku');
    const productNotificationType = this.productNotification.type;
    const productNotificationId = this.productNotification.id;

    this.productNotificationsFacade.deleteProductNotification(sku, productNotificationType, productNotificationId);
  }
}
