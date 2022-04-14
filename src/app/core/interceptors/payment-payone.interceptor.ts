import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { PaymentMethodBaseData, PaymentMethodData } from 'ish-core/models/payment-method/payment-method.interface';

@Injectable()
export class PaymentPayoneInterceptor implements HttpInterceptor {
  /**
   * Map eligible payment method data for specified payone payment methods
   *
   * @param body : The response body
   * @returns The mapped response body
   */
  private mapEligiblePaymentMethods(body: PaymentMethodData): PaymentMethodData {
    if (body.data?.length) {
      return {
        ...body,
        data: body.data.map(paymentMethod =>
          paymentMethod.serviceID === 'Payone_IDeal' || paymentMethod.serviceID === 'Payone_Eps'
            ? this.mapPayoneBankGroupParameters(paymentMethod)
            : paymentMethod
        ),
      };
    }

    return body;
  }

  /**
   * Map Payone Ideal and EPS Bank group options, provide an error message key for the required validator
   * This workaround will be obsolete if the REST api comply with the correct data format
   *
   * @param paymentMethod The iDeal or EPS payment method data
   * @returns The mapped payment method data
   */
  private mapPayoneBankGroupParameters(paymentMethod: PaymentMethodBaseData): PaymentMethodBaseData {
    const options = paymentMethod.hostedPaymentPageParameters?.map(param => ({
      displayName: param.value,
      id: param.name,
    }));

    const parameterDefinitions = paymentMethod.parameterDefinitions?.map(data => {
      const constraints = data.constraints.required
        ? { ...data.constraints, required: { message: 'checkout.bankGroup.error.required' } }
        : data.constraints;
      return data.name === 'bankGroupCode' ? { ...data, constraints, options } : data;
    });

    return { ...paymentMethod, parameterDefinitions };
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse && event.url.includes('/eligible-payment-methods')) {
          return event.clone({ body: this.mapEligiblePaymentMethods(event.body) });
        }
        return event;
      })
    );
  }
}
