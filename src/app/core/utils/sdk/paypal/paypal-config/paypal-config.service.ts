import { Injectable } from '@angular/core';
import { combineLatest, map, switchMap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalConfig } from 'ish-core/models/paypal-config/paypal-config.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

/**
 * Represents all possible page types where PayPal components can be rendered.
 * Includes both button-enabled pages and non-button pages.
 */
export type PaypalPageType = PaypalButtonsPageType | 'home' | 'product-details' | 'product-listing';

/**
 * Page types where PayPal buttons are displayed (cart and checkout pages).
 */
type PaypalButtonsPageType = 'cart' | 'checkout';

/**
 * Basic parameters required to load the PayPal SDK script.
 */
interface PayPalScriptParams {
  /** The PayPal payment method configuration */
  paymentMethod: PaymentMethod;
  /** The current page type where PayPal is being loaded */
  page: PaypalPageType;
}

/**
 * Extended script parameters including application context (locale, currency, config).
 * Used internally to construct the complete PayPal SDK URL with all required parameters.
 */
interface ScriptParams extends PayPalScriptParams {
  /** The current application locale (e.g., 'en_US', 'de_DE') */
  locale: string;
  /** The current currency code (e.g., 'USD', 'EUR') */
  currency: string;
  /** Payment method capabilities that determine SDK behavior */
  capabilities: string[];
  /** PayPal-specific configuration from the application */
  paypalConfig: PaypalConfig;
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
  loadPayPalScript(nameSpace: string, param: PayPalScriptParams) {
    return combineLatest([
      this.appFacade.currentLocale$,
      this.appFacade.currentCurrency$,
      this.appFacade.payPalConfig$,
    ]).pipe(
      map(([locale, currency, config]) => ({
        paymentMethod: param.paymentMethod,
        page: param.page,
        locale,
        currency,
        paypalConfig: config,
        capabilities: param.paymentMethod.capabilities,
      })),
      switchMap(scriptParams =>
        this.scriptLoader.load(this.calculateURL(scriptParams), {
          attributes: [
            ...(scriptParams.paymentMethod.hostedPaymentPageParameters?.filter(attr => attr.name.startsWith('data-')) ??
              []),
            {
              name: 'data-namespace',
              value: nameSpace,
            },
            { name: 'data-page-type', value: scriptParams.page },
            {
              name: 'data-partner-attribution-id',
              value: scriptParams.paymentMethod.hostedPaymentPageParameters?.find(
                attr => attr.name === 'data-partner-attribution-id'
              )?.value,
            },
          ],
        })
      )
    );
  }

  private calculateURL(param: ScriptParams): string {
    return this.scriptUrl.concat(`?${this.getScriptQueryParameters(param)}`);
  }

  private getScriptQueryParameters(param: ScriptParams): string {
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
    if (param.paypalConfig.payLaterButtonEnabled && !param.capabilities.includes('Paypal3DSecure')) {
      params = `${params}&enable-funding=paylater`;
      //TODO: icm must have deliver information which cart type should be disabled for funding
      params = `${params}&disable-funding=card,sepa`;
    }

    return params;
  }
}
