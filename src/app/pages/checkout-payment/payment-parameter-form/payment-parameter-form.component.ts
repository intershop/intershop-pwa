import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';

import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

import { PaymentSaveCheckboxComponent } from '../formly/payment-save-checkbox/payment-save-checkbox.component';

@Component({
  selector: 'ish-payment-parameter-form',
  imports: [FormlyForm, PaymentSaveCheckboxComponent, TranslatePipe],
  standalone: true,
  templateUrl: './payment-parameter-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentParameterFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) parentForm: FormGroup;
  @Input({ required: true }) paymentMethod: PaymentMethod;
  @Input() submitDisabled: boolean;
  /**
   * should be set to true by the parent, if component is visible
   */
  @Input() activated = false;

  @Output() readonly cancelPayment = new EventEmitter();
  @Output() readonly submitPayment = new EventEmitter();

  fields: FormlyFieldConfig[];
  model: Record<string, unknown> = {};
  form = new FormGroup({});

  ngOnInit() {
    this.fields = [];
    this.paymentMethod.parameters.forEach(param => this.fields.push({ ...param }));
    this.fields.forEach(field => {
      if (field.key === 'IBAN') {
        field.props.mask = 'UU00 AAAA 0000 0009 9999 9999 9999 9999 99';
        field.props.placeholder = 'XX00 0000 0000 000';
        // max length of IBAN is 34, but the 8 spaces of the mask must be added
        field.props.maxLength = 42;
      } else if (field.key === 'BIC') {
        field.props.mask = 'AAAAAAAA||AAAAAAAAAAA';
      }
      this.model[field.key as string] = field.props?.options ? undefined : '';
    });
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
