import { Injectable } from '@angular/core';
import { Observable, combineLatest, defer, iif, switchMap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalConfig } from 'ish-core/models/paypal-config/paypal-config.model';
import { ScriptLoaderService, ScriptType } from 'ish-core/utils/script-loader/script-loader.service';

/**
 * Enumeration of PayPal page types used for configuring the PayPal SDK parameter data-page-type.
 */
export enum PaypalPageTypes {
  /** Shopping cart page where users review their items before checkout */
  Cart = 'cart',
  /** Checkout payment page where users select payment method and complete purchase */
  CheckoutPayment = 'checkout',
  /** Home page, typically used for Pay Later messaging */
  Home = 'home',
  /** Product details page showing a single product */
  ProductDetails = 'product-details',
  /** Product listing/category page showing multiple products */
  ProductListing = 'product-listing',
}

/**
 * Enumeration of PayPal component types that can be loaded via the SDK.
 *
 * These components determine which PayPal UI elements are available in the application.
 * The SDK can be loaded with different combinations of components based on the use case.
 */
export enum PaypalComponentTypes {
  /** PayPal payment buttons for initiating checkout */
  Buttons,
  /** Pay Later promotional messages and financing information */
  Messages,
  /** Advanced card fields for direct credit/debit card payment */
  CardFields,
}

interface PayPalScriptParams {
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
  loadPayPalScript(nameSpace: string, pageType: string, paymentMethod?: PaymentMethod): Observable<ScriptType> {
    return combineLatest([
      this.appFacade.currentLocale$,
      this.appFacade.currentCurrency$,
      this.appFacade.payPalConfig$,
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
            )
          ),
          defer(() =>
            this.scriptLoader.load(this.calculateURL({ locale, currency, paypalConfig }), {
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
      )
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
  private calculateURL(param: PayPalScriptParams): string {
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
  private getScriptQueryParameterForMessages(param: PayPalScriptParams): string {
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
  private getScriptQueryParameters(param: PayPalScriptParams): string {
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
    if (param.paypalConfig.payLaterPreferences.PayLaterEnabled && !param.capabilities.includes('Paypal3DSecure')) {
      params = `${params}&enable-funding=paylater`;
      //TODO: icm must have deliver information which cart type should be disabled for funding
      params = `${params}&disable-funding=card,sepa`;
    }

    return params;
  }
}
