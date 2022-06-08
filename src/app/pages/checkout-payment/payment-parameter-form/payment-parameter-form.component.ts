import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

@Component({
  selector: 'ish-payment-parameter-form',
  templateUrl: './payment-parameter-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentParameterFormComponent implements OnInit, OnChanges {
  @Input() parentForm: FormGroup;
  @Input() paymentMethod: PaymentMethod;
  @Input() submitDisabled: boolean;
  /**
   * should be set to true by the parent, if component is visible
   */
  @Input() activated = false;

  @Output() cancelPayment = new EventEmitter();
  @Output() submitPayment = new EventEmitter();

  fields: FormlyFieldConfig[];
  model: { [key: string]: unknown } = {};
  form = new FormGroup({});

  ngOnInit() {
    this.fields = [];
    this.paymentMethod.parameters.forEach(param => this.fields.push({ ...param }));
    this.fields.forEach(field => (this.model[field.key as string] = field.templateOptions?.options ? undefined : ''));
  }

  /**
   * load concardis script if component is shown
   */
  ngOnChanges() {
    if (this.paymentMethod && this.activated) {
      this.parentForm.setControl('parameters', this.form);
    }
  }

  cancelNewPaymentInstrument() {
    this.cancelPayment.emit();
  }

  submitParameterForm() {
    this.submitPayment.emit();
  }
}
