import { Inject, Injectable } from '@angular/core';
import { PaymentMethodFacade } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method-facade/payment-method.facade';
import {
  PAYMENT_METHOD_CALLBACK,
  PaymentMethodCallback,
} from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.callback.interface';
import { PaymentMethodConfiguration } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.interface';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, filter, map } from 'rxjs';

@Injectable()
export class DefaultPaymentMethodConfigurationComponent implements PaymentMethodConfiguration {
  constructor(
    @Inject(PAYMENT_METHOD_CALLBACK) private paymentMethodCallbacks: PaymentMethodCallback[],
    private paymentMethodFacade: PaymentMethodFacade
  ) {}
  id = 'DEFAULT';
  getFormlyFieldConfig$(paymentMethodId: string): Observable<FormlyFieldConfig> {
    return this.paymentMethodFacade.getPaymentMethodById$(paymentMethodId).pipe(
      filter(x => !!x),
      map(paymentMethod => {
        if (!paymentMethod.parameters && !paymentMethod.isRestricted) {
          return {
            type: 'ish-radio-field',
            key: 'paymentMethodSelect',
            wrappers: ['ish-payment-method-wrapper', 'form-field-checkbox-horizontal'],
            templateOptions: {
              paymentMethodId,
              label: 'checkout.payment.payWith.link',
              args: { '0': paymentMethod.displayName },
              inputClass: 'form-check-input',
              value: paymentMethod.id,
            },
          };
        }

        if (paymentMethod.parameters?.length) {
          const parameters: FormlyFieldConfig[] = [];
          paymentMethod.parameters.forEach(param => parameters.push({ ...param }));

          return {
            type: 'ish-fieldset-field',
            wrappers: ['ish-payment-method-wrapper'],
            fieldGroup: [
              ...(paymentMethod.paymentInstruments?.map(paymentInstrument => ({
                type: 'ish-radio-field',
                key: 'paymentMethodSelect',
                wrappers: ['form-field-checkbox-horizontal', 'ish-payment-instruments-delete-wrapper'],
                templateOptions: {
                  paymentInstrument,
                  label: paymentInstrument.accountIdentifier,
                  inputClass: 'form-check-input',
                  value: paymentInstrument.id,
                },
              })) ?? []),
              {
                type: 'ish-payment-parameters-type',
                key: 'payment-parameters',
                fieldGroup: [
                  ...parameters,
                  {
                    key: 'saveForLater',
                    type: 'ish-checkbox-field',
                    defaultValue: true,
                    templateOptions: {
                      label: 'checkout.save_edit.checkbox.label',
                    },
                  },
                ],
                templateOptions: { paymentMethodId },
              },
            ],
            templateOptions: {
              childClass: 'panel section',
              paymentMethodId,
            },
          };
        }
      })
    );
  }
}
