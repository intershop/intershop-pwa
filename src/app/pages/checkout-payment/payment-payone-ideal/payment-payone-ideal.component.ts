import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

@Component({
  selector: 'ish-payment-payone-ideal',
  templateUrl: './payment-payone-ideal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPayoneIdealComponent implements OnInit {
  constructor(protected cd: ChangeDetectorRef) {}

  /**
   * payone payment method, needed to get configuration parameters
   */
  @Input() paymentMethod: PaymentMethod;

  /**
   * should be set to true by the parent, if component is visible
   */
  @Input() activated = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ parameters: Attribute<string>[]; saveAllowed: boolean }>();

  payoneIDealForm = new FormGroup({});

  bankGroupOptions: {
    name: string;
    value: string;
  }[];

  ngOnInit() {
    this.payoneIDealForm.addControl('bankGroup', new FormControl('', [Validators.required]));

    // fetching bank group options for ideal
    this.bankGroupOptions = this.paymentMethod.hostedPaymentPageParameters;
    // sorting the options by bank name
    if (this.bankGroupOptions) {
      this.bankGroupOptions.sort((a, b) => a.value.localeCompare(b.value));
    }
  }

  /**
   * cancel new payment instrument and hides the form
   */
  cancelNewPaymentInstrument() {
    this.cancel.emit();
  }

  /**
   * submit payone ideal payment form
   */
  submitNewPaymentInstrument() {
    if (this.payoneIDealForm.invalid) {
      markAsDirtyRecursive(this.payoneIDealForm);
    } else {
      this.submit.emit({
        parameters: [{ name: 'bankGroupCode', value: this.payoneIDealForm.get('bankGroup').value }],
        saveAllowed: this.paymentMethod.saveAllowed && this.payoneIDealForm.get('saveForLater').value,
      });
    }
    this.cd.detectChanges();
  }
}
