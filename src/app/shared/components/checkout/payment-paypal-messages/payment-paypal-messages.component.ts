import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  distinctUntilChanged,
  filter,
  iif,
  map,
  of,
  switchMap,
} from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { PaypalConfig } from 'ish-core/models/paypal-config/paypal-config.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention */
declare const paypal_messages: any;

@Component({
  selector: 'ish-payment-paypal-messages',
  templateUrl: './payment-paypal-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPaypalMessagesComponent implements OnInit {
  @Input() expressCheckout = false;
  @Input() pageType: 'product-details' | 'cart' | 'checkout' | 'product-listing' = 'cart';
  @Input() productSKU: string;

  private readonly paypalMessagesContainerId = '#paypal-only-messages-container';

  scriptLoaded$ = new BehaviorSubject<boolean>(undefined);
  scriptUrl: string;
  private currentLocale: string;
  private currentCurrency: string;

  private amount$: Observable<number>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private appFacade: AppFacade,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private scriptLoader: ScriptLoaderService
  ) {}

  ngOnInit(): void {
    this.amount$ = iif(
      () => this.pageType === 'product-details' && !!this.productSKU,
      this.shoppingFacade.productPrices$(this.productSKU).pipe(map(prices => prices?.salePrice?.value ?? 0)),
      iif(
        () => this.pageType === 'cart' || this.pageType === 'checkout',
        this.checkoutFacade.basket$.pipe(map(basket => basket?.totals?.total?.gross ?? 0)),
        of(0)
      )
    );

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
      amount: this.amount$,
    })
      .pipe(
        filter(data => this.isFundingEnabled(data.config)),
        distinctUntilChanged(
          (prev, curr) =>
            prev.locale === curr.locale &&
            prev.currency === curr.currency &&
            prev.paymentMethod === curr.paymentMethod &&
            prev.config === curr.config &&
            prev.amount === curr.amount
        ),
        switchMap(
          ({
            locale,
            currency,
            paymentMethod,
            config,
            amount,
          }): Observable<{ locale: string; currency: string; amount: number }> | [] => {
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
                paymentMethod?.hostedPaymentPageParameters,
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

              return this.scriptLoader
                .load(this.scriptUrl, { attributes })
                .pipe(map(() => ({ locale, currency, amount })));
            } else {
              return [];
            }
          }
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => this.renderPaypalMessages(data.amount));
  }

  private renderPaypalMessages(amount: number) {
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
              amount,
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
    let params = paymentParameters
      ?.filter(param => ['client-id', 'merchant-id', 'intent', 'partner-attribution-id'].includes(param?.name))
      .map(param => `${param.name}=${param.value}`)
      .join('&');
    params = `${params}&components=messages`;
    params = `${params}&currency=${currency}`;
    params = `${params}&locale=${locale}`; // ToDo: decide if paypal should determine locale from browser settings
    params = `${params}&commit=false`; // do not show the "Pay now" button, but the "Continue to PayPal" button
    params = `${params}&enable-funding=paylater`;
    return params;
  }

  private isFundingEnabled(config: PaypalConfig): boolean {
    switch (this.pageType) {
      case 'product-details':
        return config.payLaterMessagingProductDetails;
      case 'product-listing':
        return config.payLaterMessagingCategory;
      default:
        return config.payLaterMessagingCart;
    }
  }
}
