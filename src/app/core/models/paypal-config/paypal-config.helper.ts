import { Injectable } from '@angular/core';
import { Observable, combineLatest, map, switchMap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

import { PaypalConfig, PaypalConfigMessaging } from './paypal-config.model';

export type PaypalPageType = PaypalButtonsPageType | 'home' | 'product-details' | 'product-listing';
export type PaypalButtonsPageType = 'cart' | 'checkout';

/**
 * Configuration parameters for PayPal script loading.
 * Used internally by PaypalConfigHelper to customize script loading behavior.
 */
interface ScriptParam {
  /** Optional locale override (normally retrieved from AppFacade) */
  locale?: string;
  /** Optional currency override (normally retrieved from AppFacade) */
  currency?: string;
  /** Payment method configuration attributes from the backend */
  paymentMethod: PaymentMethod;
  /** Optional PayPal configuration override (normally retrieved from AppFacade) */
  paypalConfig?: PaypalConfig;
  /** Page context where the script is being loaded */
  page: PaypalPageType;
  /** Type of PayPal integration (e.g., 'button', 'message') */
  type?: string;
}

/**
 * PayPal Configuration Helper Service
 *
 * This service provides centralized PayPal SDK integration functionality, handling
 * script loading, configuration management, and funding eligibility checks across
 * different page contexts within the Intershop PWA.
 *
 * Key Responsibilities:
 * - Dynamic PayPal SDK script loading with context-specific parameters
 * - Configuration of PayPal components (buttons, messages) based on page type
 * - Management of funding sources (PayLater, cards, etc.) per page context
 * - Generation of appropriate script URLs with query parameters
 * - Namespace management for multiple PayPal integrations
 *
 * The service integrates with the application's locale, currency, and PayPal
 * configuration systems to provide a seamless PayPal experience across
 * product pages, cart, and checkout flows.
 *
 *
 * @see {@link PaymentPaypalComponent} - Main PayPal button integration
 * @see {@link PaymentPaypalMessagesComponent} - PayPal messaging integration
 * @see {@link PaypalConfig} - PayPal configuration model
 */
@Injectable({ providedIn: 'root' })
export class PaypalConfigHelper {
  /** Base URL for PayPal SDK script loading */
  static PAYPAL_SCRIPT_URL = 'https://www.paypal.com/sdk/js';

  /** Private script URL property for potential runtime customization */
  private scriptUrl: string = PaypalConfigHelper.PAYPAL_SCRIPT_URL;

  constructor(private appFacade: AppFacade, private scriptLoader: ScriptLoaderService) {}

  /**
   * Determines if PayPal messaging should be enabled for a specific page type.
   *
   * This method checks the PayPal configuration to determine whether PayLater
   * messaging and funding options should be displayed based on the current page context.
   * Different pages have different messaging strategies and funding availability.
   *
   * @param messagingConfig - PayPal configuration messaging settings
   * @param pageType - The type of page where PayPal integration is being used
   * @returns True if messaging should be enabled for the given page type
   */
  isMessagingEnabled(messagingConfig: PaypalConfigMessaging, pageType: PaypalPageType): boolean {
    switch (pageType) {
      case 'home':
        return messagingConfig.onHomepage;
      case 'product-details':
        return messagingConfig.onProductDetailsPage;
      case 'product-listing':
        return messagingConfig.onCategoryPage;
      case 'checkout':
        return messagingConfig.onPaymentPage;
      default:
        return messagingConfig.onCartPage;
    }
  }

  /**
   * Loads the PayPal SDK script with appropriate configuration and returns the namespace.
   *
   * This method orchestrates the complete PayPal SDK loading process by:
   * 1. Combining current locale, currency, and PayPal configuration from AppFacade
   * 2. Generating appropriate script URL with query parameters
   * 3. Loading the script with required data attributes
   * 4. Returning the generated namespace for PayPal object access
   *
   * The method ensures that each script load gets a unique namespace to prevent
   * conflicts when multiple PayPal integrations exist on the same page.
   *
   * @param param - Script loading parameters including page context and payment method config
   * @returns Observable that emits the PayPal namespace string when script loads successfully
   *
   */
  loadPayPalScript(param: ScriptParam): Observable<string> {
    const nameSpace =
      param.type === 'message'
        ? 'PayPal_iframe_message'
        : 'PayPal_iframe_'.concat(param.paymentMethod.id, '_').concat(param.type);

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
        type: param.type,
      })),
      switchMap(scriptParam =>
        this.scriptLoader
          .load(this.calculateURL(scriptParam), {
            attributes: [
              ...(scriptParam.paymentMethod.hostedPaymentPageParameters?.filter(attr =>
                attr.name.startsWith('data-')
              ) ?? []),
              {
                name: 'data-namespace',
                value: nameSpace,
              },
              { name: 'data-page-type', value: scriptParam.page },
              {
                name: 'data-partner-attribution-id',
                value: scriptParam.paymentMethod.hostedPaymentPageParameters?.find(
                  attr => attr.name === 'data-partner-attribution-id'
                )?.value,
              },
            ],
          })
          .pipe(map(() => nameSpace))
      )
    );
  }

  private calculateURL(param: ScriptParam): string {
    return this.scriptUrl.concat(`?${this.getScriptQueryParameters(param)}`);
  }

  /**
   * Generates query parameters for PayPal SDK script URL.
   *
   * This private method constructs the query string for the PayPal SDK script URL
   * based on the provided parameters, page context, and configuration. It handles:
   * - Client ID and merchant ID from payment method configuration
   * - Component selection (buttons, messages) based on integration type
   * - Locale and currency settings
   * - Funding source configuration (PayLater, cards, SEPA)
   * - Page-specific optimizations (e.g., disabling cards on cart page)
   *
   * @param param - Script parameters containing configuration and context
   * @returns Query parameter string for the PayPal SDK script URL
   * @private
   */
  private getScriptQueryParameters(param: ScriptParam): string {
    let params = param.paymentMethod.hostedPaymentPageParameters
      ?.filter(
        attr => ['client-id', 'merchant-id'].includes(attr?.name) || (param.type === 'button' && attr.name === 'intent')
      )
      .map(attr => `${attr.name}=${attr.value}`)
      .join('&');
    if (param.type === 'button') {
      params = `${params}&components=buttons`;
    } else {
      params = `${params}&components=messages`;
    }
    params = `${params}&currency=${param.currency}`;
    params = `${params}&locale=${param.locale}`; // ToDo: decide if paypal should determine locale from browser settings
    params = `${params}&commit=false`; // do not show the "Pay now" button, but the "Continue to PayPal" button
    if (param.paypalConfig.payLaterButtonEnabled) {
      params = `${params}&enable-funding=paylater`;
    }
    // ToDo: make sure the checkout and express scripts are different to load the script twice
    if (param.page === 'cart') {
      params = `${params}&disable-funding=card,sepa`;
    }
    return params;
  }
}
