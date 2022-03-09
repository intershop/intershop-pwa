import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PaymentMethod } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-method.model';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'ish-payment-parameter-form',
  templateUrl: './payment-parameter-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentParameterFormComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() paymentMethod: PaymentMethod;
  @Input() submitDisabled: boolean;

  @Output() cancelPayment = new EventEmitter();
  @Output() submitPayment = new EventEmitter();

  fields: FormlyFieldConfig[];
  model: { [key: string]: unknown } = {};
  form = new FormGroup({});

  ngOnInit() {
    this.fields = [];
    this.paymentMethod.parameters.forEach(param => this.fields.push({ ...param }));
    this.fields.forEach(field => (this.model[field.key as string] = field.templateOptions?.options ? undefined : ''));
    this.parentForm.setControl('parameters', this.form);
  }

  cancelNewPaymentInstrument() {
    this.cancelPayment.emit();
  }

  submitParameterForm() {
    this.parentForm.setControl('parameters', this.form);
    this.submitPayment.emit();
  }
}
