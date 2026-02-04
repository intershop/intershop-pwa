import { APP_BASE_HREF } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

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
  constructor(private apiService: ApiService, private store: Store, @Inject(APP_BASE_HREF) private baseHref: string) {}

  private basketHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.basket.v1+json',
  });

  initializePayPalExperienceContextFlow() {
    let loc = `${location.origin}${this.baseHref}`;
    // Remove trailing slash if present
    if (loc.endsWith('/')) {
      loc = loc.slice(0, -1);
    }

    return this.store.pipe(select(getCurrentLocale)).pipe(
      whenTruthy(),
      take(1),
      switchMap(currentLocale => {
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
          .pipe(map(response => response.data.orderId));
      })
    );
  }

  getPayPalPaymentInstrument(
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
}
