import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

/**
 * The Payment Save Checkbox Component displays a save-for-later checkbox if the saveAllowed flag is set at the provided payment method.
 * It adds a form control 'saveForLater' at the given form that contains the result of the user's input.
 */
@Component({
  selector: 'ish-payment-save-checkbox',
  templateUrl: './payment-save-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentSaveCheckboxComponent implements OnInit {
  @Input() paymentMethod: PaymentMethod;
  @Input() form: FormGroup;

  fields: FormlyFieldConfig[];
  model = { saveForLater: true };

  ngOnInit() {
    if (!this.form) {
      throw new Error('required input parameter <form> is missing for PaymentSaveCheckboxComponent');
    }

    this.fields = this.getFields();
  }

  private getFields() {
    return [
      {
        key: 'saveForLater',
        type: 'ish-checkbox-field',
        templateOptions: {
          label: 'checkout.save_edit.checkbox.label',
        },
      },
    ];
  }
}
