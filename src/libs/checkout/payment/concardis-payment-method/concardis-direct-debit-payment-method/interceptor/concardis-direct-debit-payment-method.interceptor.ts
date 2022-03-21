import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { paymentMethodInterceptorFactory } from '@intershop-pwa/checkout/payment/payment-method-base/utils/utils';

import { PaymentMethodData } from 'ish-core/models/payment-method/payment-method.interface';

@Injectable()
export class ConcardisDirectDebitPaymentMethodInterceptor implements HttpInterceptor {
  intercept = paymentMethodInterceptorFactory(body => this.mapEligiblePaymentMethods(body));

  private mapEligiblePaymentMethods(body: PaymentMethodData): PaymentMethodData {
    if (body.data?.length) {
      return {
        ...body,
        data: body.data.map(paymentMethod =>
          paymentMethod.serviceID === 'Concardis_DirectDebit'
            ? {
                ...paymentMethod,
                hostedPaymentPageParameters: this.mapSEPAMandateInformation(paymentMethod.hostedPaymentPageParameters),
              }
            : paymentMethod
        ),
      };
    }

    return body;
  }

  /**
   * convenience method to restructure concardis sepa mandate hosted payment page parameter
   */
  private mapSEPAMandateInformation(
    hostedPaymentPageParameters: { name: string; value: string }[]
  ): { name: string; value: string }[] {
    const mandateEntry = hostedPaymentPageParameters.find(p => p.name === 'Concardis_SEPA_Mandate');

    if (typeof mandateEntry.value !== 'string') {
      const sepaMandateArray = mandateEntry.value as {
        mandateId: string;
        mandateText: string;
        directDebitType: string;
      };
      hostedPaymentPageParameters.push({ name: 'mandateId', value: sepaMandateArray.mandateId });
      hostedPaymentPageParameters.push({ name: 'mandateText', value: sepaMandateArray.mandateText });
      hostedPaymentPageParameters.push({ name: 'directDebitType', value: sepaMandateArray.directDebitType });
    }

    return hostedPaymentPageParameters;
  }
}
