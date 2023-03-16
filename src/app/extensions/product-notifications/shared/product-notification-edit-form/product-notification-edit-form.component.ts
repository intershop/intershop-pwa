import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
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
 * - A product notification is available and it can be edited or removed. In this case,
 *   there are radio buttons used to either remove the notification or to edit it.
 *
 * @example
 * <ish-product-notification-edit-form
 *   [form]="productNotificationForm"
 *   [productNotification]="productNotification$ | async"
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
  fields$: Observable<FormlyFieldConfig[]>;

  product$: Observable<ProductView>;
  productPrices$: Observable<Pricing>;

  model$: Observable<{
    alerttype?: string;
    email: string;
    pricevalue: number;
    productnotificationid?: string;
  }>;

  constructor(
    private appFacade: AppFacade,
    private context: ProductContextFacade,
    private accountFacade: AccountFacade
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.productNotification || changes.form) {
      this.product$ = this.context.select('product');
      this.productPrices$ = this.context.select('prices');

      // fill the form values in the form model, this.productNotification can be "undefined" if no notification exists
      this.model$ = combineLatest([this.productPrices$, this.accountFacade.user$]).pipe(
        map(([productPrices, user]) =>
          this.productNotification
            ? {
                alerttype: this.productNotification.type,
                email: this.productNotification.notificationMailAddress,
                pricevalue: this.productNotification.price?.value,
                productnotificationid: this.productNotification.id,
              }
            : {
                alerttype: undefined,
                email: user.email,
                pricevalue: productPrices.salePrice.value,
              }
        )
      );

      // differentiate form with or without a product notification
      this.fields$ = combineLatest([this.product$]).pipe(
        map(([product]) =>
          this.productNotification
            ? this.getFieldsForProductNotification(this.productNotification, product)
            : this.getFieldsForNoProductNotification(product)
        )
      );
    }
  }

  // get form fields if a product notification is available
  getFieldsForProductNotification(productNotification: ProductNotification, product: ProductView): FormlyFieldConfig[] {
    return [
      {
        key: 'alerttype',
        type: 'ish-radio-field',
        templateOptions: {
          label: 'product.notification.edit.form.no_notification.label',
          fieldClass: ' ',
          value: 'delete',
        },
      },
      {
        key: 'productnotificationid',
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
        key: 'alerttype',
        templateOptions: {
          value: '',
        },
      },
      {
        type: 'ish-fieldset-field',
        templateOptions: {
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
        key: 'alerttype',
        type: 'ish-radio-field',
        templateOptions: {
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
        key: 'alerttype',
        type: 'ish-radio-field',
        templateOptions: {
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
        key: 'pricevalue',
        type: 'ish-text-input-field',
        templateOptions: {
          postWrappers: [{ wrapper: 'input-addon', index: -1 }],
          label: 'product.notification.edit.form.price.label',
          required: true,
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
        templateOptions: {
          label: 'product.notification.edit.form.email.label',
          required: true,
        },
      },
    ];
  }
}
