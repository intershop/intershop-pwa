import { DOCUMENT } from '@angular/common';
import { DestroyRef, Inject, Injectable, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { filter, firstValueFrom, take } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PAYPAL_GOOGLE_PAY_BUTTON_STYLING } from 'ish-core/utils/paypal/adapters/paypal-adapters.styling';
import { PaypalDataTransferService } from 'ish-core/utils/paypal/paypal-data-transfer/paypal-data-transfer.service';
import {
  GooglePayButtonOptions,
  GooglePayConfig,
  GooglePayPaymentAuthorizationResult,
  GooglePayPaymentClient,
  GooglePayPaymentData,
  GooglePayPaymentDataRequest,
  PaypalComponent,
  PaypalGooglePayComponent,
} from 'ish-core/utils/paypal/paypal-model/paypal.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

/**
 * Representation of the PayPal SDK Google Pay object, responsible for rendering the Google Pay button
 * and handling the associated callbacks for order creation, approval, and error handling.
 *
 * The Google Pay integration requires both the PayPal JavaScript SDK (with googlepay component)
 * and the Google Pay JavaScript SDK to work together.
 *
 * Life cycle of this component ends with destroying of parent component PaymentPaypalComponent.
 */
@Injectable()
export class PaypalGooglePayAdapter {
  static GOOGLE_PAY_API_VERSION = 2;
  static GOOGLE_PAY_API_VERSION_MINOR = 0;

  private readonly googlePaySdkUrl = 'https://pay.google.com/gp/p/js/pay.js';
  private googlePaymentClient: GooglePayPaymentClient;
  private googlePayConfig: GooglePayConfig;
  private paypalGooglepay: PaypalGooglePayComponent;
  private isCancelled = false;
  private orderId: string;
  private paypalOrderId: string;

