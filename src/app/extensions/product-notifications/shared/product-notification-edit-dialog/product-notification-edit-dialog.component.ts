import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, shareReplay, switchMap } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';
import { ProductNotification } from '../../models/product-notification/product-notification.model';

/**
 * The Product Notification Edit Dialog Component shows the customer a dialog to either create,
 * edit or delete a product notification. The dialog is called from either the detail page or
 * the my account notifications list.
 * If a product notification does not exist yet, the dialog shows the form to create a notification.
 * If a product notification exists, the dialog shows the form to update the notification.
 *
 * Each form includes it's specific form elements and buttons, see product-notification-edit-form.component.
 *
 *
 * @example
 * <ish-product-notification-edit-dialog
 *   [productNotification]="productNotification"
 *   #modal></ish-product-notification-dialog>
 */
@Component({
  selector: 'ish-product-notification-edit-dialog',
  templateUrl: './product-notification-edit-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNotificationEditDialogComponent implements OnInit {
  @Input() productNotification: ProductNotification;

  modal: NgbModalRef;
  product$: Observable<ProductView>;
  userEmail$: Observable<string>;
  private currentCurrency: string;

  productNotificationForm = new UntypedFormGroup({});
  private submitted = false;

  productNotification$: Observable<ProductNotification>;

  private destroyRef = inject(DestroyRef);

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(
    private ngbModal: NgbModal,
    private context: ProductContextFacade,
    private accountFacade: AccountFacade,
    private productNotificationsFacade: ProductNotificationsFacade,
    private appFacade: AppFacade
  ) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
    const productAvailable$ = this.context.select('product', 'available');
    this.userEmail$ = this.accountFacade.userEmail$;

    // determine current currency
    this.appFacade.currentCurrency$.pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef)).subscribe(currency => {
      this.currentCurrency = currency;
    });

    // if no product notification is given as @Input parameter, trigger a REST call to fetch the notification
    this.productNotification$ = this.productNotification
      ? of(this.productNotification)
      : productAvailable$.pipe(
          switchMap(available =>
            this.productNotificationsFacade
              .productNotificationBySku$(this.context.get('sku'), available ? 'price' : 'stock')
              .pipe(shareReplay(1))
          )
        );
  }

  // close modal
  hide() {
    this.productNotificationForm.reset();
    if (this.modal) {
      this.modal.close();
    }
  }

  // open modal
  show() {
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  get formDisabled() {
    return this.productNotificationForm.invalid && this.submitted;
  }

  // submit the form
  submitForm() {
    if (this.productNotificationForm.invalid) {
      markAsDirtyRecursive(this.productNotificationForm);
      focusFirstInvalidField(this.productNotificationForm);
      this.submitted = true;
      return;
    } else {
      const sku = this.context.get('sku');
      const formValue = this.productNotificationForm.value;
      const productNotificationType = formValue.priceValue === undefined ? 'stock' : 'price';
      const productNotificationId =
        formValue.productNotificationId !== undefined ? formValue.productNotificationId : '';

      const productNotification: ProductNotification = {
        id: undefined,
        type: productNotificationType,
        sku,
        notificationMailAddress: this.productNotificationForm.value.email,
        price: {
          type: 'Money',
          value: formValue.priceValue,
          currency: this.currentCurrency,
        },
      };

      if (formValue.alertType !== undefined && formValue.alertType === 'delete') {
        // user selected the radio button to delete the notification
        this.productNotificationsFacade.deleteProductNotification(sku, productNotificationType, productNotificationId);
      } else if (
        formValue.alertType !== undefined &&
        (formValue.alertType === 'price' || formValue.alertType === 'stock')
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
}
