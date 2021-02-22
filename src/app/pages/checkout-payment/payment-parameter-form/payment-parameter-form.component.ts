import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

@Component({
  selector: 'ish-payment-parameter-form',
  templateUrl: './payment-parameter-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentParameterFormComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() paymentMethod: PaymentMethod;
  @Input() submitDisabled: boolean;

  @Output() cancel = new EventEmitter();
  @Output() submit = new EventEmitter();

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
    this.cancel.emit();
  }

  submitParameterForm() {
    this.parentForm.setControl('parameters', this.form);
    this.submit.emit();
  }
}
