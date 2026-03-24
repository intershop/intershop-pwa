import { Observable, catchError, distinctUntilChanged, from, interval, map, of, startWith, switchMap } from 'rxjs';

import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalComponent } from 'ish-core/utils/paypal/paypal-model/paypal.model';

/**
 * Utility class to check eligibility of PayPal payment methods.
 * Observes the window object for PayPal SDK initialization and validates
 * whether specific payment methods (Card Fields, Google Pay, Apple Pay) are eligible.
 */
export class PaypalEligibilityChecker {
  /**
   * Checks if a PayPal payment method is eligible for use.
   * Returns `true` while the SDK is not yet loaded, then performs the actual eligibility check.
   *
   * @param paymentMethod - The payment method to check eligibility for
   * @returns Observable that emits `true` if eligible, `false` otherwise
   */
  static isEligible$(paymentMethod: PaymentMethod): Observable<boolean> {
    const paypalObject$ = interval(500).pipe(
      startWith(0),
      map(
        () =>
          (window as unknown as Record<string, PaypalComponent>)['PPCP_'.concat(`${paymentMethod.id}`).toUpperCase()]
      ),
      distinctUntilChanged()
    );

    return paypalObject$.pipe(
      switchMap(paypalObject => {
        if (!paypalObject) {
          return of(true);
        }
        if (paymentMethod.capabilities.includes('PaypalGooglePay')) {
          return PaypalEligibilityChecker.checkPaypalGooglePayEligibility(of(paypalObject));
        } else if (paymentMethod.capabilities.includes('PaypalApplePay')) {
          return PaypalEligibilityChecker.checkPaypalApplePayEligibility(of(paypalObject));
        } else {
          return PaypalEligibilityChecker.checkPaypalCardFieldsEligibility(of(paypalObject));
        }
      })
    );
  }

  /**
   * Checks if PayPal Card Fields are eligible for the current session.
   *
   * @param paypalObject$ - Observable of the PayPal SDK component
   * @returns Observable that emits `true` if Card Fields are eligible
   */
  static checkPaypalCardFieldsEligibility(paypalObject$: Observable<PaypalComponent>): Observable<boolean> {
    return paypalObject$.pipe(map(paypalObject => paypalObject?.CardFields()?.isEligible()));
  }

  /**
   * Checks if PayPal Apple Pay is eligible.
   * Verifies browser support via ApplePaySession and merchant eligibility via PayPal SDK.
   *
   * @param paypalObject$ - Observable of the PayPal SDK component
   * @returns Observable that emits `true` if Apple Pay is available and eligible
   */
  static checkPaypalApplePayEligibility(paypalObject$: Observable<PaypalComponent>): Observable<boolean> {
    // Check browser support first
    if (
      typeof ApplePaySession === 'undefined' ||
      !ApplePaySession.supportsVersion(4) ||
      !ApplePaySession.canMakePayments()
    ) {
      return of(false);
    }
    // Check PayPal SDK eligibility
    return paypalObject$.pipe(
      switchMap(paypalObject =>
        from(paypalObject.Applepay().config()).pipe(map(applePayConfig => applePayConfig.isEligible))
      ),
      catchError(() => of(false))
    );
  }

  /**
   * Checks if PayPal Google Pay is eligible by querying the Google Pay API.
   * Retrieves Google Pay config from PayPal SDK and validates with Google's `isReadyToPay`.
   *
   * @param paypalObject$ - Observable of the PayPal SDK component
   * @returns Observable that emits `true` if Google Pay is ready, `false` on error
   */
  static checkPaypalGooglePayEligibility(paypalObject$: Observable<PaypalComponent>): Observable<boolean> {
    return paypalObject$.pipe(
      switchMap(paypalObject =>
        from(paypalObject.Googlepay().config()).pipe(
          switchMap(googlePayConfig => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const googlePayments = (window as any).google.payments.api;
            const googlePaymentClient = new googlePayments.PaymentsClient({
              environment: 'TEST',
            });
            return from(
              googlePaymentClient.isReadyToPay({
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: googlePayConfig.allowedPaymentMethods,
              }) as Promise<boolean>
            );
          })
        )
      ),
      catchError(() => of(false))
    );
  }
}
