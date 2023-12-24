import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';
import { ProductNotification } from '../../models/product-notification/product-notification.model';

/**
 * The Product Notification Delete Component shows the customer a link to open the dialog
 * to delete the product notification.
 *
 * @example
 * <ish-product-notification-delete
 *   cssClass="btn-link btn-tool"
 *   [productNotification]="productNotification"
 * ></ish-product-notification-delete>
 */
@Component({
  selector: 'ish-product-notification-delete',
  templateUrl: './product-notification-delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNotificationDeleteComponent implements OnInit {
  @Input({ required: true }) productNotification: ProductNotification;
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
