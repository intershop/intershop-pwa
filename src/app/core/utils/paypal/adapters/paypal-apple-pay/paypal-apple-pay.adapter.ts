import { DOCUMENT } from '@angular/common';
import { DestroyRef, Inject, Injectable, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom, take } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PAYPAL_APPLE_PAY_BUTTON_STYLING } from 'ish-core/utils/paypal/adapters/paypal-adapters.styling';
import { PaypalConfigService } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';
import {
  PaypalDataTransferService,
  PaypalOrderData,
} from 'ish-core/utils/paypal/paypal-data-transfer/paypal-data-transfer.service';
import {
  ApplePayConfig,
  ApplePayPaymentAuthorizedEvent,
  ApplePayPaymentRequest,
  ApplePaySessionInstance,
  ApplePaySessionStatic,
  PaypalApplePayComponent,
} from 'ish-core/utils/paypal/paypal-model/paypal-apple-pay.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

// ApplePaySession is a global browser API, declared here for type safety
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const ApplePaySession: ApplePaySessionStatic;

/**
 * Representation of the PayPal SDK Apple Pay object, responsible for rendering the Apple Pay button
 * and handling the associated callbacks for order creation, approval, and error handling.
 *
 * The Apple Pay integration requires both the PayPal JavaScript SDK (with applepay component)
 * and the Apple Pay JavaScript SDK to work together.
 *
 * Life cycle of this class ends with destroying of parent component PaymentPaypalComponent.
 */
@Injectable()
export class PaypalApplePayAdapter {
  static readonly APPLE_PAY_SDK_URL = 'https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js';
  static readonly APPLE_PAY_API_VERSION = 4;

  private applePayConfig: ApplePayConfig;
  private paypalApplePay: PaypalApplePayComponent;
  private loading = false;
  private merchantId: string;
  private orderContext: PaypalOrderData;
  private currentBasket: BasketView;
  private applePayButton: HTMLElement | undefined;
  private buttonClickHandler: (() => void) | undefined;

  constructor(
    private ngZone: NgZone,
    private appFacade: AppFacade,
    private destroyRef: DestroyRef,
    private checkoutFacade: CheckoutFacade,
    private paypalConfigService: PaypalConfigService,
    private paypalDataTransferService: PaypalDataTransferService,
    private scriptLoaderService: ScriptLoaderService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.destroyRef.onDestroy(() => this.cleanup());
  }

  /**
   * Checks if Apple Pay is available in the current browser.
   */
  static isApplePayAvailable(): boolean {
    if (typeof ApplePaySession === 'undefined') {
      return false;
    }
    if (!ApplePaySession.canMakePayments()) {
      return false;
    }
    try {
      return ApplePaySession.supportsVersion(PaypalApplePayAdapter.APPLE_PAY_API_VERSION);
    } catch {
      // supportsVersion may throw if version is invalid
      return false;
    }
  }

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

    await this.loadApplePaySdk();

    if (!container) {
      return Promise.reject(new Error(`Container element '${containerId}' not found in DOM`));
    }

    // Check if Apple Pay is available in the browser
    if (!PaypalApplePayAdapter.isApplePayAvailable()) {
      return Promise.reject(new Error('Apple Pay is not available in this browser'));
    }

    const paypalObject = this.paypalConfigService.getPaypalComponent(config.paypalPaymentMethod);

    if (!paypalObject?.Applepay) {
      return Promise.reject(new Error(`PayPal Applepay not available on namespace '${config.scriptNamespace}'`));
    }

