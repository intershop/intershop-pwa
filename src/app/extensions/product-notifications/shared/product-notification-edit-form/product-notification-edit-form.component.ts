import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Pricing } from 'ish-core/models/price/price.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { ProductNotificationsFacade } from '../../facades/product-notifications.facade';
import { ProductNotification } from '../../models/product-notification/product-notification.model';

/**
 * The Product Notification Form Component includes the form to edit the notification.
 *
 * @example
 * <ish-product-notification-edit-form></ish-product-notification-edit-form>
 */
@Component({
  selector: 'ish-product-notification-edit-form',
  templateUrl: './product-notification-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNotificationEditFormComponent implements OnInit {
  @Input() productNotificationForm: FormGroup;
  @Input() productNotification: ProductNotification;
  fields$: Observable<FormlyFieldConfig[]>;

  model$: Observable<any>;

  constructor(
    private appFacade: AppFacade,
    private productNotificationsFacade: ProductNotificationsFacade,
    private context: ProductContextFacade,
    private accountFacade: AccountFacade
  ) {}

  productNotification$: Observable<ProductNotification>;
  product$: Observable<ProductView>;
  productPrices$: Observable<Pricing>;

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.productPrices$ = this.context.select('prices');

    this.productNotification$ = this.productNotification
      ? of(this.productNotification)
      : this.productNotificationsFacade.productNotification$();

    this.model$ = combineLatest([
      this.productNotification$,
      this.productPrices$,
      this.product$,
      this.accountFacade.user$,
    ]).pipe(
      map(([productNotification, productPrices, product, user]) =>
        productNotification
          ? {
              alerttype: productNotification.type,
              email: productNotification.notificationMailAddress,
              pricevalue: productNotification.price?.value,
            }
          : {
              alerttype: product?.available ? 'price' : 'stock',
              email: user.email,
              pricevalue: productPrices.salePrice.value,
            }
      )
    );

    this.fields$ = combineLatest([
      this.productNotification$,
      this.product$,
      this.model$.pipe(map(model => model?.currency)),
    ]).pipe(map(([productNotification, product, currency]) => this.getFields(productNotification, product, currency)));
  }

  getFields(productNotification: ProductNotification, product: ProductView, currency: string): FormlyFieldConfig[] {
    const fields: FormlyFieldConfig[] = [];

    if (productNotification) {
      fields.push({
        key: 'alerttype',
        type: 'ish-radio-field',
        templateOptions: {
          label: 'product.notification.edit.form.no_notification.label',
          fieldClass: ' ',
          value: '',
        },
      });
    }

    if (productNotification?.type === 'stock' || !product?.available) {
      fields.push({
        key: 'alerttype',
        type: 'ish-radio-field',
        templateOptions: {
          label: 'product.notification.edit.form.instock_notification.label',
          fieldClass: ' ',
          value: 'stock',
        },
      });
    }

    if (productNotification?.type === 'price' || product?.available) {
      fields.push(
        {
          key: 'alerttype',
          type: 'ish-radio-field',
          templateOptions: {
            label: 'product.notification.edit.form.price_notification.label',
            fieldClass: ' ',
            value: 'price',
          },
        },
        {
          key: 'pricevalue',
          type: 'ish-text-input-field',
          templateOptions: {
            postWrappers: [{ wrapper: 'input-addon', index: -1 }],
            label: 'product.notification.edit.form.price.label',
            required: true,
            addonLeft: {
              text: this.appFacade.currencySymbol$(currency),
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
        }
      );
    }

    fields.push({
      key: 'email',
      type: 'ish-email-field',
      templateOptions: {
        label: 'product.notification.edit.form.email.label',
        required: true,
      },
      validation: {
        messages: {
          required: 'form.email.error.required',
        },
      },
    });

    return fields;
  }
}
