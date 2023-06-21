import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Pricing } from 'ish-core/models/price/price.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { ProductNotification } from '../../models/product-notification/product-notification.model';

/**
 * The Product Notification Form Component includes the form to edit the notification.
 * It is shown within the product notification dialog component.
 *
 * The form shows fields either for the price or the stock notification.
 * Each of these two types has to support two cases:
 * - A product notification is not available and has to be created. There are no radio buttons.
 * - A product notification is available and it can be edited or deleted. In this case,
 *   there are radio buttons used to either delete the notification or to edit it.
 *
 * @example
 * <ish-product-notification-edit-form
 *   [form]="productNotificationForm"
 *   [productNotification]="productNotification$ | async"
 *   [userEmail]="userEmail$ | async"
 * ></ish-product-notification-edit-form>
 */
@Component({
  selector: 'ish-product-notification-edit-form',
  templateUrl: './product-notification-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNotificationEditFormComponent implements OnChanges {
  @Input() form: FormGroup;
  @Input() productNotification: ProductNotification;
  @Input() userEmail: string;

  product: ProductView;
  productPrices: Pricing;

  model: {
    alertType?: string;
    email: string;
    priceValue: number;
    productNotificationId?: string;
  };

  fields: FormlyFieldConfig[];

  constructor(private appFacade: AppFacade, private context: ProductContextFacade) {}

  ngOnChanges() {
    if (this.userEmail && this.form) {
      this.product = this.context.get('product');
      this.productPrices = this.context.get('prices');

      // fill the form values in the form model, this.productNotification can be "undefined" if no notification exists
      this.model = this.productNotification
        ? {
            alertType: this.productNotification.type,
            email: this.productNotification.notificationMailAddress,
            priceValue: this.productNotification.price?.value,
            productNotificationId: this.productNotification.id,
          }
        : {
            alertType: undefined,
            email: this.userEmail,
            priceValue: this.productPrices.salePrice.value,
          };

      // differentiate form with or without a product notification
      this.fields = this.productNotification
        ? this.getFieldsForProductNotification(this.productNotification, this.product)
        : this.getFieldsForNoProductNotification(this.product);
    }
  }

  // get form fields if a product notification is available
  getFieldsForProductNotification(productNotification: ProductNotification, product: ProductView): FormlyFieldConfig[] {
    return [
      {
        key: 'alertType',
        type: 'ish-radio-field',
        props: {
          label: 'product.notification.edit.form.no_notification.label',
          fieldClass: ' ',
          value: 'delete',
        },
      },
      {
        key: 'productNotificationId',
      },
      ...(productNotification?.type === 'price' || product?.available
        ? this.getPriceConfigForProductNotification()
        : []),
      ...(productNotification?.type === 'stock' || !product?.available
        ? this.getStockConfigForProductNotification()
        : []),
      ...this.getEmailConfig(),
    ];
  }

  // wrap form fields in fieldset if a product notification is not available because there are no radio buttons
  getFieldsForNoProductNotification(product: ProductView): FormlyFieldConfig[] {
    return [
      {
        key: 'alertType',
        props: {
          value: '',
        },
      },
      {
        type: 'ish-fieldset-field',
        props: {
          legend: product?.available
            ? 'product.notification.edit.form.price_notification.label'
            : 'product.notification.edit.form.instock_notification.label',
          legendClass: 'row mb-3',
        },
        fieldGroup: [...(product?.available ? this.getPriceConfig() : []), ...this.getEmailConfig()],
      },
    ];
  }

  // get the fields for the price notification
  private getPriceConfigForProductNotification(): FormlyFieldConfig[] {
    return [
      {
        key: 'alertType',
        type: 'ish-radio-field',
        props: {
          label: 'product.notification.edit.form.price_notification.label',
          fieldClass: ' ',
          value: 'price',
        },
      },
      ...this.getPriceConfig(),
    ];
  }

  // get the fields for the stock notification
  private getStockConfigForProductNotification(): FormlyFieldConfig[] {
    return [
      {
        key: 'alertType',
        type: 'ish-radio-field',
        props: {
          label: 'product.notification.edit.form.instock_notification.label',
          fieldClass: ' ',
          value: 'stock',
        },
      },
    ];
  }

  // get only the price field
  private getPriceConfig(): FormlyFieldConfig[] {
    return [
      {
        key: 'priceValue',
        type: 'ish-text-input-field',
        props: {
          postWrappers: [{ wrapper: 'input-addon', index: -1 }],
          label: 'product.notification.edit.form.price.label',
          required: true,
          hideRequiredMarker: true,
          addonLeft: {
            text: this.appFacade.currencySymbol$(),
          },
        },
        validators: {
          validation: [SpecialValidators.moneyAmount],
        },
        validation: {
          messages: {
            required: 'product.notification.edit.form.price.error.required',
            moneyAmount: 'product.notification.edit.form.price.error.valid',
          },
        },
      },
    ];
  }

  // get only the email field
  private getEmailConfig(): FormlyFieldConfig[] {
    return [
      {
        key: 'email',
        type: 'ish-email-field',
        props: {
          label: 'product.notification.edit.form.email.label',
          required: true,
          hideRequiredMarker: true,
        },
      },
    ];
  }
}
