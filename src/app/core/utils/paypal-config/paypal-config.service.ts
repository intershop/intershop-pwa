import { Injectable } from '@angular/core';
import { combineLatest, map, switchMap, take } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalConfig } from 'ish-core/models/paypal-config/paypal-config.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

export type PaypalPageType = PaypalButtonsPageType | 'home' | 'product-details' | 'product-listing';
export type PaypalButtonsPageType = 'cart' | 'checkout';

/**
 * Configuration parameters for PayPal script loading.
 */
interface PayPalScriptParams {
  /* Payment method with hosted payment page parameters for the script configuration */
  paymentMethod: PaymentMethod;
  page: PaypalPageType;
  type?: 'button' | 'message';
}

interface ScriptParams extends PayPalScriptParams {
  locale: string;
  currency: string;
  paypalConfig: PaypalConfig;
}

/**
 * PayPal Configuration Service
 *
 * This service provides centralized PayPal SDK integration functionality, handling script loading, configuration management,
 * and funding eligibility checks across different page contexts within the Intershop PWA.
 *
 * Key Responsibilities:
 * - Dynamic PayPal SDK script loading with context-specific parameters
 * - Configuration of PayPal components (buttons, messages) based on page type
 * - Management of funding sources (PayLater, cards, etc.) per page context
 * - Generation of appropriate script URLs with query parameters
 * - Namespace management for multiple PayPal integrations
 *
 * The service integrates with the application's locale, currency, and PayPal configuration
 *
 * @see {@link PaymentPaypalComponent} - Main PayPal button integration
 * @see {@link PaymentPaypalMessagesComponent} - PayPal messaging integration
 */
@Injectable({ providedIn: 'root' })
export class PaypalConfigService {
  /** Private script URL property for potential runtime customization */
  private readonly scriptUrl = 'https://www.paypal.com/sdk/js';

  constructor(private appFacade: AppFacade, private scriptLoader: ScriptLoaderService) {}

  /**
   * Loads the PayPal SDK script with appropriate configuration and returns the namespace.
   *
   * @param nameSpace Unique namespace for the PayPal script instance
   * @param param     Script loading parameters including page context and payment method config
   * @returns         Observable of ScriptType indicating the load status
   *
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
        type: param.type,
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

  private calculateURL(param: ScriptParams): string {
    return this.scriptUrl.concat(`?${this.getScriptQueryParameters(param)}`);
  }

  /**
   * Generates query parameters for PayPal SDK script URL.
   *
   * @param param - Script parameters containing configuration and context
   * @returns Query parameter string for the PayPal SDK script URL
   */
  private getScriptQueryParameters(param: ScriptParams): string {
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
    params = `${params}&locale=${param.locale}`;
    params = `${params}&commit=false`; // do not show the "Pay now" button, but the "Continue to PayPal" button
    if (param.paypalConfig.payLaterButtonEnabled) {
      params = `${params}&enable-funding=paylater`;
    }
    // make sure the checkout and express scripts are different to load the script twice
    if (param.page === 'cart') {
      params = `${params}&disable-funding=card,sepa`;
    }
    return params;
  }
}
