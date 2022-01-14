import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

@Component({
  selector: 'ish-payment-payone-ideal',
  templateUrl: './payment-payone-ideal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPayoneIdealComponent implements OnInit {
  /**
   * payone payment method, needed to get configuration parameters
   */
  @Input() paymentMethod: PaymentMethod;

  /**
   * should be set to true by the parent, if component is visible
   */
  @Input() activated = false;

  @Output() cancelPayment = new EventEmitter<void>();
  @Output() submitPayment = new EventEmitter<{ parameters: Attribute<string>[]; saveAllowed: boolean }>();

  payoneIDealForm: FormGroup;
  fieldConfig: FormlyFieldConfig[];

  ngOnInit() {
    this.payoneIDealForm = new FormGroup({});
    this.fieldConfig = [
      {
        type: 'ish-select-field',
        key: 'bankGroup',
        templateOptions: {
          required: true,
          label: 'checkout.bankGroup.label',
          options: this.getBankGroupOptions(),
          validation: {
            messages: {
              required: 'checkout.bankGroup.error.required',
            },
          },
        },
      },
    ];
  }

  private getBankGroupOptions() {
    // fetching bank group options for ideal
    const bankGroupOptions: SelectOption[] = this.paymentMethod.hostedPaymentPageParameters?.map(param => ({
      value: param.name,
      label: param.value,
    }));
    // sorting the options by bank name
    bankGroupOptions?.sort((a, b) => a.value.localeCompare(b.value));
    return bankGroupOptions;
  }

  /**
   * cancel new payment instrument and hides the form
   */
  cancelNewPaymentInstrument() {
    this.cancelPayment.emit();
  }

  /**
   * submit payone ideal payment form
   */
  submitNewPaymentInstrument() {
    if (this.payoneIDealForm.invalid) {
      markAsDirtyRecursive(this.payoneIDealForm);
      return;
    } else {
      this.submitPayment.emit({
        parameters: [{ name: 'bankGroupCode', value: this.payoneIDealForm.get('bankGroup').value }],
        saveAllowed: this.paymentMethod.saveAllowed && this.payoneIDealForm.get('saveForLater').value,
      });
    }
  }
}
