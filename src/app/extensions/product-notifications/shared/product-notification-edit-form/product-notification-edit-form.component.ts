import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

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
  fields: FormlyFieldConfig[];

  ngOnInit() {
    this.fields = [
      {
        key: 'nonotification',
        type: 'ish-radio-field',
        templateOptions: {
          label: 'product.notification.edit.form.no_notification.label',
          fieldClass: ' ',
          value: 'NoNotification',
        },
      },
      {
        key: 'instocknotification',
        type: 'ish-radio-field',
        templateOptions: {
          label: 'product.notification.edit.form.instock_notification.label',
          fieldClass: ' ',
          value: 'InStockNotification',
        },
      },
      {
        key: 'pricenotification',
        type: 'ish-radio-field',
        templateOptions: {
          label: 'product.notification.edit.form.price_notification.label',
          fieldClass: ' ',
          value: 'PriceNotification',
        },
      },
      {
        key: 'price',
        type: 'ish-text-input-field',
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