    return this.ngZone.run(async () => {
      try {
        // Initialize PayPal Apple Pay component
        this.paypalApplePay = paypalObject.Applepay();

        // Get Apple Pay configuration from PayPal
        try {
          this.applePayConfig = await this.paypalApplePay.config();
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
   * Cleanup resources to prevent memory leaks.
   */
  private cleanup(): void {
    if (this.applePayButton && this.buttonClickHandler) {
      this.applePayButton.removeEventListener('click', this.buttonClickHandler);
    }
    this.applePayButton?.remove();
    this.applePayButton = undefined;
    this.buttonClickHandler = undefined;
  }

  /**
   * Loads the Apple Pay JavaScript SDK.
   */
  private loadApplePaySdk(): Promise<void> {
    return firstValueFrom(this.scriptLoaderService.load(PaypalApplePayAdapter.APPLE_PAY_SDK_URL).pipe(take(1))).then(
      result => {
        if (!result.loaded) {
          throw new Error('Failed to load Apple Pay SDK');
        }
      }
    );
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
    button.style.setProperty('--apple-pay-button-width', PAYPAL_APPLE_PAY_BUTTON_STYLING.width);
    button.style.setProperty('--apple-pay-button-height', PAYPAL_APPLE_PAY_BUTTON_STYLING.height);
    button.style.setProperty('--apple-pay-button-border-radius', PAYPAL_APPLE_PAY_BUTTON_STYLING.borderRadius);
    button.style.cursor = 'pointer';

    this.buttonClickHandler = () => this.ngZone.run(() => this.onApplePayButtonClicked());
    button.addEventListener('click', this.buttonClickHandler);

    this.applePayButton = button;
    container.appendChild(button);
  }

  /**
   * Handles the Apple Pay button click event.
   * Creates the payment request and opens the Apple Pay payment sheet.
   * IMPORTANT: ApplePaySession must be created synchronously from user gesture.
   * Order creation is kicked off without awaiting and resolved inside onvalidatemerchant.
   */
  private onApplePayButtonClicked(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;

    // Kick off ICM order creation without awaiting – must not block synchronous session creation
    this.checkoutFacade.processPaypalOrderCreation();
    const orderContextPromise = firstValueFrom(this.paypalDataTransferService.paypalOrder$);

    // ApplePaySession MUST be created synchronously as part of the user gesture
    let session: ApplePaySessionInstance;
    try {
      session = new ApplePaySession(PaypalApplePayAdapter.APPLE_PAY_API_VERSION, this.getPaymentRequest());
    } catch (error) {
      this.loading = false;
      console.error('Error creating Apple Pay session:', error);
      return;
    }

    session.onvalidatemerchant = async (event: { validationURL: string }) => {
      // Ensure order context is resolved before proceeding (already assigned via .then() at session.begin())
      await orderContextPromise;

      if (this.orderContext.orderStatus === 'ERROR' || !this.orderContext.paypalOrderId) {
        return;
      }

      await this.onValidateMerchant(event.validationURL, session);
    };

    session.onpaymentauthorized = async (event: ApplePayPaymentAuthorizedEvent) => {
      await this.onPaymentAuthorized(event, session);
    };

    session.oncancel = async () => {
      this.loading = false;
      if (!this.orderContext?.orderId) {
        return;
      }
      try {
        await this.continueICMOrderCreation(this.orderContext.orderId);
      } catch (error) {
        console.error('Error during ICM order continuation after Apple Pay cancellation:', error);
      }
    };

    session.begin();

    orderContextPromise.then(context => {
      this.orderContext = context;
      if (this.orderContext.orderStatus === 'ERROR') {
        console.error('Order creation failed or no PayPal order ID available, aborting Apple Pay session');
        this.loading = false;
        session.abort();
      }
    });
  }

  /**
   * Pre-caches basket data for synchronous access in click handler.
   */
  private async cacheBasketData(): Promise<void> {
    this.currentBasket = await firstValueFrom(
      this.checkoutFacade.basket$.pipe(
        whenTruthy(),
        filter(b => !!b),
        take(1)
      )
    );
  }

  /**
   * Creates the payment request using current basket data.
   */
  private getPaymentRequest(): ApplePayPaymentRequest {
    return {
      countryCode: this.applePayConfig.countryCode,
      currencyCode: this.currentBasket.totals?.total?.currency || 'USD',
      merchantCapabilities: this.applePayConfig.merchantCapabilities,
      supportedNetworks: this.applePayConfig.supportedNetworks,
      total: {
        label: this.merchantId,
        amount: this.currentBasket.totals?.total?.gross?.toString() || '0',
        type: 'final',
      },
    };
  }

  /**
   * Maps the billing contact data from the current basket to the format expected by Apple Pay.
   */
  private mapBillingContactData() {
    const address = this.currentBasket.invoiceToAddress;
    if (address) {
      return {
        givenName: address.firstName,
        familyName: address.lastName,
        emailAddress: address.email,
        phoneNumber: address.phoneHome || address.phoneMobile || address.phoneBusiness,
        addressLines: [address.addressLine1, address.addressLine2, address.addressLine3].filter(Boolean),
        locality: address.city,
        administrativeArea: address.mainDivisionCode || address.mainDivision,
        postalCode: address.postalCode,
        countryCode: address.countryCode,
      };
    }
    return {};
  }

  /**
   * Handles the merchant validation callback from Apple Pay.
   * This is called when Apple Pay needs to verify the merchant.
   */
  private async onValidateMerchant(validationURL: string, session: ApplePaySessionInstance) {
    try {
      const payload = await this.paypalApplePay.validateMerchant({
        validationUrl: validationURL,
        domainName: window.location.hostname,
      });
      session.completeMerchantValidation(payload.merchantSession);
    } catch (error) {
      await this.continueICMOrderCreation(this.orderContext.orderId);
      session.abort();
      this.loading = false;
    }
  }

  /**
   * Handles the payment authorization callback from Apple Pay.
   */
  private async onPaymentAuthorized(
    event: ApplePayPaymentAuthorizedEvent,
    session: ApplePaySessionInstance
  ): Promise<void> {
    try {
      // Confirm the order with PayPal
      await this.paypalApplePay.confirmOrder({
        orderId: this.orderContext.paypalOrderId,
        token: event.payment.token,
        billingContact: this.mapBillingContactData(),
      });

      // Complete the payment
      const result = await this.continueICMOrderCreation(this.orderContext.orderId);
      if (result.status === 'SUCCESS') {
        session.completePayment({ status: ApplePaySession.STATUS_SUCCESS });
      } else {
        session.completePayment({ status: ApplePaySession.STATUS_FAILURE });
      }
    } catch (error) {
      this.checkoutFacade.processPaypalOrderCreation(this.orderContext.orderId);
      session.completePayment({ status: ApplePaySession.STATUS_FAILURE });
    } finally {
      this.loading = false;
    }
  }

  /**
   * ICM order creation needs to be continued after Apple Pay authorization.
   */
  private async continueICMOrderCreation(orderId: string): Promise<{ status: 'SUCCESS' | 'CANCELLED' | 'ERROR' }> {
    const orderContextPromise = firstValueFrom(
      this.paypalDataTransferService.paypalOrder$.pipe(
        filter(order => !!order?.orderStatus),
        take(1)
      )
    );

    this.checkoutFacade.processPaypalOrderCreation(orderId);

    const orderContext = await orderContextPromise;

    return {
      status: orderContext.orderStatus,
    };
  }
}
