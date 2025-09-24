import { Injectable } from '@angular/core';
import { concatLatestFrom } from '@ngrx/effects';
import { Observable, defaultIfEmpty, filter, map, switchMap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

import { PaypalConfig } from './paypal-config.model';

interface ScriptParam {
  locale?: string;
  currency?: string;
  hostedPaymentPageParameters: Attribute<string>[];
  paypalConfig?: PaypalConfig;
  pageType: 'product-details' | 'cart' | 'checkout' | 'product-listing';
  expressCheckout?: boolean;
}

@Injectable({ providedIn: 'root' })
export class PaypalConfigHelper {
  static PAYPAL_SCRIPT_URL = 'https://www.paypal.com/sdk/js';
  private scriptUrl: string = PaypalConfigHelper.PAYPAL_SCRIPT_URL;

  constructor(private appFacade: AppFacade, private scriptLoader: ScriptLoaderService) {}

  static isFundingEnabled(config: PaypalConfig, pageType: string): boolean {
    switch (pageType) {
      case 'product-details':
        return config.payLaterMessagingProductDetails;
      case 'product-listing':
        return config.payLaterMessagingCategory;
      default:
        return config.payLaterMessagingCart;
    }
  }

  loadPayPalScript(param: Observable<ScriptParam>): Observable<boolean> {
    return param.pipe(
      filter(scriptParam => scriptParam.hostedPaymentPageParameters?.length > 0),
      concatLatestFrom(() => [
        this.appFacade.currentLocale$,
        this.appFacade.currentCurrency$,
        this.appFacade.payPalConfig$,
      ]),
      map(([scriptParam, locale, currency, config]) => ({
        ...scriptParam,
        locale,
        currency,
        paypalConfig: config,
        expressCheckout: scriptParam.expressCheckout ?? false,
      })),
      filter(scriptParam => !this.isPayPalScriptLoaded(scriptParam)),
      switchMap(scriptParam =>
        this.scriptLoader
          .load(this.scriptUrl.concat(`?${this.getScriptQueryParameters(scriptParam)}`), {
            attributes: [
              ...(scriptParam.hostedPaymentPageParameters?.filter(attr => attr.name.startsWith('data-')) ?? []),
              { name: 'data-namespace', value: scriptParam.expressCheckout ? 'paypal_express' : 'paypal_checkout' },
              { name: 'data-page-type', value: scriptParam.pageType },
              {
                name: 'data-partner-attribution-id',
                value: scriptParam.hostedPaymentPageParameters?.find(
                  attr => attr.name === 'data-partner-attribution-id'
                )?.value,
              },
            ],
          })
          .pipe(map(() => true))
      ),
      defaultIfEmpty(false)
    );
  }

  private getScriptQueryParameters(param: ScriptParam): string {
    let params = param.hostedPaymentPageParameters
      ?.filter(attr => ['client-id', 'merchant-id', 'intent'].includes(attr?.name))
      .map(attr => `${attr.name}=${attr.value}`)
      .join('&');
    params = `${params}&components=buttons,messages`;
    params = `${params}&currency=${param.currency}`;
    params = `${params}&locale=${param.locale}`; // ToDo: decide if paypal should determine locale from browser settings
    params = `${params}&commit=false`; // do not show the "Pay now" button, but the "Continue to PayPal" button
    if (param.paypalConfig.payLaterEnabled) {
      params = `${params}&enable-funding=paylater`;
    }
    return params;
  }

  private isPayPalScriptLoaded(param: ScriptParam): boolean {
    // Get all query params of the script element if it exists and compare to the new params
    const newParams: Record<string, string> = {};
    param.hostedPaymentPageParameters
      ?.filter(attr => ['client-id', 'merchant-id', 'intent'].includes(attr?.name))
      .forEach(attr => (newParams[attr.name] = attr.value));
    if (param.paypalConfig.payLaterEnabled) {
      newParams['enable-funding'] = 'paylater';
    }
    newParams.currency = param.currency;
    newParams.locale = param.locale;

    const element = document.querySelector(`script[src*="${PaypalConfigHelper.PAYPAL_SCRIPT_URL}"]`);

    if (element) {
      const scriptSrc = (element as HTMLScriptElement).src;
      const queryString = scriptSrc.split('?')[1];
      if (queryString) {
        const params = new URLSearchParams(queryString);
        const queryParams: Record<string, string> = {};
        params.forEach((value, key) => {
          queryParams[key] = value;
        });
        console.log('PayPal script query parameters:', queryParams);

        // Check if all key/value pairs of newParams are present in queryParams
        if (!Object.entries(newParams).every(([key, value]) => queryParams[key] === value)) {
          return false;
        }
      } else if (newParams && Object.keys(newParams).length > 0) {
        return false;
      }
    }

    // Get all attributes of the script element if it exists and compare to the new attributes
    const newScriptAttributes: Record<string, string> = {};
    newScriptAttributes['data-namespace'] = param.expressCheckout ? 'paypal_express' : 'paypal_checkout';
    newScriptAttributes['data-page-type'] = param.pageType;
    if (param.hostedPaymentPageParameters.find(attr => attr.name === 'data-partner-attribution-id')) {
      newScriptAttributes['data-partner-attribution-id'] = param.hostedPaymentPageParameters.find(
        attr => attr.name === 'data-partner-attribution-id'
      ).value;
    }

    const scriptAttributes: Record<string, string> = {};
    if (element) {
      Array.from(element.attributes).forEach(attr => {
        scriptAttributes[attr.name] = attr.value;
      });
      console.log('PayPal script attr:', scriptAttributes);

      return Object.entries(newScriptAttributes).every(([key, value]) => scriptAttributes[key] === value);
    }

    return false;
  }
}
