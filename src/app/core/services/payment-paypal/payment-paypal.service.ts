import { APP_BASE_HREF } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { concatLatestFrom } from '@ngrx/operators';
import { Store, select } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { concatMap, filter, map, switchMap, take } from 'rxjs/operators';

import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentData } from 'ish-core/models/payment/payment.interface';
import { ApiService } from 'ish-core/services/api/api.service';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { getCurrentBasket } from 'ish-core/store/customer/basket';

enum ThreeDSecureDecisionStatus {
  ACCEPT = 'ACCEPT',
  DECLINE = 'DECLINE',
}

interface PaypalPaymentSourceData {
  data: {
    orderId: string;
    card?: {
      brand: string;
      expiry: string;
      lastDigits: string;
      threeDSecureDecision?: ThreeDSecureDecisionStatus;
    };
    experienceContext?: {
      cancelUrl?: string;
      returnUrl?: string;
    };
    name: string;
  };
  infos?: {
    code: string;
    message: string;
  }[];
}

/**
 * The Payment Service handles the interaction with the 'baskets' and 'users' REST API concerning payment functionality.
 */
@Injectable({ providedIn: 'root' })
export class PaymentPaypalService {
  constructor(
    private apiService: ApiService,
    private store: Store,
    private paymentService: PaymentService,
    @Inject(APP_BASE_HREF) private baseHref: string
  ) {}

  private basketHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.basket.v1+json',
  });

  initializePaypalExperienceContextFlow(
    paymentInstrument: PaymentInstrument
  ): Observable<{ paypalOrderId: string; paymentInstrumentId: string }> {
    let loc = `${location.origin}${this.baseHref}`;
    // Remove trailing slash if present
    if (loc.endsWith('/')) {
      loc = loc.slice(0, -1);
    }

    return this.paymentService.createBasketPayment(paymentInstrument).pipe(
      concatMap(pi =>
        this.paymentService.setBasketPayment(pi.id).pipe(
          concatLatestFrom(() => this.store.pipe(select(getCurrentLocale))),
          switchMap(([, currentLocale]) => {
            const body = {
              experienceContext: {
                returnUrl: `${loc}/checkout/review;lang=${currentLocale}?redirect=success`,
                cancelUrl: `${loc}/checkout/payment;lang=${currentLocale}?redirect=cancel`,
              },
            };

            return this.apiService
              .currentBasketEndpoint()
              .put<PaypalPaymentSourceData>('payments/open-tender/paypal-experience-context', body, {
                headers: this.basketHeaders,
              })
              .pipe(map(response => ({ paypalOrderId: response.data.orderId, paymentInstrumentId: pi.id })));
          })
        )
      )
    );
  }

  getPaypalPaymentInstrument(
    paymentInstrument: PaymentInstrument
  ): Observable<PaymentInstrument | { errorMessage: string }> {
    return this.apiService
      .currentBasketEndpoint()
      .get<PaypalPaymentSourceData>('payments/open-tender/paypal-experience-context', {
        headers: this.basketHeaders,
      })
      .pipe(
        map(response => {
          const paypalPaymentSourceRO = response.data;
          if (paypalPaymentSourceRO.card?.threeDSecureDecision === ThreeDSecureDecisionStatus.DECLINE) {
            return {
              errorMessage: response.infos[0].message,
            };
          }
          return {
            ...paymentInstrument,
            parameters: [
              {
                name: 'orderId',
                value: paypalPaymentSourceRO.orderId,
              },
              {
                name: 'brand',
                value: paypalPaymentSourceRO.card?.brand || '',
              },
              { name: 'expiry', value: paypalPaymentSourceRO.card?.expiry || '' },
              {
                name: 'lastDigits',
                value: paypalPaymentSourceRO.card?.lastDigits || '',
              },
              {
                name: 'cardHolder',
                value: paypalPaymentSourceRO.name || '',
              },
            ],
          };
        })
      );
  }

  /**
   * Retrieves a PayPal token for the current basket payment.
   * Uses PATCH to update an existing payment if a token already exists,
   * otherwise uses PUT to create a new payment.
   *
   * @param paymentInstrument The payment instrument ID to use for the payment.
   * @returns An Observable emitting the PayPal token string.
   */
  getPaypalToken(paymentInstrument: string): Observable<string> {
    if (!paymentInstrument) {
      return throwError(() => new Error('getPaypalToken() called without paymentInstrument'));
    }

    return this.store.pipe(select(getCurrentBasket)).pipe(
      concatLatestFrom(() => this.store.pipe(select(getCurrentLocale))),
      filter(([basket]) => !!basket),
      take(1),
      switchMap(([basket, lang]) => {
        let loc = `${location.origin}${this.baseHref}`;
        // Remove trailing slash if present
        if (loc.endsWith('/')) {
          loc = loc.slice(0, -1);
        }
        const redirect = {
          successUrl: `${loc}/checkout/review;lang=${lang}`,
          cancelUrl: `${loc}/checkout/payment;lang=${lang}?redirect=cancel`,
          failureUrl: `${loc}/checkout/payment;lang=${lang}?redirect=failure`,
        };

        const body = { paymentInstrument, redirect };

        return basket.payment?.redirectUrl?.split('token=')[1]
          ? this.refreshPaypalToken(body)
          : this.createPaypalToken(body);
      })
    );
  }

  /**
   * Creates a new PayPal token by calling the endpoint for open-tender payments with the PUT method.
   * The new token will lead to creating a new paypal order.
   *
   * @returns An Observable emitting the PayPal token string, or an empty string if no token is available.
   */
  private createPaypalToken(body: {
    paymentInstrument: string;
    redirect: { successUrl: string; cancelUrl: string; failureUrl: string };
  }): Observable<string> {
    return this.apiService
      .currentBasketEndpoint()
      .put<{ data: PaymentData }>('payments/open-tender', body, { headers: this.basketHeaders })
      .pipe(map(payment => this.getPaypalTokenFromRedirectUrl(payment.data.redirect?.redirectUrl)));
  }

  /**
   * Refreshes the PayPal token by calling the the endpoint for open-tender payments with the PATCH method.
   * The token will be refreshed without creating a new paypal order.
   *
   * @returns An Observable emitting the PayPal token string, or an empty string if no token is available.
   */
  private refreshPaypalToken(body: {
    paymentInstrument: string;
    redirect: { successUrl: string; cancelUrl: string; failureUrl: string };
  }): Observable<string> {
    return this.apiService
      .currentBasketEndpoint()
      .patch<{ data: PaymentData }>('payments/open-tender', body, { headers: this.basketHeaders })
      .pipe(map(payment => this.getPaypalTokenFromRedirectUrl(payment.data.redirect?.redirectUrl)));
  }

  private getPaypalTokenFromRedirectUrl(redirectUrl: string): string {
    return redirectUrl ? new URL(redirectUrl).searchParams.get('token') ?? '' : '';
  }
}
