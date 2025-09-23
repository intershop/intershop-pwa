import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, map, switchMap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention */
declare const paypal_messages: any;

@Component({
  selector: 'ish-paypal-messages',
  templateUrl: './paypal-messages.component.html',
  styleUrls: ['./paypal-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaypalMessagesComponent implements OnInit {
  @Input() expressCheckout = false;
  @Input() pageType: 'product-details' | 'cart' | 'checkout' | 'product-listing' = 'cart';
  @Input() productSKU: string;

  private readonly paypalMessagesContainerId = '#paypal-only-messages-container';

  scriptLoaded$ = new BehaviorSubject<boolean>(undefined);
  scriptUrl: string;
  private currentLocale: string;
  private currentCurrency: string;

  paypalPaymentMethod$: Observable<PaymentMethod>;
  amount = 0;
  private destroyRef = inject(DestroyRef);

  constructor(
    private appFacade: AppFacade,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private scriptLoader: ScriptLoaderService
  ) {}

  ngOnInit(): void {
    if (this.pageType === 'product-details' && this.productSKU) {
      this.shoppingFacade
        .productPrices$(this.productSKU)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(prices => {
          this.amount = prices?.salePrice?.value ?? 0;
        });
    } else if (this.pageType === 'cart' || this.pageType === 'checkout') {
      this.checkoutFacade.basket$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(basket => {
        this.amount = basket?.totals?.total?.gross ?? 0;
      });
    }
    this.loadScript();
  }

  /**
   * load script if component is visible
   */
  private loadScript() {
    combineLatest({
      locale: this.appFacade.currentLocale$.pipe(whenTruthy()),
      currency: this.appFacade.currentCurrency$.pipe(whenTruthy()),
      paymentMethod: this.checkoutFacade.paypalPaymentMethod$(
        this.expressCheckout ? 'FastCheckout' : 'RedirectBeforeCheckout'
      ),
      config: this.appFacade.payPalConfig$,
    })
      .pipe(
        distinctUntilChanged(
          (prev, curr) =>
            prev.locale === curr.locale &&
            prev.currency === curr.currency &&
            prev.paymentMethod === curr.paymentMethod &&
            prev.config === curr.config
        ),
        switchMap(
          ({ locale, currency, paymentMethod, config }): Observable<{ locale: string; currency: string }> | [] => {
            // Check if locale or currency changed and script was already loaded
            const localeOrCurrencyChanged =
              (this.currentLocale && this.currentLocale !== locale) ||
              (this.currentCurrency && this.currentCurrency !== currency);

            this.currentLocale = locale;
            this.currentCurrency = currency;

            if (localeOrCurrencyChanged) {
              // Reset the script loaded state to force reload
              this.scriptLoaded$.next(false);
            }

            if (paymentMethod?.hostedPaymentPageParameters?.length || config) {
              this.scriptUrl = `https://www.paypal.com/sdk/js?${this.getScriptQueryParameters(
                paymentMethod?.hostedPaymentPageParameters
                  ? paymentMethod.hostedPaymentPageParameters
                  : [
                      { name: 'client-id', value: config.clientID },
                      { name: 'merchant-id', value: config.merchantID },
                      { name: 'intent', value: config.intent },
                    ],
                currency,
                locale
              )}`;

              const attributes = paymentMethod
                ? [
                    ...(paymentMethod.hostedPaymentPageParameters?.filter(attr => attr.name.startsWith('data-')) ?? []),
                    { name: 'data-namespace', value: 'paypal_messages' },
                    { name: 'data-page-type', value: this.pageType },
                  ]
                : [
                    { name: 'data-namespace', value: 'paypal_messages' },
                    { name: 'data-page-type', value: this.pageType },
                  ];

              return this.scriptLoader.load(this.scriptUrl, { attributes }).pipe(map(() => ({ locale, currency })));
            } else {
              return [];
            }
          }
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.renderPaypalMessages());
  }

  private renderPaypalMessages() {
    console.log('AMOUNT: ', this.amount);
    this.scriptLoaded$.next(true);
    paypal_messages
      .Messages(
        this.pageType === 'product-listing'
          ? {
              style: {
                layout: 'flex',
                color: 'white-no-border',
              },
            }
          : {
              amount: this.amount,
              style: {
                layout: 'text',
                color: 'black',
                logo: {
                  type: 'inline',
                },
              },
            }
      )
      .render(this.paypalMessagesContainerId)
      .catch((error: string) => {
        console.error('PayPal Messages render failed:', error);
      });
  }

  private getScriptQueryParameters(paymentParameters: Attribute<string>[], currency: string, locale: string): string {
    console.log('Generating PayPal script URL with parameters:', paymentParameters, currency, locale);
    let params = paymentParameters
      ?.filter(param => ['client-id', 'merchant-id', 'intent'].includes(param?.name)) // 'data-partner-attribution-id'
      .map(param => `${param.name}=${param.value}`)
      .join('&');
    params = `${params}&components=messages`;
    params = `${params}&currency=${currency}`;
    params = `${params}&locale=${locale}`; // ToDo: decide if paypal should determine locale from browser settings
    params = `${params}&commit=false`; // do not show the "Pay now" button, but the "Continue to PayPal" button
    params = `${params}&enable-funding=paylater`;
    // ToDo: make sure the checkout and express scripts are different to load the script twice
    if (this.expressCheckout) {
      params = `${params}&disable-funding=card,sepa`;
    }
    // debug parameter available for sandbox only;

    return params;
  }
}
