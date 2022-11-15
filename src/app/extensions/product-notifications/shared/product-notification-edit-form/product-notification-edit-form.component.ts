import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'ish-product-notification-edit-form',
  templateUrl: './product-notification-edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNotificationEditFormComponent {
  notificationEditForm = new UntypedFormGroup({});
  fields: FormlyFieldConfig[];

  ngOnInit() {
    this.fields = [
      {
        key: 'nonotification',
        type: 'ish-radio-field',
        templateOptions: {
          label: 'product.notification.edit.form.nonotification.label',
          value: 'NoNotification',
        },
      },
      {
        key: 'instocknotification',
        type: 'ish-radio-field',
        templateOptions: {
          label: 'product.notification.edit.form.instocknotification.label',
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

  submitForm() {}
}
