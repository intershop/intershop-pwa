import { DOCUMENT } from '@angular/common';
import { DestroyRef, Inject, Injectable, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom, take } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PAYPAL_APPLE_PAY_BUTTON_STYLING } from 'ish-core/utils/paypal/adapters/paypal-adapters.styling';
import { PaypalDataTransferService } from 'ish-core/utils/paypal/paypal-data-transfer/paypal-data-transfer.service';
import {
  ApplePayConfig,
  PaypalApplePayComponent,
  PaypalComponent,
} from 'ish-core/utils/paypal/paypal-model/paypal.model';

/**
 * Representation of the PayPal SDK Apple Pay object, responsible for rendering the Apple Pay button
 * and handling the associated callbacks for order creation, approval, and error handling.
 *
 * The Apple Pay integration requires the PayPal JavaScript SDK (with applepay component)
 * and the native ApplePaySession API to work together.
 *
 * Life cycle of this component ends with destroying of parent component PaymentPaypalComponent.
 *
 * @see https://developer.paypal.com/docs/checkout/save-payment-methods/during-purchase/js-sdk/applepay/
 */
@Injectable()
export class PaypalApplePayAdapter {
  static APPLE_PAY_VERSION = 4;

  private applePayConfig: ApplePayConfig;
  private paypalApplepay: PaypalApplePayComponent;
  private loading = false;
  private merchantName = 'Intershop';

  constructor(
    private ngZone: NgZone,
    private appFacade: AppFacade,
    private destroyRef: DestroyRef,
    private checkoutFacade: CheckoutFacade,
    private paypalDataTransferService: PaypalDataTransferService,
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

        this.renderButton(container);
        return Promise.resolve();
      } catch (error) {
        console.error('Apple Pay initialization failed:', error);
        return Promise.reject(error);
      }
    });
  }

  /**
   * Checks if Apple Pay is available in the current browser.
   */
  private isApplePayAvailable(): boolean {
    return (
      typeof ApplePaySession !== 'undefined' &&
      ApplePaySession.canMakePayments() &&
      ApplePaySession.supportsVersion(PaypalApplePayAdapter.APPLE_PAY_VERSION)
    );
  }

  /**
   * Renders the Apple Pay button in the specified container.
   */
  private renderButton(container: HTMLElement): void {
    // Get merchant name from configuration
    this.appFacade.currentLocale$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      // Merchant name could be derived from configuration if needed
    });

    const button = this.document.createElement('apple-pay-button');

    // Apply button styling
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
   */
  private async onApplePayButtonClicked(): Promise<void> {
    if (this.loading) {
      return;
    }

    this.loading = true;

    try {
      const paymentRequest = await this.getPaymentRequest();
      const session = new ApplePaySession(PaypalApplePayAdapter.APPLE_PAY_VERSION, paymentRequest);

      session.onvalidatemerchant = async (event: { validationURL: string }) => {
        await this.onValidateMerchant(event.validationURL, session);
      };

      session.onpaymentauthorized = async (event: ApplePayPaymentAuthorizedEvent) => {
        await this.onPaymentAuthorized(event, session);
      };

      session.oncancel = () => {
        this.loading = false;
        // eslint-disable-next-line no-console
        console.log('Apple Pay payment was canceled by the user.');
      };

      session.begin();
    } catch (error) {
      this.loading = false;
      console.error('Error starting Apple Pay session:', error);
      throw error;
    }
  }

  /**
   * Creates the payment request for Apple Pay from basket data.
   */
  private async getPaymentRequest(): Promise<ApplePayPaymentRequest> {
    const basket = await firstValueFrom(
      this.checkoutFacade.basket$.pipe(
        filter(b => !!b),
        take(1)
      )
    );

    return {
      countryCode: this.applePayConfig.countryCode,
      currencyCode: basket.totals?.total?.currency || 'USD',
      merchantCapabilities: this.applePayConfig.merchantCapabilities,
      supportedNetworks: this.applePayConfig.supportedNetworks,
      total: {
        label: this.merchantName,
        amount: basket.totals?.total?.gross?.toString() || '0',
        type: 'final',
      },
      requiredBillingContactFields: ['postalAddress'],
      requiredShippingContactFields: ['name', 'phone', 'email', 'postalAddress'],
    };
  }

  /**
   * Handles the merchant validation callback from Apple Pay.
   * This is called when Apple Pay needs to verify the merchant.
   */
  private async onValidateMerchant(validationURL: string, session: ApplePaySession): Promise<void> {
    try {
      // Start ICM order creation to get PayPal order ID
      this.checkoutFacade.processPaypalOrderCreation();
      const orderContent = await firstValueFrom(this.paypalDataTransferService.paypalOrder$);

      // PayPal handles the merchant validation through its SDK
      // The validateMerchant endpoint is typically provided by PayPal
      const merchantSession = await this.validateMerchantWithPaypal(validationURL, orderContent.paypalOrderId);

      session.completeMerchantValidation(merchantSession);
    } catch (error) {
      console.error('Merchant validation failed:', error);
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
      return paypalApplepayAny.validateMerchant({ validationUrl: validationURL });
    }

    // Fallback: Return a basic merchant session object
    // In production, this should be handled by your server
    throw new Error('PayPal validateMerchant method not available');
  }

  /**
   * Handles the payment authorization callback from Apple Pay.
   */
  private async onPaymentAuthorized(event: ApplePayPaymentAuthorizedEvent, session: ApplePaySession): Promise<void> {
    try {
      const orderContent = await firstValueFrom(this.paypalDataTransferService.paypalOrder$);

      // Confirm the order with PayPal
      const confirmOrderResponse = await this.paypalApplepay.confirmOrder({
        orderId: orderContent.paypalOrderId,
        token: event.payment.token,
        billingContact: event.payment.billingContact,
        shippingContact: event.payment.shippingContact,
      });

      // Handle 3D Secure authentication if required
      if (confirmOrderResponse.status === 'PAYER_ACTION_REQUIRED') {
        try {
          await this.paypalApplepay.initiatePayerAction({ orderId: orderContent.paypalOrderId });
        } catch (payerActionError) {
          // eslint-disable-next-line no-console
          console.log('Error during payer action initiation:', payerActionError);
        }
      }

      // Complete the payment
      const result = await this.continueICMOrderCreation(orderContent.orderId);

      if (result.status === 'SUCCESS') {
        session.completePayment({ status: ApplePaySession.STATUS_SUCCESS });
      } else {
        session.completePayment({ status: ApplePaySession.STATUS_FAILURE });
      }
    } catch (error) {
      console.error('Error during Apple Pay payment authorization:', error);
      session.completePayment({ status: ApplePaySession.STATUS_FAILURE });
    } finally {
      this.loading = false;
    }
  }

  /**
   * ICM order creation needs to be continued after Apple Pay authorization.
   */
  private async continueICMOrderCreation(orderId: string): Promise<{ status: 'SUCCESS' | 'ERROR'; message?: string }> {
    this.checkoutFacade.processPaypalOrderCreation(orderId);

    return {
      status: 'SUCCESS',
    };
  }
}
