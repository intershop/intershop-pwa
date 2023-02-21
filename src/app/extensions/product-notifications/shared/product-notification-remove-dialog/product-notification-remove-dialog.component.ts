import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';
import { ProductNotification } from '../../models/product-notification/product-notification.model';

/**
 * The Product Notification Dialog Remove Component is opened if the user likes to
 * remove the product notification in the my account.
 *
 * @example
 * <ish-product-notification-remove-dialog
 *   [productNotification]="productNotification"
 *   #modal
 * ></ish-product-notification-remove-dialog>
 */
@Component({
  selector: 'ish-product-notification-remove-dialog',
  templateUrl: './product-notification-remove-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNotificationRemoveDialogComponent implements OnInit {
  modal: NgbModalRef;

  product$: Observable<ProductView>;
  @Input() productNotification: ProductNotification;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(
    private ngbModal: NgbModal,
    private context: ProductContextFacade,
    private productNotificationsFacade: ProductNotificationsFacade
  ) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
  }

  // delete the notification
  removeProductNotification() {
    const sku = this.context.get('sku');
    const productNotificationType = this.productNotification.type;
    const productNotificationId = this.productNotification.id;

    this.productNotificationsFacade.deleteProductNotification(sku, productNotificationType, productNotificationId);
    this.hide();
  }

  // close modal
  hide() {
    if (this.modal) {
      this.modal.close();
    }
  }

  // open modal
  show() {
    this.modal = this.ngbModal.open(this.modalTemplate);
  }
}
