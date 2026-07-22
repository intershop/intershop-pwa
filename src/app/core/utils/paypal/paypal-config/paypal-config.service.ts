import { Injectable } from '@angular/core';
import { Observable, catchError, combineLatest, defer, from, iif, map, of, switchMap, take, tap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalConfig } from 'ish-core/models/paypal-config/paypal-config.model';
import { PaypalApplePayAdapter } from 'ish-core/utils/paypal/adapters/paypal-apple-pay/paypal-apple-pay.adapter';
import { PaypalGooglePayAdapter } from 'ish-core/utils/paypal/adapters/paypal-google-pay/paypal-google-pay.adapter';
import { PaypalComponent } from 'ish-core/utils/paypal/paypal-model/paypal.model';
import { ScriptLoaderService, ScriptType } from 'ish-core/utils/script-loader/script-loader.service';

/**
 * PayPal page types used for configuring the PayPal SDK parameter data-page-type.
 */
export type PaypalPageType = 'cart' | 'checkout' | 'home' | 'product-details' | 'product-listing';

/**
 * PayPal component types that can be loaded via the SDK.
 *
 * These components determine which PayPal UI elements are available in the application.
 * The SDK can be loaded with different combinations of components based on the use case.
 */
export type PaypalAdapterTypes = 'ApplePay' | 'Buttons' | 'CardFields' | 'GooglePay' | 'Messages';

interface PaypalScriptParams {
  /** The current application locale (e.g., 'en_US', 'de_DE') */
  locale: string;
  /** The current currency code (e.g., 'USD', 'EUR') */
  currency: string;
  /** Payment method capabilities that determine SDK behavior */
  capabilities?: string[];
  /** PayPal-specific configuration from the application */
  paypalConfig: PaypalConfig;
  /** The PayPal payment method configuration */
  paymentMethod?: PaymentMethod;
}

@Injectable({ providedIn: 'root' })
export class PaypalConfigService {
  /** Base URL for the PayPal JavaScript SDK */
  private readonly scriptUrl = 'https://www.paypal.com/sdk/js';

  /** Cache for PayPal payment eligibility results to avoid redundant checks */
  private readonly eligibilityCache = new Map<string, boolean>();

  constructor(
    private appFacade: AppFacade,
    private scriptLoader: ScriptLoaderService
  ) {}

  /**
   * Generates the PayPal SDK namespace based on the payment method ID.
   */
  getPaypalScriptNameSpace(paymentMethod?: PaymentMethod): string {
    return paymentMethod
      ? paymentMethod.capabilities?.includes('PaypalAlternativeWallet')
        ? 'PPCP_ALTERNATIVE_PAYMENT'
        : 'PPCP_'.concat(`${paymentMethod.id}`.replace(/\s/g, '')).toUpperCase()
      : 'PPCP_MESSAGES';
  }

  /**
   * Gets the PayPal SDK component object based on the provided payment method.
   */
  getPaypalComponent(paymentMethod?: PaymentMethod): PaypalComponent {
    const namespace = this.getPaypalScriptNameSpace(paymentMethod);
    return (window as unknown as Record<string, PaypalComponent>)[namespace] as PaypalComponent;
  }

  /**
   * Loads the PayPal JavaScript SDK with the appropriate configuration.
   *
   * This method dynamically loads the PayPal SDK script based on whether a payment method
   * is provided. If a payment method exists, it loads the full SDK with buttons, messages,
   * and card-fields components. Otherwise, it loads only the messages component for
   * Pay Later display.
   *
   * @param nameSpace - Unique namespace for this PayPal integration to avoid conflicts
   * @param pageType - The type of page where PayPal is being loaded (e.g., 'cart', 'checkout', 'product-details')
   * @param paymentMethod - Optional PayPal payment method configuration from ICM
   * @returns Observable that emits the loaded script information
   */
  loadPaypalScript(pageType: string, paymentMethod?: PaymentMethod): Observable<ScriptType> {
    return combineLatest([
      this.appFacade.currentLocale$,
      this.appFacade.currentCurrency$,
      this.appFacade.serverSetting$<PaypalConfig>('payment.paypal'),
    ]).pipe(
      switchMap(([locale, currency, paypalConfig]) =>
        iif(
          () => !!paymentMethod,
          defer(() =>
            this.scriptLoader.load(
              this.calculateURL({
                paymentMethod,
                locale,
                currency,
                paypalConfig,
                capabilities: paymentMethod?.capabilities,
              }),
              {
                attributes: [
                  ...(paymentMethod?.hostedPaymentPageParameters?.filter(attr => attr.name.startsWith('data-')) ?? []),
                  {
                    name: 'data-namespace',
                    value: this.getPaypalScriptNameSpace(paymentMethod),
                  },
                  { name: 'data-page-type', value: pageType },
                  {
                    name: 'data-partner-attribution-id',
                    value: paymentMethod?.hostedPaymentPageParameters?.find(
                      attr => attr.name === 'data-partner-attribution-id'
                    )?.value,
                  },
                ],
              }
            )
          ),
          defer(() =>
            this.scriptLoader.load(this.calculateURL({ locale, currency, paypalConfig }), {
              attributes: [
                {
                  name: 'data-namespace',
                  value: this.getPaypalScriptNameSpace(),
                },
                { name: 'data-page-type', value: pageType },
              ],
            })
          )
        )
      )
    );
  }

