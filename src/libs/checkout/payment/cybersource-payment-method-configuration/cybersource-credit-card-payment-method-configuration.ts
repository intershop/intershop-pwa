import { Injectable } from '@angular/core';
import { PaymentMethodConfiguration } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.interface';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class CybersourceCreditCardPaymentMethodConfiguration implements PaymentMethodConfiguration {
  id = 'CyberSource_CreditCard';

  getFormlyFieldConfig$(): Observable<FormlyFieldConfig> {
    return of({
      type: 'cybersource-params',
      key: 'paymentMethodSelect',
      wrappers: ['ish-payment-method-wrapper', 'form-field-checkbox-horizontal'],
      templateOptions: {
        paymentMethodId: this.id,
        inputClass: 'form-check-input',
      },
    });
  }
}
