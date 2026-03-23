import { DOCUMENT } from '@angular/common';
import { DestroyRef, Inject, Injectable, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom, take } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaypalClientConfig } from 'ish-core/models/paypal-client-config/paypal-client-config';
import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PAYPAL_APPLE_PAY_BUTTON_STYLING } from 'ish-core/utils/paypal/adapters/paypal-adapters.styling';
import {
  PaypalDataTransferService,
  PaypalOrderData,
} from 'ish-core/utils/paypal/paypal-data-transfer/paypal-data-transfer.service';
import {
  ApplePayConfig,
  PaypalApplePayComponent,
  PaypalComponent,
} from 'ish-core/utils/paypal/paypal-model/paypal.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

/**
 * Representation of the PayPal SDK Apple Pay object, responsible for rendering the Apple Pay button
 * and handling the associated callbacks for order creation, approval, and error handling.
 *
 * The Apple Pay integration requires both the PayPal JavaScript SDK (with applepay component)
 * and the Apple Pay JavaScript SDK to work together.
 *
 * Life cycle of this component ends with destroying of parent component PaymentPaypalComponent.
 */
@Injectable()
export class PaypalApplePayAdapter {
  private applePayConfig: ApplePayConfig;
  private paypalApplepay: PaypalApplePayComponent;
  private loading = false;
  private merchantId: string;
  private orderContext: PaypalOrderData;
  private orderContextPromise: Promise<PaypalOrderData>;
  private readonly applePaySdkUrl = 'https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js';
  private applePayApiVersion: number;
  private cachedBasket: { currency: string; amount: string };