  /**
   * Determine the PayPal adapter type based on payment method capabilities.
   */
  getPaypalAdapterType(method?: PaymentMethod): PaypalAdapterTypes {
    switch (true) {
      case method?.capabilities?.includes('PaypalGooglePay'):
        return 'GooglePay';
      case method?.capabilities?.includes('PaypalApplePay'):
        return 'ApplePay';
      case method?.capabilities?.includes('PaypalExperienceContext'):
        return 'CardFields';
      default:
        return 'Buttons';
    }
  }

  /**
   * Filters payment methods by PayPal eligibility asynchronously.
   * Non-PayPal methods pass through, PayPal methods are checked via SDK.
   */
  filterByPaypalEligibility(pmList: PaymentMethod[]): Observable<PaymentMethod[]> {
    if (!pmList?.length) {
      return of([]);
    }
    const eligibilityChecks$ = pmList.map(pm => {
      const requiresPaypalCheck =
        pm.capabilities?.includes('PaypalExperienceContext') || pm.capabilities?.includes('PaypalAlternativeWallet');
      const eligibility$ = requiresPaypalCheck ? this.checkPaypalPaymentEligibility(pm) : of(true);
      return eligibility$.pipe(map(isEligible => ({ pm, isEligible })));
    });
    return combineLatest(eligibilityChecks$).pipe(map(results => results.filter(r => r.isEligible).map(r => r.pm)));
  }

  /**
   * Checks if a PayPal payment method is eligible for the current session.
   * Loads the PayPal SDK and validates eligibility based on the payment method's capabilities
   * (Card Fields, Google Pay, or Apple Pay).
   *
   * This method caches eligibility results to avoid redundant SDK loads and checks.
   * Once a payment method has been checked, subsequent calls return the cached result.
   *
   * @param paymentMethod - The PayPal payment method to check eligibility for
   * @returns Observable that emits `true` if the payment method is eligible,
   *          `false` if not eligible or if script loading fails
   */
  private checkPaypalPaymentEligibility(paymentMethod: PaymentMethod): Observable<boolean> {
    const cacheKey = paymentMethod.id;

    if (this.eligibilityCache.has(cacheKey)) {
      return of(this.eligibilityCache.get(cacheKey));
    }

    return this.loadPaypalScript('checkout', paymentMethod).pipe(
      switchMap(script => {
        if (!script) {
          return of(false);
        }
        const paypalObject = this.getPaypalComponent(paymentMethod);

        if (paymentMethod.capabilities.includes('PaypalGooglePay')) {
          return this.checkPaypalGooglePayEligibility(paypalObject);
        } else if (paymentMethod.capabilities.includes('PaypalApplePay')) {
          return this.checkPaypalApplePayEligibility(paypalObject);
        } else {
          return this.checkPaypalCardFieldsEligibility(paypalObject);
        }
      }),
      tap(isEligible => this.eligibilityCache.set(cacheKey, isEligible)),
      catchError(() => {
        this.eligibilityCache.set(cacheKey, false);
        return of(false);
      })
    );
  }

  /**
   * Checks if PayPal Card Fields are eligible for the current session.
   */
  private checkPaypalCardFieldsEligibility(paypalObject: PaypalComponent): Observable<boolean> {
    return of(!!paypalObject?.CardFields()?.isEligible());
  }

  /**
   * Checks if PayPal Google Pay is eligible by querying the Google Pay API.
   */
  private checkPaypalGooglePayEligibility(paypalObject: PaypalComponent): Observable<boolean> {
    return this.scriptLoader.load(PaypalGooglePayAdapter.GOOGLE_PAY_SDK_URL).pipe(
      switchMap(result => {
        if (!result.loaded) {
          return of(false);
        }
        return combineLatest([
          from(paypalObject.Googlepay().config()),
          this.appFacade.paypalClientConfig$.pipe(
            take(1),
            map(config => config?.googlePayEnvironment)
          ),
        ]).pipe(
          switchMap(([googlePayConfig, googlePayEnvironment]) =>
            from(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              new (window as any).google.payments.api.PaymentsClient({
                googlePayEnvironment,
                merchantInfo: googlePayConfig.merchantInfo,
              }).isReadyToPay({
                apiVersion: PaypalGooglePayAdapter.GOOGLE_PAY_API_VERSION_MAJOR,
                apiVersionMinor: PaypalGooglePayAdapter.GOOGLE_PAY_API_VERSION_MINOR,
                allowedPaymentMethods: googlePayConfig.allowedPaymentMethods,
              }) as Promise<{ result: boolean }>
            )
          ),
          map(readyToPay => readyToPay.result)
        );
      })
    );
  }

