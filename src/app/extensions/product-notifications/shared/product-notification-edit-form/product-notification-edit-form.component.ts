import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

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
  fields: FormlyFieldConfig[];

  model: any;

  ngOnInit() {
    this.model = this.productNotification
      ? {
          alerttype: this.productNotification.type,
          email: this.productNotification.notificationMailAddress,
          pricevalue: this.productNotification.price?.value,
        }
      : {};

    this.fields = [
      {
        key: 'alerttype',
        type: 'ish-radio-field',
        templateOptions: {
          label: 'product.notification.edit.form.no_notification.label',
          fieldClass: ' ',
          value: '',
        },
      },
      {
        key: 'alerttype',
        type: 'ish-radio-field',
        hide: this.productNotification.type !== 'stock',
        templateOptions: {
          label: 'product.notification.edit.form.instock_notification.label',
          fieldClass: ' ',
          value: 'stock',
        },
      },
      {
        key: 'alerttype',
        type: 'ish-radio-field',
        hide: this.productNotification.type !== 'price',
        templateOptions: {
          label: 'product.notification.edit.form.price_notification.label',
          fieldClass: ' ',
          value: 'price',
        },
      },
      {
        key: 'pricevalue',
        type: 'ish-text-input-field',
        hide: this.productNotification.type !== 'price',
        templateOptions: {
          label: 'product.notification.edit.form.price.label',
          required: true,
        },
        validation: {
          messages: {
            required: 'product.notification.edit.form.price.error.required',
          },
        },
      },
      {
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
      },
    ];
  }
}