  constructor(
    private ngZone: NgZone,
    private appFacade: AppFacade,
    private destroyRef: DestroyRef,
    private checkoutFacade: CheckoutFacade,
    private paypalDataTransferService: PaypalDataTransferService,
    private scriptLoaderService: ScriptLoaderService,
    private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Renders the Google Pay button in the specified container.
   *
   * @param config - Configuration for the Google Pay component
   * @returns Promise that resolves when the button is rendered
   */
  async renderGooglePayButton(config: PaypalComponentsConfig): Promise<void> {
    const containerId = config.containerId;
    const container = this.document.getElementById(containerId);

    if (!container) {
      return Promise.reject(new Error(`Container element '${containerId}' not found in DOM`));
    }

    // Access PayPal SDK from window object
    const paypalObject = (window as unknown as Record<string, PaypalComponent>)[config.scriptNamespace];

    if (!paypalObject?.Googlepay) {
      return Promise.reject(new Error(`PayPal Googlepay not available on namespace '${config.scriptNamespace}'`));
    }

    return this.ngZone.run(async () => {
      try {
        await this.loadGooglePaySdk();

        // Initialize PayPal Google Pay component
        this.paypalGooglepay = paypalObject.Googlepay();

        // Get Google Pay configuration from PayPal
        try {
          this.googlePayConfig = await this.paypalGooglepay.config();
        } catch (configError) {
          return Promise.reject(configError);
        }

        // Check if Google Pay is available
        const isReadyToPay = await this.getGooglePaymentsClient().isReadyToPay({
          apiVersion: PaypalGooglePayAdapter.GOOGLE_PAY_API_VERSION,
          apiVersionMinor: PaypalGooglePayAdapter.GOOGLE_PAY_API_VERSION_MINOR,
          allowedPaymentMethods: this.googlePayConfig.allowedPaymentMethods,
        });

        if (!isReadyToPay.result) {
          return Promise.reject('Google Pay is not available for the current user or device');
        }

        this.renderButton(container);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    });
  }

  /**
   * Loads the Google Pay JavaScript SDK.
   */
  private async loadGooglePaySdk(): Promise<void> {
    this.scriptLoaderService
      .load(this.googlePaySdkUrl)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.loaded) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Failed to load Google Pay SDK'));
      });
  }

  /**
   * Get a Google Payments Client instance. In case of multiple calls, the same instance will be returned to avoid unnecessary re-initialization.
   * Must be called after googlePayConfig is loaded.
   */
  private getGooglePaymentsClient(): GooglePayPaymentClient {
    if (this.googlePaymentClient === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const googlePayments = (window as any).google.payments.api;
      this.googlePaymentClient = new googlePayments.PaymentsClient({
        environment: 'TEST',
        merchantInfo: this.googlePayConfig?.merchantInfo,
        paymentDataCallbacks: {
          onPaymentAuthorized: (paymentData: GooglePayPaymentData) =>
            this.ngZone.run(() => this.onPaymentAuthorizedCallback(paymentData)),
        },
      });
    }
    return this.googlePaymentClient;
  }

  /**
   * Renders the Google Pay button in the specified container.
   */
  private renderButton(container: HTMLElement): void {
    let buttonLocale = 'en';
    this.appFacade.currentLocale$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(locale => {
      if (locale) {
        buttonLocale = locale.trim().split('_')[0];
      }
    });
    const buttonOptions: GooglePayButtonOptions = {
      onClick: () => this.ngZone.run(() => this.onGooglePayButtonClicked()),
      allowedPaymentMethods: this.googlePayConfig.allowedPaymentMethods,
      ...(PAYPAL_GOOGLE_PAY_BUTTON_STYLING as GooglePayButtonOptions),
      buttonLocale,
    };

    const button = this.getGooglePaymentsClient().createButton(buttonOptions);
    container.appendChild(button);
  }

  /**
   * Handles the Google Pay button click event.
   * Creates the payment data request and opens the Google Pay payment sheet.
   * Order creation starts immediately when button is clicked to have PayPal order ID ready
   * when user completes Google Pay authentication.
   */
  private async onGooglePayButtonClicked(): Promise<void> {
    this.startOrderCreation();

    const paymentDataRequest = await this.getPaymentDataRequest();

    try {
      await this.getGooglePaymentsClient().loadPaymentData(paymentDataRequest);
    } catch (error) {
      // User closed the Google Pay popup without completing payment
      if (error.statusCode === 'CANCELED') {
        this.closePaypal3DSIframe();
        this.isCancelled = true;
        if (this.orderId) {
          this.checkoutFacade.processPaypalOrderCreation(this.orderId, true);
        }
        return;
      }
    }
  }

  /**
   * Creates the payment data request for Google Pay.
   */
  private async getPaymentDataRequest(): Promise<GooglePayPaymentDataRequest> {
    const basket = await firstValueFrom(
      this.checkoutFacade.basket$.pipe(
        filter(b => !!b),
        take(1)
      )
    );

    return {
      apiVersion: PaypalGooglePayAdapter.GOOGLE_PAY_API_VERSION,
      apiVersionMinor: PaypalGooglePayAdapter.GOOGLE_PAY_API_VERSION_MINOR,
      allowedPaymentMethods: this.googlePayConfig.allowedPaymentMethods,
      merchantInfo: this.googlePayConfig.merchantInfo,
      transactionInfo: {
        currencyCode: basket.totals?.total?.currency || 'USD',
        totalPriceStatus: 'FINAL',
        totalPrice: basket.totals?.total?.gross?.toString() || '0',
      },
      callbackIntents: ['PAYMENT_AUTHORIZATION'],
    };
  }

  /**
   * Handles the payment authorization callback from Google Pay.
   *
   * IMPORTANT: Google Pay requires this callback to resolve within 30 seconds.
   * If not resolved in time, Google Pay shows CALLBACK_TIMED_OUT to the user.
   * We use a 29-second internal timeout to return a controlled response before
   * Google Pay's hard timeout kicks in.
   */
  private async onPaymentAuthorizedCallback(
    paymentData: GooglePayPaymentData
  ): Promise<GooglePayPaymentAuthorizationResult> {
    const timeoutPromise = new Promise<GooglePayPaymentAuthorizationResult>(resolve => {
      setTimeout(() => {
        this.closePaypal3DSIframe();
        resolve({
          transactionState: 'ERROR',
          error: {
            intent: 'PAYMENT_AUTHORIZATION',
            message: this.translateService.instant('checkout.order_review.payment.googlepay.timeout.message'),
          },
        });
      }, 29000);
    });

    const paymentPromise = this.executePaymentFlow(paymentData);

    return Promise.race([paymentPromise, timeoutPromise]);
  }

  /**
   * Executes the actual PayPal payment flow.
   *
   * IMPORTANT for 3DS: The confirmOrder and initiatePayerAction calls must be
   * properly awaited in sequence. If not awaited correctly, the 3DS challenge
   * popup may appear in the background and be inaccessible on mobile devices.
   * See: https://developer.paypal.com/docs/multiparty/checkout/apm/google-pay/#strong-customer-authentication-sca
   */
  private async executePaymentFlow(paymentData: GooglePayPaymentData): Promise<GooglePayPaymentAuthorizationResult> {
    try {
      // Step 1: Confirm the order with PayPal using Google Pay payment data
      const confirmOrderResponse = await this.paypalGooglepay.confirmOrder({
        orderId: this.paypalOrderId,
        paymentMethodData: paymentData.paymentMethodData,
      });

      // Step 2: Handle different confirmation statuses
      if (confirmOrderResponse.status === 'APPROVED') {
        // Payment approved, continue with ICM order creation
        return await this.continueICMOrderCreation();
      } else if (confirmOrderResponse.status === 'PAYER_ACTION_REQUIRED') {
        // Handle 3D Secure authentication using .then() pattern as recommended
        return await this.handle3DSecure();
      } else {
        // Other status - continue with ICM order creation
        return await this.continueICMOrderCreation();
      }
    } catch (error) {
      return await this.continueICMOrderCreation();
    }
  }

  /**
   * Handle 3D Secure authentication.
   * Using Promise .then()/.catch() pattern as recommended by PayPal documentation.
   */
  private handle3DSecure(): Promise<GooglePayPaymentAuthorizationResult> {
    return this.paypalGooglepay
      .initiatePayerAction({ orderId: this.paypalOrderId })
      .then(async () =>
        // 3DS completed - liability shift is handled by backend
        this.isCancelled ? { transactionState: 'SUCCESS' as const } : await this.continueICMOrderCreation()
      )
      .catch(async () =>
        // 3DS failed - continue with ICM order creation to handle error state
        this.continueICMOrderCreation()
      );
  }

  /**
   * Removes PayPal 3DS iframes from the DOM.
   */
  private closePaypal3DSIframe(): void {
    // Remove PayPal contingency iframes (3DS challenge)
    const paypalIframes = this.document.querySelectorAll('iframe[name*="paypal"], iframe[src*="paypal"]');
    paypalIframes.forEach(iframe => {
      iframe.remove();
    });
  }

  /**
   * Start ICM order creation
   */
  private async startOrderCreation(): Promise<void> {
    this.checkoutFacade.processPaypalOrderCreation();

    // Wait for order content to be available before opening Google Pay sheet
    const orderContent = await firstValueFrom(
      this.paypalDataTransferService.paypalOrder$.pipe(
        filter(order => !!order),
        take(1)
      )
    );

    this.orderId = orderContent.orderId;
    this.paypalOrderId = orderContent.paypalOrderId;
  }

  /**
   * ICM order creation needs to be continued after Google Pay authorization, regardless of the result of the PayPal order confirmation.
   */
  private async continueICMOrderCreation(): Promise<GooglePayPaymentAuthorizationResult> {
    if (!this.orderId) {
      return {
        transactionState: 'SUCCESS',
      };
    }
    const authorizationResult = firstValueFrom(this.paypalDataTransferService.paypalOrderAuthorizationResult$);

    this.checkoutFacade.processPaypalOrderCreation(this.orderId);

    if ((await authorizationResult).status !== 'SUCCESS') {
      this.startOrderCreation();
      return {
        transactionState: 'ERROR',
        error: {
          intent: (await authorizationResult).message,
          message: (await authorizationResult).message,
        },
      };
    }

    return { transactionState: 'SUCCESS' };
  }
}
