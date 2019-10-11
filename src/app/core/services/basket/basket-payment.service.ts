import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, map, mapTo } from 'rxjs/operators';

import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethodBaseData } from 'ish-core/models/payment-method/payment-method.interface';
import { PaymentMethodMapper } from 'ish-core/models/payment-method/payment-method.mapper';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { Payment } from 'ish-core/models/payment/payment.model';
import { ApiService } from 'ish-core/services/api/api.service';

/**
 * The Basket Service handles the interaction with the 'baskets' REST API.
 */
@Injectable({ providedIn: 'root' })
export class BasketPaymentService {
  constructor(private apiService: ApiService) {}

  // http header for Basket API v1
  private basketHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.basket.v1+json',
  });

  /**
   * Get eligible payment methods for selected basket.
   * @param basketId  The basket id.
   * @returns         The eligible payment methods.
   */
  getBasketEligiblePaymentMethods(basketId: string): Observable<PaymentMethod[]> {
    if (!basketId) {
      return throwError('getBasketEligiblePaymentMethods() called without basketId');
    }

    const params = new HttpParams().set('include', 'paymentInstruments');

    return this.apiService
      .get(`baskets/${basketId}/eligible-payment-methods`, {
        headers: this.basketHeaders,
        params,
      })
      .pipe(map(PaymentMethodMapper.fromData));
  }

  /**
   * Adds a payment at the selected basket. If redirect is required the redirect urls are saved at basket in dependence of the payment instrument capabilities (redirectBeforeCheckout/RedirectAfterCheckout).
   * @param basketId          The basket id.
   * @param paymentInstrument The unique name of the payment method, e.g. ISH_INVOICE
   * @returns                 The payment instrument.
   */
  setBasketPayment(basketId: string, paymentInstrument: string): Observable<string> {
    if (!basketId) {
      return throwError('setBasketPayment() called without basketId');
    }
    if (!paymentInstrument) {
      return throwError('setBasketPayment() called without paymentInstrument');
    }

    return this.apiService
      .put<{ data: PaymentInstrument; included: { paymentMethod: { [id: string]: PaymentMethodBaseData } } }>(
        `baskets/${basketId}/payments/open-tender?include=paymentMethod`,
        { paymentInstrument },
        {
          headers: this.basketHeaders,
        }
      )
      .pipe(
        map(({ data, included }) =>
          data && data.paymentMethod && included ? included.paymentMethod[data.paymentMethod] : undefined
        ),
        concatMap(pm => {
          if (
            !pm ||
            !pm.capabilities ||
            !pm.capabilities.some(data => ['RedirectBeforeCheckout'].includes(data)) // ToDo: add RedirectAfterCheckout here, if placeholders are supported by the ICM server
          ) {
            return of(paymentInstrument);
            // send redirect urls if there is a redirect required
          } else {
            const redirect = {
              successUrl: `${location.origin}/checkout/review?redirect=success`,
              cancelUrl: `${location.origin}/checkout/payment?redirect=cancel`,
              failureUrl: `${location.origin}/checkout/payment?redirect=failure`,
            };

            if (pm.capabilities.some(data => ['RedirectAfterCheckout'].includes(data))) {
              redirect.successUrl = `${location.origin}/checkout/receipt?redirect=success&orderId=*orderID*`; // *OrderID* will be replaced by the ICM server
              redirect.cancelUrl = `${location.origin}/checkout/payment?redirect=cancel&orderId=*orderID*`;
              redirect.failureUrl = `${location.origin}/checkout/payment?redirect=failure&orderId=*orderID*`;
            }

            const body = {
              paymentInstrument,
              redirect,
            };

            return this.apiService
              .put(`baskets/${basketId}/payments/open-tender`, body, {
                headers: this.basketHeaders,
              })
              .pipe(mapTo(paymentInstrument));
          }
        })
      );
  }

  /**
   * Creates a payment instrument for the selected basket.
   * @param basketId          The basket id.
   * @param paymentInstrument The payment instrument with parameters, id=undefined, paymentMethod= required.
   * @returns                 The created payment instrument.
   */
  createBasketPayment(basketId: string, paymentInstrument: PaymentInstrument): Observable<PaymentInstrument> {
    if (!basketId) {
      return throwError('createBasketPayment() called without basketId');
    }
    if (!paymentInstrument) {
      return throwError('createBasketPayment() called without paymentInstrument');
    }
    if (!paymentInstrument.paymentMethod) {
      return throwError('createBasketPayment() called without paymentMethodId');
    }

    return this.apiService
      .post(`baskets/${basketId}/payment-instruments?include=paymentMethod`, paymentInstrument, {
        headers: this.basketHeaders,
      })
      .pipe(map(({ data }) => data));
  }

  /**
   * Updates a payment for the selected basket. Used to set redirect query parameters and status after redirect.
   * @param basketId          The basket id.
   * @param redirect          The payment redirect information (parameters and status).
   * @returns                 The updated payment.
   */
  updateBasketPayment(basketId: string, params: Params): Observable<Payment> {
    if (!basketId) {
      return throwError('createBasketPayment() called without basketId');
    }

    if (!params) {
      return throwError('updateBasketPayment() called without parameter data');
    }

    if (!params.redirect) {
      return throwError('updateBasketPayment() called without redirect parameter data');
    }

    const redirect = {
      status: params.redirect.toUpperCase(),
      parameters: Object.entries(params)
        .filter(([name]) => name !== 'redirect')
        .map(([name, value]) => ({ name, value })),
    };

    return this.apiService
      .patch(
        `baskets/${basketId}/payments/open-tender`,
        { redirect },
        {
          headers: this.basketHeaders,
        }
      )
      .pipe(map(({ data }) => data));
  }

  /**
   * Deletes a payment instrument and the related payment from the selected basket.
   * @param basketId          The basket id.
   * @param paymentId         The (uu)id of the payment instrument
   */
  deleteBasketPaymentInstrument(basketId: string, paymentInstrumentId: string): Observable<void> {
    if (!basketId) {
      return throwError('deleteBasketPayment() called without basketId');
    }
    if (!paymentInstrumentId) {
      return throwError('deleteBasketPayment() called without paymentInstrumentId');
    }

    return this.apiService.delete(`baskets/${basketId}/payment-instruments/${paymentInstrumentId}`, {
      headers: this.basketHeaders,
    });
  }
}
