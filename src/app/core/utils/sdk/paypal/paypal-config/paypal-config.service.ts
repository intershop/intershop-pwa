import { Injectable } from '@angular/core';
import { combineLatest, iif, switchMap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalConfig } from 'ish-core/models/paypal-config/paypal-config.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

/**
 * Enumeration of PayPal page types used for configuring the PayPal SDK parameter data-page-type.
 */
export enum PaypalPageTypes {
  Cart = 'cart',
  CheckoutPayment = 'checkout',
  Home = 'home',
  ProductDetails = 'product-details',
  ProductListing = 'product-listing',
}

export enum PaypalComponentTypes {
  Buttons,
  Messages,
  CardFields,
}

/**
 * Extended script parameters including application context (locale, currency, config).
 * Used internally to construct the complete PayPal SDK URL with all required parameters.
 */
interface PayPalScriptParams {
  /** The current application locale (e.g., 'en_US', 'de_DE') */
  locale: string;
  /** The current currency code (e.g., 'USD', 'EUR') */
  currency: string;
  /** Payment method capabilities that determine SDK behavior */
  capabilities?: string[];
  /** PayPal-specific configuration from the application */
  paypalLaterConfig: PaypalConfig;
  /** The PayPal payment method configuration */
  paymentMethod?: PaymentMethod;
}

/**
 * Service for configuring and loading the PayPal JavaScript SDK.
 *
 * This service handles the dynamic loading of the PayPal SDK script with proper
 * configuration based on the current application context (locale, currency, page type)
 * and payment method capabilities. It constructs the appropriate SDK URL with all
 * required query parameters and custom data attributes.
 *
 * Key responsibilities:
 * - Construct PayPal SDK URL with locale, currency, components, and funding options
 * - Load the SDK script with proper namespace and page type attributes
 * - Handle payment method capabilities (e.g., redirect behavior, Pay Later)
 * - Configure SDK components (buttons, messages) and funding sources
 *
 * The service ensures that:
 * - Each PayPal integration has a unique namespace to avoid conflicts
 * - SDK parameters match the payment method configuration from ICM
 * - The script is loaded only after the application becomes stable
 * - Locale and currency are synchronized with the current application context
 */
@Injectable({ providedIn: 'root' })
export class PaypalConfigService {
  /** Base URL for the PayPal JavaScript SDK */
  private readonly scriptUrl = 'https://www.paypal.com/sdk/js';

  constructor(private appFacade: AppFacade, private scriptLoader: ScriptLoaderService) {}

  /**
   * Loads the PayPal JavaScript SDK with the appropriate configuration.
   */
  loadPayPalScript(nameSpace: string, pageType: string, paymentMethod?: PaymentMethod) {
    return combineLatest([
      this.appFacade.currentLocale$,
      this.appFacade.currentCurrency$,
      this.appFacade.payPalConfig$,
    ]).pipe(
      switchMap(([locale, currency, paypalLaterConfig]) =>
        iif(
          () => !!paymentMethod,
          this.scriptLoader.load(
            this.calculateURL({
              paymentMethod,
              locale,
              currency,
              paypalLaterConfig,
              capabilities: paymentMethod?.capabilities,
            }),
            {
              attributes: [
                ...(paymentMethod?.hostedPaymentPageParameters?.filter(attr => attr.name.startsWith('data-')) ?? []),
                {
                  name: 'data-namespace',
                  value: nameSpace,
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
          ),
          this.scriptLoader.load(this.calculateURL({ locale, currency, paypalLaterConfig }), {
            attributes: [
              {
                name: 'data-namespace',
                value: nameSpace,
              },
              { name: 'data-page-type', value: pageType },
            ],
          })
        )
      )
    );
  }

  private calculateURL(param: PayPalScriptParams): string {
    if (param.paymentMethod) {
      return this.scriptUrl.concat(`?${this.getScriptQueryParameters(param)}`);
    }
    return this.scriptUrl.concat(`?${this.getScriptQueryParameterForMessages(param)}`);
  }

  private getScriptQueryParameterForMessages(param: PayPalScriptParams): string {
    let params = `client-id=${param.paypalLaterConfig.clientId}`;
    params = `${params}&merchant-id=${param.paypalLaterConfig.merchantId}`;
    params = `${params}&currency=${param.currency}`;
    params = `${params}&locale=${param.locale}`;
    params = `${params}&components=messages`;
    params = `${params}&enable-funding=paylater`;
    return params;
  }

  private getScriptQueryParameters(param: PayPalScriptParams): string {
    let params = param.paymentMethod.hostedPaymentPageParameters
      ?.filter(attr => ['client-id', 'merchant-id'].includes(attr?.name) || attr.name === 'intent')
      .map(attr => `${attr.name}=${attr.value}`)
      .join('&');
    params = `${params}&components=buttons,messages,card-fields`; // all available components: buttons,messages,marks,card-fields,hosted-fields,funding-eligibility
    params = `${params}&currency=${param.currency}`;
    params = `${params}&locale=${param.locale}`;
    // default commit value is true
    if (!param.capabilities.includes('RedirectAfterCheckout')) {
      params = `${params}&commit=false`;
    }
    if (param.paypalLaterConfig.payLaterPreferences.PayLaterEnabled && !param.capabilities.includes('Paypal3DSecure')) {
      params = `${params}&enable-funding=paylater`;
      //TODO: icm must have deliver information which cart type should be disabled for funding
      params = `${params}&disable-funding=card,sepa`;
    }

    return params;
  }
}