  constructor(
    private ngZone: NgZone,
    private appFacade: AppFacade,
    private destroyRef: DestroyRef,
    private checkoutFacade: CheckoutFacade,
    private paypalDataTransferService: PaypalDataTransferService,
    private scriptLoaderService: ScriptLoaderService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Renders the Apple Pay button in the specified container.
   *
   * @param config - Configuration for the Apple Pay component
   * @returns Promise that resolves when the button is rendered
   */
  async renderApplePayButton(config: PaypalComponentsConfig): Promise<void> {
    const containerId = config.containerId;
    const container = this.document.getElementById(containerId);
    this.merchantId = config.merchantId;

    // Load API version from server settings - await the result before continuing
    const paypalSettings = await firstValueFrom(
      this.appFacade.serverSetting$<PaypalClientConfig>('paypal').pipe(take(1))
    );
    this.applePayApiVersion = paypalSettings?.applePay?.apiVersion
      ? Number.parseInt(paypalSettings.applePay.apiVersion, 10)
      : 4;

    await this.loadApplePaySdk();

    if (!container) {
      return Promise.reject(new Error(`Container element '${containerId}' not found in DOM`));
    }

    // Check if Apple Pay is available in the browser
    if (!this.isApplePayAvailable()) {
      return Promise.reject(new Error('Apple Pay is not available in this browser'));
    }

    // Access PayPal SDK from window object
    const paypalObject = (window as unknown as Record<string, PaypalComponent>)[config.scriptNamespace];

    if (!paypalObject?.Applepay) {
      return Promise.reject(new Error(`PayPal Applepay not available on namespace '${config.scriptNamespace}'`));
    }

    return this.ngZone.run(async () => {
      try {
        // Initialize PayPal Apple Pay component
        this.paypalApplepay = paypalObject.Applepay();

        // Get Apple Pay configuration from PayPal
        try {
          this.applePayConfig = await this.paypalApplepay.config();
        } catch (configError) {
          console.error('PayPal Apple Pay configuration could not be estimated:', configError);
          return Promise.reject(configError);
        }

        // Check if Apple Pay is eligible for this merchant
        if (!this.applePayConfig.isEligible) {
          return Promise.reject(new Error('Apple Pay is not eligible for this merchant'));
        }

        // Pre-cache basket data for synchronous access in click handler
        await this.cacheBasketData();

        this.renderButton(container);
        return Promise.resolve();
      } catch (error) {
        console.error('Apple Pay initialization failed:', error);
        return Promise.reject(error);
      }
    });
  }

  /**
   * Loads the Apple Pay JavaScript SDK.
   */
  private async loadApplePaySdk(): Promise<void> {
    this.scriptLoaderService
      .load(this.applePaySdkUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.loaded) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Failed to load Google Pay SDK'));
      });
  }

  /**
   * Checks if Apple Pay is available in the current browser.
   */
  private isApplePayAvailable(): boolean {
    if (typeof ApplePaySession === 'undefined') {
      return false;
    }
    if (!ApplePaySession.canMakePayments()) {
      return false;
    }
    // Ensure we have a valid API version before checking support
    const version = this.applePayApiVersion || 4;
    try {
      return ApplePaySession.supportsVersion(version);
    } catch {
      // supportsVersion may throw if version is invalid
      return false;
    }
  }

  /**
   * Renders the Apple Pay button in the specified container.
   */
  private renderButton(container: HTMLElement): void {
    let locale = 'en';
    this.appFacade.currentLocale$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(currentLocale => {
      locale = currentLocale.split('_')[0];
    });

    const button = this.document.createElement('apple-pay-button');

    // Apply button styling
    button.setAttribute('id', 'btn-appl');
    button.setAttribute('locale', locale);
    button.setAttribute('buttonstyle', PAYPAL_APPLE_PAY_BUTTON_STYLING.buttonStyle);
    button.setAttribute('type', PAYPAL_APPLE_PAY_BUTTON_STYLING.buttonType);
    button.style.setProperty('--apple-pay-button-width', '100%');
    button.style.setProperty('--apple-pay-button-height', '40px');
    button.style.setProperty('--apple-pay-button-border-radius', `${PAYPAL_APPLE_PAY_BUTTON_STYLING.borderRadius}px`);
    button.style.cursor = 'pointer';

    button.addEventListener('click', () => this.ngZone.run(() => this.onApplePayButtonClicked()));

    container.appendChild(button);
  }

  /**
   * Handles the Apple Pay button click event.
   * Creates the payment request and opens the Apple Pay payment sheet.
   * IMPORTANT: ApplePaySession must be created synchronously from user gesture.
   */
  private onApplePayButtonClicked(): void {
    if (this.loading) {
      return;
    }

    this.loading = true;

    // Start ICM order creation - but don't await it here to keep user gesture chain
    this.checkoutFacade.processPaypalOrderCreation();
    this.orderContextPromise = firstValueFrom(
      this.paypalDataTransferService.paypalOrder$.pipe(filter(order => !!order?.paypalOrderId))
    );

    try {
      // Create payment request synchronously using cached data
      const paymentRequest = this.getPaymentRequestSync();
      // ApplePaySession MUST be created synchronously from user gesture
      const session = new ApplePaySession(this.applePayApiVersion, paymentRequest);

      session.onvalidatemerchant = async (event: { validationURL: string }) => {
        // Await the order context here (not in click handler)
        this.orderContext = await this.orderContextPromise;
        await this.onValidateMerchant(event.validationURL, session);
      };

      // ── Payment Method Selected ──
      // session.onpaymentmethodselected = async () => {
      //   await session.completePaymentMethodSelection({ newTotal: paymentRequest.total });
      // };

      session.onpaymentauthorized = async (event: ApplePayPaymentAuthorizedEvent) => {
        await this.onPaymentAuthorized(event, session);
      };

      session.oncancel = () => {
        this.loading = false;
      };

      session.begin();
    } catch (error) {
      this.loading = false;
      console.error('Error starting Apple Pay session:', error);
      throw error;
    }
  }

  /**
   * Pre-caches basket data for synchronous access in click handler.
   */
  private async cacheBasketData(): Promise<void> {
    const basket = await firstValueFrom(
      this.checkoutFacade.basket$.pipe(
        filter(b => !!b),
        take(1)
      )
    );
    this.cachedBasket = {
      currency: basket.totals?.total?.currency || 'USD',
      amount: basket.totals?.total?.gross?.toString() || '0',
    };
  }

  /**
   * Creates the payment request synchronously using cached basket data.
   */
  private getPaymentRequestSync(): ApplePayPaymentRequest {
    return {
      countryCode: this.applePayConfig.countryCode,
      currencyCode: this.cachedBasket.currency,
      merchantCapabilities: this.applePayConfig.merchantCapabilities,
      supportedNetworks: this.applePayConfig.supportedNetworks,
      total: {
        label: this.merchantId,
        amount: this.cachedBasket.amount,
        type: 'final',
      },
    };
  }

  /**
   * Handles the merchant validation callback from Apple Pay.
   * This is called when Apple Pay needs to verify the merchant.
   */
  private async onValidateMerchant(validationURL: string, session: ApplePaySession): Promise<void> {
    try {
      // PayPal handles the merchant validation through its SDK
      // The validateMerchant endpoint is typically provided by PayPal
      const merchantSession = await this.validateMerchantWithPaypal(validationURL, this.orderContext.paypalOrderId);

      session.completeMerchantValidation(merchantSession);
    } catch (error) {
      console.log('ERROR: onValidateMerchant: ', error);
      await this.continueICMOrderCreation(this.orderContext.paypalOrderId);
      session.abort();
      this.loading = false;
    }
  }

  /**
   * Validates the merchant with PayPal.
   * This is a server-side call that should be handled through PayPal's SDK.
   */
  private async validateMerchantWithPaypal(validationURL: string, _paypalOrderId: string): Promise<unknown> {
    // PayPal SDK handles merchant validation internally
    // This is typically done through a server call, but PayPal's SDK abstracts this
    // For the PayPal integration, we rely on PayPal's validateMerchant method if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paypalApplepayAny = this.paypalApplepay as any;
    if (typeof paypalApplepayAny.validateMerchant === 'function') {
      return paypalApplepayAny.validateMerchant({ validationUrl: validationURL, domain: window.location.hostname });
    }
    console.log('ERROR: PayPal validateMerchant method not available');

    // Fallback: Return a basic merchant session object
    // In production, this should be handled by your server
    throw new Error('PayPal validateMerchant method not available');
  }

  /**
   * Handles the payment authorization callback from Apple Pay.
   */
  private async onPaymentAuthorized(event: ApplePayPaymentAuthorizedEvent, session: ApplePaySession): Promise<void> {
    try {
      // Confirm the order with PayPal
      await this.paypalApplepay.confirmOrder({
        orderId: this.orderContext.paypalOrderId,
        token: event.payment.token,
        billingContact: event.payment.billingContact,
        shippingContact: event.payment.shippingContact,
      });
      console.log('Payment confirmed with PayPal');

      // Complete the payment
      const result = await this.continueICMOrderCreation(this.orderContext.orderId);
      console.log('Payment confirmed result: ', result);
      if (result.status === 'SUCCESS') {
        session.completePayment({ status: ApplePaySession.STATUS_SUCCESS });
      } else {
        session.completePayment({ status: ApplePaySession.STATUS_FAILURE });
      }
    } catch (error) {
      console.log('onPaymentAuthorized error: ', error);
      this.checkoutFacade.processPaypalOrderCreation(this.orderContext.orderId);
      session.completePayment({ status: ApplePaySession.STATUS_FAILURE });
    } finally {
      this.loading = false;
    }
  }

  /**
   * ICM order creation needs to be continued after Apple Pay authorization.
   */
  private async continueICMOrderCreation(orderId: string): Promise<{ status: 'SUCCESS' | 'CANCELLED' }> {
    const orderContext = await firstValueFrom(this.paypalDataTransferService.paypalOrder$);
    this.checkoutFacade.processPaypalOrderCreation(orderId);

    return {
      status: orderContext.orderStatus,
    };
  }
}
