import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'ish-product-notification-edit-form',
  templateUrl: './product-notification-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNotificationEditFormComponent {
  @Input() productNotificationForm: FormGroup;
  fields: FormlyFieldConfig[];

  ngOnInit() {
    this.fields = [
      {
        key: 'nonotification',
        type: 'ish-radio-field',
        templateOptions: {
          label: 'product.notification.edit.form.no_notification.label',
          inputClass: 'position-static',
          fieldClass: ' ',
          value: 'NoNotification',
        },
      },
      {
        key: 'instocknotification',
        type: 'ish-radio-field',
        templateOptions: {
          label: 'product.notification.edit.form.instock_notification.label',
          inputClass: 'position-static',
          fieldClass: ' ',
          value: 'InStockNotification',
        },
      },
      {
        key: 'email',
        type: 'ish-email-field',
        templateOptions: {
          label: 'product.notification.edit.form.email.label',
          required: true,
          hideRequiredMarker: true,
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
