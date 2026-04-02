import { Injectable } from '@angular/core';
import { Observable, catchError, combineLatest, defer, iif, map, of, switchMap, tap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalConfig } from 'ish-core/models/paypal-config/paypal-config.model';
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
export type PaypalAdapterTypes = 'Buttons' | 'Messages' | 'CardFields';

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

  constructor(private appFacade: AppFacade, private scriptLoader: ScriptLoaderService) {}

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
   * Generates the PayPal SDK namespace based on the payment method ID.
   */
  private getPaypalScriptNameSpace(paymentMethod?: PaymentMethod): string {
    return paymentMethod ? 'PPCP_'.concat(`${paymentMethod.id}`).toUpperCase() : 'PPCP_MESSAGES';
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
      map(script => {
        if (!script) {
          return false;
        }
        const paypalObject = (window as unknown as Record<string, PaypalComponent>)[
          'PPCP_'.concat(`${paymentMethod.id}`).toUpperCase()
        ] as PaypalComponent;

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
  private checkPaypalCardFieldsEligibility(paypalObject: PaypalComponent): boolean {
    return !!paypalObject?.CardFields()?.isEligible();
  }

  /**
   * Checks if PayPal Google Pay is eligible by querying the Google Pay API.
   */
  private checkPaypalGooglePayEligibility(_paypalObject: PaypalComponent): boolean {
    return true;
  }

  /**
   * Checks if PayPal Apple Pay is eligible.
   * Currently always returns `true` as Apple Pay eligibility is determined client-side.
   */
  private checkPaypalApplePayEligibility(_paypalObject: PaypalComponent): boolean {
    return true;
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
