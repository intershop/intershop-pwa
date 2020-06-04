import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, map, mapTo, withLatestFrom } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { Link } from 'ish-core/models/link/link.model';
import { PaymentInstrumentData } from 'ish-core/models/payment-instrument/payment-instrument.interface';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import {
  PaymentMethodBaseData,
  PaymentMethodOptionsDataType,
} from 'ish-core/models/payment-method/payment-method.interface';
import { PaymentMethodMapper } from 'ish-core/models/payment-method/payment-method.mapper';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { Payment } from 'ish-core/models/payment/payment.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getCurrentLocale } from 'ish-core/store/core/configuration';

/**
 * The Payment Service handles the interaction with the 'baskets' and 'users' REST API concerning payment functionality.
 */
@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private apiService: ApiService, private store: Store, private appFacade: AppFacade) {}

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
        withLatestFrom(this.store.pipe(select(getCurrentLocale))),
        concatMap(([pm, currentLocale]) =>
          this.sendRedirectUrlsIfRequired(pm, paymentInstrument, basketId, currentLocale && currentLocale.lang)
        )
      );
  }

  /**
   *  Checks, if RedirectUrls are requested by the server and sends them if it is necessary.
   * @param pm                The payment method to determine if redirect is required.
   * @param paymentInstrument The payment instrument id.
   * @param basketId          The basket id.
   * @param lang              The language code of the current locale, e.g. en_US
   * @returns                 The payment instrument id.
   */
  private sendRedirectUrlsIfRequired(
    pm: PaymentMethodBaseData,
    paymentInstrument: string,
    basketId: string,
    lang: string
  ): Observable<string> {
    const loc = location.origin;
    if (!pm || !pm.capabilities || !pm.capabilities.some(data => ['RedirectBeforeCheckout'].includes(data))) {
      return of(paymentInstrument);
      // send redirect urls if there is a redirect required
    } else {
      const redirect = {
        successUrl: `${loc}/checkout/review;lang=${lang}?redirect=success`,
        cancelUrl: `${loc}/checkout/payment;lang=${lang}?redirect=cancel`,
        failureUrl: `${loc}/checkout/payment;lang=${lang}?redirect=failure`,
      };

      if (pm.capabilities.some(data => ['RedirectAfterCheckout'].includes(data))) {
        // *OrderID* will be replaced by the ICM server
        redirect.successUrl = `${loc}/checkout/receipt;lang=${lang}?redirect=success&orderId=*orderID*`;
        redirect.cancelUrl = `${loc}/checkout/payment;lang=${lang}?redirect=cancel&orderId=*orderID*`;
        redirect.failureUrl = `${loc}/checkout/payment;lang=${lang}?redirect=failure&orderId=*orderID*`;
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
  updateBasketPayment(basketId: string, params: { [key: string]: string }): Observable<Payment> {
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
   * Deletes a (basket/user) payment instrument.
   * If the payment instrument is used at basket the related payment is also deleted from the selected basket.
   * @param basket            The basket.
   * @param paymentInstrument The payment instrument, that is to be deleted
   */
  deleteBasketPaymentInstrument(basket: Basket, paymentInstrument: PaymentInstrument): Observable<void> {
    if (!basket) {
      return throwError('deleteBasketPayment() called without basket');
    }
    if (!paymentInstrument) {
      return throwError('deleteBasketPayment() called without paymentInstrument');
    }

    const deletePayment =
      basket.payment &&
      basket.payment.paymentInstrument &&
      basket.payment.paymentInstrument.id === paymentInstrument.id;

    // user payment instrument
    if (paymentInstrument.urn && paymentInstrument.urn.includes('user')) {
      return this.deleteUserPaymentInstrument('-', paymentInstrument.id).pipe(
        concatMap(() => (deletePayment ? this.deleteBasketPayment(basket) : of(undefined)))
      );
    }

    // basket payment instrument, payment will be deleted automatically, if necessary
    return this.apiService.delete(`baskets/${basket.id}/payment-instruments/${paymentInstrument.id}`, {
      headers: this.basketHeaders,
    });
  }

  /**
   * Deletes the basket payment.
   * @param basket          The basket.
   */
  deleteBasketPayment(basket: Basket): Observable<void> {
    if (!basket) {
      return throwError('deleteBasketPayment() called without basket');
    }
    if (!basket.payment) {
      return of();
    }

    return this.apiService.delete(`baskets/${basket.id}/payments/${basket.payment.id}`, {
      headers: this.basketHeaders,
    });
  }

  /**
   * Gets the payment data of the customer.
   * @param customer  The customer data.
   * @returns         The customer's payments.
   */
  getUserPaymentMethods(customer: Customer): Observable<PaymentMethod[]> {
    if (!customer) {
      return throwError('getUserPaymentMethods called without required body data');
    }

    return this.appFacade.customerRestResource$.pipe(
      concatMap(restResource =>
        this.apiService.get(`${restResource}/${customer.customerNo}/payments`).pipe(
          unpackEnvelope<Link>(),
          this.apiService.resolveLinks<PaymentInstrumentData>(),
          concatMap(instruments =>
            this.apiService.options(`${restResource}/${customer.customerNo}/payments`).pipe(
              unpackEnvelope<PaymentMethodOptionsDataType>('methods'),
              map(methods => PaymentMethodMapper.fromOptions({ methods, instruments }))
            )
          )
        )
      )
    );
  }

  /**
   * Creates a payment instrument at the customer.
   * @param customerNo          The customer data.
   * @param paymentInstrument   The payment instrument data.
   * @returns                   The created payment instrument.
   */
  createUserPayment(customerNo: string, paymentInstrument: PaymentInstrument): Observable<PaymentInstrument> {
    if (!customerNo) {
      return throwError('createUserPayment called without required customer number');
    }
    if (!paymentInstrument) {
      return throwError('createUserPayment called without required payment instrument');
    }

    if (!paymentInstrument.parameters || !paymentInstrument.parameters.length) {
      return throwError('createUserPayment called without required payment parameters');
    }

    const body: {
      name: string;
      parameters?: {
        key: string;
        property: string;
      }[];
    } = {
      name: paymentInstrument.paymentMethod,
      parameters: paymentInstrument.parameters.map(attr => ({ key: attr.name, property: attr.value })),
    };

    return this.appFacade.customerRestResource$.pipe(
      concatMap(restResource =>
        this.apiService
          .post(`${restResource}/${customerNo}/payments`, body)
          .pipe(this.apiService.resolveLink<PaymentInstrument>())
      )
    );
  }

  /**
   * Deletes a payment instrument and the related payment from the given user.
   * @param customerNo            The customer number.
   * @param paymentInstrumentId   The (uu)id of the payment instrument.
   */
  deleteUserPaymentInstrument(customerNo: string, paymentInstrumentId: string): Observable<void> {
    if (!customerNo) {
      return throwError('deleteUserPayment() called without customerNo');
    }
    if (!paymentInstrumentId) {
      return throwError('deleteUserPayment() called without paymentInstrumentId');
    }

    return this.appFacade.customerRestResource$.pipe(
      concatMap(restResource =>
        this.apiService.delete<void>(`${restResource}/${customerNo}/payments/${paymentInstrumentId}`)
      )
    );
  }
}
