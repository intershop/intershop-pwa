import { APP_BASE_HREF } from '@angular/common';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, first, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

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
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * The Payment Service handles the interaction with the 'baskets' and 'users' REST API concerning payment functionality.
 */
@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(
    private apiService: ApiService,
    private store: Store,
    private appFacade: AppFacade,
    @Inject(APP_BASE_HREF) private baseHref: string
  ) {}

  private basketHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.basket.v1+json',
  });

  /**
   * Get eligible payment methods for selected basket.
   *
   * @returns         The eligible payment methods.
   */
  getBasketEligiblePaymentMethods(): Observable<PaymentMethod[]> {
    const params = new HttpParams().set('include', 'paymentInstruments');

    return this.apiService
      .currentBasketEndpoint()
      .get('eligible-payment-methods', {
        headers: this.basketHeaders,
        params,
      })
      .pipe(map(PaymentMethodMapper.fromData));
  }

  /**
   * Adds a fast checkout payment at the selected basket and generate redirect url in one step/request.
   *
   * @param paymentInstrument The payment instrument id.
   * @returns                 The necessary url for redirecting to payment provider.
   */
  setBasketFastCheckoutPayment(paymentInstrument: string): Observable<string> {
    if (!paymentInstrument) {
      return throwError(() => new Error('setBasketFastCheckoutPayment() called without paymentInstrument'));
    }
    const loc = `${location.origin}${this.baseHref}`;

    return this.store.pipe(select(getCurrentLocale)).pipe(
      whenTruthy(),
      take(1),
      switchMap(currentLocale => {
        const body = {
          paymentInstrument,
          redirect: {
            successUrl: `${loc}/checkout/review;lang=${currentLocale}?redirect=success`,
            cancelUrl: `${loc}/basket;lang=${currentLocale}?redirect=cancel`,
            failureUrl: `${loc}/basket;lang=${currentLocale}?redirect=cancel`,
          },
        };

        return this.apiService
          .currentBasketEndpoint()
          .put<{
            data: {
              redirect: {
                redirectUrl: string;
              };
            };
          }>('payments/open-tender', body, {
            headers: this.basketHeaders,
          })
          .pipe(map(payload => payload.data.redirect.redirectUrl));
      })
    );
  }

  /**
   * Adds a payment at the selected basket. If redirect is required the redirect urls are saved at basket in dependence of the payment instrument capabilities (redirectBeforeCheckout/RedirectAfterCheckout).
   *
   * @param paymentInstrument The unique name of the payment method, e.g. ISH_INVOICE
   * @returns                 The payment instrument.
   */
  setBasketPayment(paymentInstrument: string): Observable<string> {
    if (!paymentInstrument) {
      return throwError(() => new Error('setBasketPayment() called without paymentInstrument'));
    }

    const params = new HttpParams().set('include', 'paymentMethod');
    return this.apiService
      .currentBasketEndpoint()
      .put<{ data: PaymentInstrument; included: { paymentMethod: { [id: string]: PaymentMethodBaseData } } }>(
        'payments/open-tender',
        { paymentInstrument },
        { headers: this.basketHeaders, params }
      )
      .pipe(
        map(({ data, included }) =>
          data?.paymentMethod && included ? included.paymentMethod[data.paymentMethod] : undefined
        ),
        withLatestFrom(this.store.pipe(select(getCurrentLocale))),
        concatMap(([pm, currentLocale]) => this.sendRedirectUrlsIfRequired(pm, paymentInstrument, currentLocale))
      );
  }

  /**
   *  Checks, if RedirectUrls are requested by the server and sends them if it is necessary.
   *
   * @param pm                The payment method to determine if redirect is required.
   * @param paymentInstrument The payment instrument id.
   * @param lang              The language code of the current locale, e.g. en_US
   * @returns                 The payment instrument id.
   */
  private sendRedirectUrlsIfRequired(
    pm: PaymentMethodBaseData,
    paymentInstrument: string,
    lang: string
  ): Observable<string> {
    if (!pm?.capabilities || !pm.capabilities.some(data => ['RedirectBeforeCheckout'].includes(data))) {
      return of(paymentInstrument);
      // send redirect urls if there is a redirect required
    } else {
      const loc = `${location.origin}${this.baseHref}`;
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

      const body = { paymentInstrument, redirect };

      return this.apiService
        .currentBasketEndpoint()
        .put('payments/open-tender', body, { headers: this.basketHeaders })
        .pipe(map(() => paymentInstrument));
    }
  }
  /**
   * Creates a payment instrument for the selected basket.
   *
   * @param paymentInstrument The payment instrument with parameters, id=undefined, paymentMethod= required.
   * @returns                 The created payment instrument.
   */
  createBasketPayment(paymentInstrument: PaymentInstrument): Observable<PaymentInstrument> {
    if (!paymentInstrument) {
      return throwError(() => new Error('createBasketPayment() called without paymentInstrument'));
    }
    if (!paymentInstrument.paymentMethod) {
      return throwError(() => new Error('createBasketPayment() called without paymentMethodId'));
    }

    const params = new HttpParams().set('include', 'paymentMethod');
    return this.apiService
      .currentBasketEndpoint()
      .post<{ data: PaymentInstrument }>('payment-instruments', paymentInstrument, {
        headers: this.basketHeaders,
        params,
      })
      .pipe(map(({ data }) => data));
  }

  /**
   * Updates a payment for the selected basket. Used to set redirect query parameters and status after redirect.
   *
   * @param redirect          The payment redirect information (parameters and status).
   * @returns                 The updated payment.
   */
  updateBasketPayment(params: { [key: string]: string }): Observable<Payment> {
    if (!params) {
      return throwError(() => new Error('updateBasketPayment() called without parameter data'));
    }

    if (!params.redirect) {
      return throwError(() => new Error('updateBasketPayment() called without redirect parameter data'));
    }

    const redirect = {
      status: params.redirect.toUpperCase(),
      parameters: Object.entries(params)
        .filter(([name]) => name !== 'redirect')
        .map(([name, value]) => ({ name, value })),
    };

    return this.apiService
      .currentBasketEndpoint()
      .patch('payments/open-tender', { redirect }, { headers: this.basketHeaders })
      .pipe(map(({ data }) => data));
  }

  /**
   * Deletes a (basket/user) payment instrument.
   * If the payment instrument is used at basket the related payment is also deleted from the selected basket.
   *
   * @param basket            The basket.
   * @param paymentInstrument The payment instrument, that is to be deleted
   */
  deleteBasketPaymentInstrument(basket: Basket, paymentInstrument: PaymentInstrument): Observable<void> {
    if (!basket) {
      return throwError(() => new Error('deleteBasketPayment() called without basket'));
    }
    if (!paymentInstrument) {
      return throwError(() => new Error('deleteBasketPayment() called without paymentInstrument'));
    }

    const deletePayment = basket.payment?.paymentInstrument?.id === paymentInstrument.id;

    // user payment instrument
    if (paymentInstrument.urn?.includes('user')) {
      return this.deleteUserPaymentInstrument('-', paymentInstrument.id).pipe(
        concatMap(() => (deletePayment ? this.deleteBasketPayment(basket) : of(undefined)))
      );
    }

    // basket payment instrument, payment will be deleted automatically, if necessary
    return this.apiService.delete(
      `baskets/${this.apiService.encodeResourceId(basket.id)}/payment-instruments/${this.apiService.encodeResourceId(
        paymentInstrument.id
      )}`,
      { headers: this.basketHeaders }
    );
  }

  /**
   * Deletes the basket payment.
   *
   * @param basket          The basket.
   */
  deleteBasketPayment(basket: Basket): Observable<void> {
    if (!basket) {
      return throwError(() => new Error('deleteBasketPayment() called without basket'));
    }
    if (!basket.payment) {
      return of();
    }

    return this.apiService.delete(
      `baskets/${this.apiService.encodeResourceId(basket.id)}/payments/${this.apiService.encodeResourceId(
        basket.payment.id
      )}`,
      { headers: this.basketHeaders }
    );
  }

  /**
   * Gets the payment data of the customer.
   *
   * @param customer  The customer data.
   * @returns         The customer's payments.
   */
  getUserPaymentMethods(customer: Customer): Observable<PaymentMethod[]> {
    if (!customer) {
      return throwError(() => new Error('getUserPaymentMethods called without required body data'));
    }

    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService.get(`${restResource}/${this.apiService.encodeResourceId(customer.customerNo)}/payments`).pipe(
          unpackEnvelope<Link>(),
          this.apiService.resolveLinks<PaymentInstrumentData>(),
          concatMap(instruments =>
            this.apiService
              // replace the get request by an options request if your ICM version is lower than 11.10.0
              // .options(`${restResource}/${this.apiService.encodeResourceId(customer.customerNo)}/payments`)
              .get(`${restResource}/${this.apiService.encodeResourceId(customer.customerNo)}/eligible-payment-methods`)
              .pipe(
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
   *
   * @param customerNo          The customer data.
   * @param paymentInstrument   The payment instrument data.
   * @returns                   The created payment instrument.
   */
  createUserPayment(customerNo: string, paymentInstrument: PaymentInstrument): Observable<PaymentInstrument> {
    if (!customerNo) {
      return throwError(() => new Error('createUserPayment called without required customer number'));
    }
    if (!paymentInstrument?.paymentMethod) {
      return throwError(() => new Error('createUserPayment called without required valid payment instrument'));
    }

    const body: {
      name: string;
      parameters?: {
        key: string;
        property: string;
      }[];
    } = {
      name: paymentInstrument.paymentMethod,
      parameters: paymentInstrument.parameters?.length
        ? paymentInstrument.parameters.map(attr => ({ key: attr.name, property: attr.value }))
        : undefined,
    };

    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService
          .post(`${restResource}/${this.apiService.encodeResourceId(customerNo)}/payments`, body)
          .pipe(this.apiService.resolveLink<PaymentInstrument>())
      )
    );
  }

  /**
   * Deletes a payment instrument and the related payment from the given user.
   *
   * @param customerNo            The customer number.
   * @param paymentInstrumentId   The (uu)id of the payment instrument.
   */
  deleteUserPaymentInstrument(customerNo: string, paymentInstrumentId: string): Observable<void> {
    if (!customerNo) {
      return throwError(() => new Error('deleteUserPayment() called without customerNo'));
    }
    if (!paymentInstrumentId) {
      return throwError(() => new Error('deleteUserPayment() called without paymentInstrumentId'));
    }

    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService.delete<void>(
          `${restResource}/${this.apiService.encodeResourceId(customerNo)}/payments/${this.apiService.encodeResourceId(
            paymentInstrumentId
          )}`
        )
      )
    );
  }

  /**
   * Update CvcLastUpdated in concardis credit card (user/basket) payment instrument.
   *
   * @param paymentInstrument The payment instrument, that is to be updated
   */
  updateConcardisCvcLastUpdated(paymentInstrument: PaymentInstrument): Observable<PaymentInstrument> {
    if (!paymentInstrument) {
      return throwError(() => new Error('updateConcardisCvcLastUpdated() called without paymentInstrument'));
    }

    if (paymentInstrument.urn?.includes('basket')) {
      // update basket payment instrument
      const body: {
        parameters?: {
          name: string;
          value: string;
        }[];
      } = {
        parameters: paymentInstrument.parameters
          .filter(attr => attr.name === 'cvcLastUpdated')
          .map(attr => ({ name: attr.name, value: attr.value })),
      };

      return this.apiService
        .currentBasketEndpoint()
        .patch<{ data: PaymentInstrument }>(
          `payment-instruments/${this.apiService.encodeResourceId(paymentInstrument.id)}`,
          body,
          { headers: this.basketHeaders }
        )
        .pipe(map(({ data }) => data));
    } else {
      // update user payment instrument
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

      return this.apiService
        .put(`customers/-/payments/${this.apiService.encodeResourceId(paymentInstrument.id)}`, body)
        .pipe(map(() => paymentInstrument));
    }
  }
}
