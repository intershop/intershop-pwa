import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { ProductNotification } from '../../models/product-notification/product-notification.model';

/**
 * The Product Notification Dialog Component shows the customer a dialog to either create,
 * edit or remove a product notification.
 *
 * @example
 * <ish-product-notification-dialog
 *   [productNotification]="productNotification"
 *   #modal></ish-product-notification-dialog>
 */
@Component({
  selector: 'ish-product-notification-dialog',
  templateUrl: './product-notification-dialog.component.html',
  styleUrls: ['./product-notification-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNotificationDialogComponent implements OnInit {
  modal: NgbModalRef;
  productNotificationForm = new FormGroup({});
  product$: Observable<ProductView>;

  @Input() productNotification: ProductNotification;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(private ngbModal: NgbModal, private context: ProductContextFacade) {}

  submitted = false;

  ngOnInit() {
    this.product$ = this.context.select('product');
  }

  /** close modal */
  hide() {
    this.modal.close();
  }

  /** open modal */
  show() {
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  /** submit the form */
  submitForm() {
    if (this.productNotificationForm.invalid) {
      markAsDirtyRecursive(this.productNotificationForm);
      this.submitted = true;
      return;
    }
  }
}