  /**
   * Checks if PayPal Apple Pay is eligible.
   * Loads the Apple Pay SDK, checks browser availability, and queries the PayPal config.
   */
  private checkPaypalApplePayEligibility(paypalObject: PaypalComponent): Observable<boolean> {
    return this.scriptLoader.load(PaypalApplePayAdapter.APPLE_PAY_SDK_URL).pipe(
      switchMap(() => {
        if (!PaypalApplePayAdapter.isApplePayAvailable()) {
          return of(false);
        }
        return from(paypalObject.Applepay().config()).pipe(map(applePayConfig => !!applePayConfig?.isEligible));
      }),
      catchError(() => of(false))
    );
  }

  /**
   * Constructs the complete PayPal SDK URL with appropriate query parameters.
   *
   * Determines which URL construction method to use based on whether a payment method
   * is provided:
   * - With payment method: Full SDK with buttons, messages, and card-fields
   * - Without payment method: Messages-only SDK for Pay Later display
   *
   * @param param - Script parameters including locale, currency, and optional payment method
   * @returns Complete PayPal SDK URL with all required query parameters
   */
  private calculateURL(param: PaypalScriptParams): string {
    if (param.paymentMethod) {
      if (param.paymentMethod.capabilities.includes('PaypalAlternativeWallet')) {
        return this.scriptUrl.concat(`?${this.getScriptQueryParameterForAlternativePayment(param)}`);
      }
      return this.scriptUrl.concat(`?${this.getScriptQueryParameters(param)}`);
    }
    return this.scriptUrl.concat(`?${this.getScriptQueryParameterForMessages(param)}`);
  }

  /**
   * Constructs query parameters for the PayPal SDK messages-only component.
   *
   * @param param - Script parameters including PayPal config, currency, and locale
   * @returns Query string with parameters for messages-only SDK
   */
  private getScriptQueryParameterForMessages(param: PaypalScriptParams): string {
    let params = `client-id=${param.paypalConfig.clientId}`;
    params = `${params}&merchant-id=${param.paypalConfig.merchantId}`;
    params = `${params}&currency=${param.currency}`;
    params = `${params}&locale=${param.locale}`;
    params = `${params}&components=messages`;
    params = `${params}&enable-funding=paylater`;
    return params;
  }

  /**
   * Constructs query parameters for the PayPal SDK Google Pay component.
   *
   * Google Pay requires specific parameters including intent for proper authorization.
   * Note: In sandbox environment, buyer-country might be needed for testing.
   *
   * @param param - Script parameters including PayPal config, currency, and locale
   * @returns Query string with parameters for Google Pay SDK
   */
  private getScriptQueryParameterForAlternativePayment(param: PaypalScriptParams): string {
    let params = `client-id=${param.paypalConfig.clientId}`;
    params = `${params}&merchant-id=${param.paypalConfig.merchantId}`;
    params = `${params}&currency=${param.currency}`;
    params = `${params}&locale=${param.locale}`;
    params = `${params}&components=googlepay,applepay`;

    return params;
  }

  /**
   * Constructs query parameters for the full PayPal SDK with all components.
   *
   * This is used when a payment method is provided, typically on checkout pages.
   *
   * @param param - Script parameters including payment method, capabilities, currency, and locale
   * @returns Query string with all parameters for full SDK
   */
  private getScriptQueryParameters(param: PaypalScriptParams): string {
    let params = `client-id=${param.paypalConfig.clientId}`;
    params = `${params}&merchant-id=${param.paypalConfig.merchantId}`;
    const intentParam = param.paymentMethod.hostedPaymentPageParameters?.find(attr => attr.name === 'intent');
    if (intentParam) {
      params = `${params}&intent=${intentParam.value}`;
    }
    params = `${params}&components=buttons,messages,card-fields`;
    params = `${params}&currency=${param.currency}`;
    params = `${params}&locale=${param.locale}`;
    // default commit value is true
    if (!param.capabilities.includes('RedirectAfterCheckout')) {
      params = `${params}&commit=false`;
    }
    if (
      param.paypalConfig.payLaterPreferences.PayLaterEnabled &&
      !param.capabilities.includes('PaypalExperienceContext')
    ) {
      params = `${params}&enable-funding=paylater`;
    }
    if (!param.capabilities.includes('PaypalExperienceContext')) {
      params = `${params}&disable-funding=card,sepa`;
    }

    return params;
  }
}
