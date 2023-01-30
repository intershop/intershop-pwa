import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, takeUntil } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Pricing } from 'ish-core/models/price/price.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';
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
export class ProductNotificationDialogComponent implements OnInit, OnDestroy {
  modal: NgbModalRef;
  productNotificationForm = new UntypedFormGroup({});
  product$: Observable<ProductView>;

  submitted = false;
  productPrices$: Observable<Pricing>;
  currentCurrency: string;

  @Input() productNotification: ProductNotification;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  private destroy$ = new Subject<void>();

  constructor(
    private ngbModal: NgbModal,
    private context: ProductContextFacade,
    private productNotificationsFacade: ProductNotificationsFacade,
    private appFacade: AppFacade
  ) {}

  ngOnInit() {
    this.product$ = this.context.select('product');

    // determine current currency
    this.appFacade.currentCurrency$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(currency => {
      this.currentCurrency = currency;
    });
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
    } else {
      const formValue = this.productNotificationForm.value;
      const notificationType = this.productNotificationForm.value.pricevalue === undefined ? 'stock' : 'price';

      const productNotification: ProductNotification = {
        id: undefined,
        type: notificationType,
        sku: this.context.get('sku'),
        notificationMailAddress: this.productNotificationForm.value.email,
        price: {
          type: 'Money', // @todo: set correctly
          value: formValue.pricevalue,
          currency: this.currentCurrency,
        },
      };

      // @todo: alerttype is always "delete" after deleting a notification
      if (formValue.alerttype !== undefined && formValue.alerttype === 'delete') {
        // user selected the radio button to remove the notification
        this.productNotificationsFacade.deleteProductNotification(productNotification);
      } else {
        // there is no radio button or user selected the radio button to create the notification
        this.productNotificationsFacade.createProductNotification(productNotification);
      }
      this.hide();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
