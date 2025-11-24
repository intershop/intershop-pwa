import { Injectable } from '@angular/core';
import { combineLatest, map, switchMap, take } from 'rxjs';

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
export type PaypalButtonsPageType = 'cart' | 'checkout';

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
 *
 * @example
 * // Load PayPal SDK for checkout page
 * this.paypalConfigService.loadPayPalScript('paypal-checkout', {
 *   paymentMethod: this.paymentMethod,
 *   page: 'checkout'
 * }).subscribe({
 *   next: () => console.log('PayPal SDK loaded'),
 *   error: err => console.error('Failed to load PayPal SDK', err)
 * });
 */
@Injectable({ providedIn: 'root' })
export class PaypalConfigService {
  /** Base URL for the PayPal JavaScript SDK */
  private readonly scriptUrl = 'https://www.paypal.com/sdk/js';

  constructor(private appFacade: AppFacade, private scriptLoader: ScriptLoaderService) {}

  /**
   * Loads the PayPal JavaScript SDK with the appropriate configuration.
   *
   * This method orchestrates the complete SDK loading process:
   * 1. Waits for application to become stable
   * 2. Gathers current locale, currency, and PayPal configuration
   * 3. Constructs the SDK URL with all required query parameters
   * 4. Loads the script with custom data attributes (namespace, page type, partner attribution)
   * 5. Returns an observable that completes when the script is loaded
   *
   * The SDK URL includes parameters for:
   * - Client ID and merchant ID (from payment method)
   * - Components (buttons, messages)
   * - Currency and locale
   * - Funding options (Pay Later, disabled funding sources)
   * - Commit behavior (based on RedirectAfterCheckout capability)
   *
   * @param nameSpace - Unique namespace for this PayPal integration (used for multiple instances)
   * @param param - Script parameters including payment method and page type
   * @returns Observable that emits when the script is loaded and completes, or errors on failure
   *
   * @example
   * this.paypalConfigService.loadPayPalScript('paypal-cart-buttons', {
   *   paymentMethod: this.cartPaymentMethod,
   *   page: 'cart'
   * }).subscribe({
   *   next: script => this.renderPayPalButtons(),
   *   error: err => this.handleScriptLoadError(err)
   * });
   */
  loadPayPalScript(nameSpace: string, param: PayPalScriptParams) {
    return combineLatest([
      this.appFacade.currentLocale$,
      this.appFacade.currentCurrency$,
      this.appFacade.payPalConfig$,
      this.appFacade.appBecameStable$,
    ]).pipe(
      map(([locale, currency, config]) => ({
        paymentMethod: param.paymentMethod,
        page: param.page,
        locale,
        currency,
        paypalConfig: config,
        capabilities: param.paymentMethod.capabilities,
      })),
      take(1),
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

  /**
   * Constructs the complete PayPal SDK URL with query parameters.
   *
   * @param param - Script parameters including payment method, locale, currency, and config
   * @returns The complete SDK URL with query string
   */
  private calculateURL(param: ScriptParams): string {
    return this.scriptUrl.concat(`?${this.getScriptQueryParameters(param)}`);
  }

  /**
   * Builds the query parameter string for the PayPal SDK URL.
   *
   * This method constructs query parameters including:
   * - `client-id`: PayPal client identifier
   * - `merchant-id`: PayPal merchant identifier (if applicable)
   * - `intent`: Payment intent (capture, authorize, etc.)
   * - `components`: SDK components to load (buttons, messages)
   * - `currency`: Transaction currency
   * - `locale`: Display locale
   * - `commit`: Whether to commit the transaction immediately (based on capabilities)
   * - `enable-funding`: Enabled funding sources (e.g., paylater)
   * - `disable-funding`: Disabled funding sources (card, sepa)
   *
   * @param param - Script parameters including payment method configuration and app context
   * @returns URL-encoded query parameter string
   */
  private getScriptQueryParameters(param: ScriptParams): string {
    let params = param.paymentMethod.hostedPaymentPageParameters
      ?.filter(attr => ['client-id', 'merchant-id'].includes(attr?.name) || attr.name === 'intent')
      .map(attr => `${attr.name}=${attr.value}`)
      .join('&');
    params = `${params}&components=buttons,messages`; // all available components: buttons,messages,marks,card-fields,funding-eligibility
    params = `${params}&currency=${param.currency}`;
    params = `${params}&locale=${param.locale}`;
    // default commit value is true
    if (!param.capabilities.includes('RedirectAfterCheckout')) {
      params = `${params}&commit=false`;
    }
    if (param.paypalConfig.payLaterButtonEnabled) {
      params = `${params}&enable-funding=paylater`;
    }
    // TODO: icm must have deliver information which cart type should be disabled for funding
    params = `${params}&disable-funding=card,sepa`;

    return params;
  }
}
