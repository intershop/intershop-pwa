import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, of, shareReplay, switchMap, takeUntil } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Pricing } from 'ish-core/models/price/price.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';
import { ProductNotification } from '../../models/product-notification/product-notification.model';

/**
 * The Product Notification Edit Dialog Component shows the customer a dialog to either create,
 * edit or remove a product notification.
 *
 * @example
 * <ish-product-notification-edit-dialog
 *   [productNotification]="productNotification"
 *   #modal></ish-product-notification-dialog>
 */
@Component({
  selector: 'ish-product-notification-edit-dialog',
  templateUrl: './product-notification-edit-dialog.component.html',
  styleUrls: ['./product-notification-edit-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNotificationEditDialogComponent implements OnInit, OnDestroy {
  modal: NgbModalRef;

  product$: Observable<ProductView>;
  productAvailable$: Observable<boolean>;
  productPrices$: Observable<Pricing>;
  currentCurrency: string;

  productNotificationForm = new UntypedFormGroup({});
  submitted = false;

  @Input() productNotification: ProductNotification;
  productNotification$: Observable<ProductNotification>;

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
    this.productAvailable$ = this.context.select('product', 'available');

    // determine current currency
    this.appFacade.currentCurrency$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(currency => {
      this.currentCurrency = currency;
    });

    // get product notification as @Input parameter (my account) or from facade (REST call)
    this.productNotification$ = this.productNotification
      ? of(this.productNotification)
      : this.productAvailable$.pipe(
          switchMap(available =>
            this.productNotificationsFacade
              .productNotificationBySku$(this.context.get('sku'), available ? 'price' : 'stock')
              .pipe(shareReplay(1))
          )
        );
  }

  /** close modal */
  hide() {
    this.productNotificationForm.reset();
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
      const sku = this.context.get('sku');
      const formValue = this.productNotificationForm.value;
      const productNotificationType = formValue.pricevalue === undefined ? 'stock' : 'price';
      const productNotificationId =
        formValue.productnotificationid !== undefined ? formValue.productnotificationid : '';

      const productNotification: ProductNotification = {
        id: undefined,
        type: productNotificationType,
        sku,
        notificationMailAddress: this.productNotificationForm.value.email,
        price: {
          type: 'Money',
          value: formValue.pricevalue,
          currency: this.currentCurrency,
        },
      };

      if (formValue.alerttype !== undefined && formValue.alerttype === 'delete') {
        // user selected the radio button to remove the notification
        this.productNotificationsFacade.deleteProductNotification(sku, productNotificationType, productNotificationId);
      } else if (
        formValue.alerttype !== undefined &&
        (formValue.alerttype === 'price' || formValue.alerttype === 'stock')
      ) {
        // update existing notification
        this.productNotificationsFacade.updateProductNotification(sku, productNotification);
      } else {
        // there is no radio button
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
