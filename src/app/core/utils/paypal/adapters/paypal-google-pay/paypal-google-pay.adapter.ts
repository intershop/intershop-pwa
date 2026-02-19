import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { filter, firstValueFrom, take } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PAYPAL_GOOGLE_PAY_BUTTON_STYLING } from 'ish-core/utils/paypal/adapters/paypal-adapters.styling';
import { PaypalConfigService } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';
import {
  PaypalDataTransferService,
  PaypalOrderData,
} from 'ish-core/utils/paypal/paypal-data-transfer/paypal-data-transfer.service';
import {
  GooglePayButton,
  GooglePayConfig,
  GooglePayPaymentAuthorizationResult,
  GooglePayPaymentClient,
  PaypalGooglePayComponent,
} from 'ish-core/utils/paypal/paypal-model/paypal-google-pay.model';
import { PaypalComponent } from 'ish-core/utils/paypal/paypal-model/paypal.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

/**
 * Representation of the PayPal SDK Google Pay object, responsible for rendering the Google Pay button
 * and handling the associated callbacks for order creation, approval, and error handling.
 *
 * The Google Pay integration requires both the PayPal JavaScript SDK (with googlepay component)
 * and the Google Pay JavaScript SDK to work together.
 *
 * Life cycle of this class ends with destroying of parent component PaymentPaypalComponent.
 */
@Injectable()
export class PaypalGooglePayAdapter {
  static readonly GOOGLE_PAY_SDK_URL = 'https://pay.google.com/gp/p/js/pay.js';
  static readonly GOOGLE_PAY_API_VERSION_MAJOR = 2;
  static readonly GOOGLE_PAY_API_VERSION_MINOR = 0;

  private googlePaymentClient: GooglePayPaymentClient;
  private googlePayConfig: GooglePayConfig;
  private paypalGooglePay: PaypalGooglePayComponent;

  /**
   * Holds order context during the payment flow.
   * Set in startOrderCreation(), used in callbacks, cleared after flow completes.
   * Required because Google Pay's onPaymentAuthorized callback doesn't support custom parameters.
   */
  private orderContext: PaypalOrderData | undefined;
  // default locale for Google Pay button, will be updated to current locale on initialization
  private buttonLocale = 'en';

  constructor(
    private ngZone: NgZone,
    private appFacade: AppFacade,
    private checkoutFacade: CheckoutFacade,
    private paypalConfigService: PaypalConfigService,
    private paypalDataTransferService: PaypalDataTransferService,
    private scriptLoaderService: ScriptLoaderService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.appFacade.currentLocale$
      .pipe(
        filter(locale => !!locale),
        take(1)
      )
      .subscribe(locale => {
        this.buttonLocale = locale.trim().split('_')[0];
      });
  }

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

    const paypalObject = this.paypalConfigService.getPaypalComponent(config.paypalPaymentMethod);

    if (!paypalObject?.Googlepay) {
      return Promise.reject(new Error(`PayPal Googlepay not available on namespace '${config.scriptNamespace}'`));
    }

    return this.ngZone.run(async () => {
      try {
        const isGooglePayApplicable = await this.isGooglePayApplicable(paypalObject, true);

        if (!isGooglePayApplicable) {
          return Promise.reject('Google Pay is not available for the current user or device');
        }

        this.renderButton(container);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    });
  }

  private async isGooglePayApplicable(paypalObject: PaypalComponent, loadScript?: boolean): Promise<boolean> {
    if (loadScript) {
      await this.loadGooglePaySdk();
    }

    // Initialize PayPal Google Pay component
    this.paypalGooglePay = paypalObject.Googlepay();

    // Get Google Pay configuration from PayPal
    try {
      this.googlePayConfig = await this.paypalGooglePay.config();
    } catch (configError) {
      return Promise.reject(configError);
    }

    await this.createGooglePaymentsClient();
    // Check if Google Pay is available
    return await this.googlePaymentClient
      .isReadyToPay({
        apiVersion: PaypalGooglePayAdapter.GOOGLE_PAY_API_VERSION_MAJOR,
        apiVersionMinor: PaypalGooglePayAdapter.GOOGLE_PAY_API_VERSION_MINOR,
        allowedPaymentMethods: this.googlePayConfig.allowedPaymentMethods,
      })
      .then(result => result.result);
  }

  /**
   * Loads the Google Pay JavaScript SDK.
   */
  private async loadGooglePaySdk(): Promise<void> {
    const result = await firstValueFrom(
      this.scriptLoaderService.load(PaypalGooglePayAdapter.GOOGLE_PAY_SDK_URL).pipe(take(1))
    );
    if (!result.loaded) {
      throw new Error('Failed to load Google Pay SDK');
    }
  }

  /**
   * Get a Google Payments Client instance. In case of multiple calls, the same instance will be returned to avoid unnecessary re-initialization.
   * Must be called after googlePayConfig and googlePayEnvironment are loaded.
   */
  private async createGooglePaymentsClient() {
    if (this.googlePaymentClient) {
      return;
    }
    // Load Google Pay environment setting
    const paypalSettings = await firstValueFrom(this.appFacade.paypalClientConfig$.pipe(take(1)));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const googlePayments = (window as any).google.payments.api;
    this.googlePaymentClient = new googlePayments.PaymentsClient({
      environment: paypalSettings.googlePayEnvironment,
      merchantInfo: this.googlePayConfig?.merchantInfo,
      paymentDataCallbacks: {
        onPaymentAuthorized: (paymentData: { paymentMethodData: unknown }) =>
          this.onPaymentAuthorizedCallback(paymentData.paymentMethodData),
      },
    });
  }

  /**
   * Renders the Google Pay button in the specified container.
   */
  private renderButton(container: HTMLElement): void {
    container.replaceChildren();
    const buttonConfig: GooglePayButton = {
      onClick: () => {
        this.ngZone.run(() => this.onGooglePayButtonClicked());
      },
      allowedPaymentMethods: this.googlePayConfig.allowedPaymentMethods,
      ...(PAYPAL_GOOGLE_PAY_BUTTON_STYLING as GooglePayButton),
      buttonLocale: this.buttonLocale,
    };

    const button = this.googlePaymentClient.createButton(buttonConfig);
    container.appendChild(button);
  }

  /**
   * Handles the Google Pay button click event.
   * Creates the payment data request and opens the Google Pay payment sheet.
   * Order creation starts immediately when button is clicked to have PayPal order ID ready
   * when user completes Google Pay authentication.
   */
  private async onGooglePayButtonClicked(): Promise<void> {
    try {
      // Step 1: Start order creation and wait for orderId to be available
      await this.startOrderCreation();

      // Step 2: Create payment data request with basket information
      const paymentDataRequest = await this.getPaymentDataRequest();

      // Step 3: Load payment data - this triggers onPaymentAuthorized callback
      await this.googlePaymentClient.loadPaymentData(paymentDataRequest);
    } catch (error) {
      // User closed the Google Pay popup without completing payment
      if (
        error &&
        typeof error === 'object' &&
        (error as { statusCode?: string }).statusCode === 'CANCELED' &&
        this.orderContext?.orderId
      ) {
        this.continueICMOrderCreation();
      }
    }
  }

  /**
   * Creates the payment data request for Google Pay.
   */
  private async getPaymentDataRequest() {
    const basket = await firstValueFrom(
      this.checkoutFacade.basket$.pipe(
        filter(b => !!b),
        take(1)
      )
    );

    return {
      apiVersion: PaypalGooglePayAdapter.GOOGLE_PAY_API_VERSION_MAJOR,
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
   */
  private async onPaymentAuthorizedCallback(paymentMethodData: unknown): Promise<GooglePayPaymentAuthorizationResult> {
    try {
      const confirmOrderResponse = await this.paypalGooglePay.confirmOrder({
        orderId: this.orderContext?.paypalOrderId,
        paymentMethodData,
      });

      if (confirmOrderResponse.status === 'APPROVED') {
        return await this.continueICMOrderCreation();
      } else if (confirmOrderResponse.status === 'PAYER_ACTION_REQUIRED') {
        // Handle 3D Secure authentication using .then() pattern as recommended
        this.paypalGooglePay
          .initiatePayerAction({ orderId: this.orderContext?.paypalOrderId })
          .then(() => this.continueICMOrderCreation())
          .catch(() => this.continueICMOrderCreation());
        // Return immediately so Google Pay sheet closes
        return { transactionState: 'SUCCESS' };
      } else {
        return await this.continueICMOrderCreation();
      }
    } catch {
      return await this.continueICMOrderCreation();
    }
  }

  /**
   * Start ICM order creation
   */
  private async startOrderCreation(): Promise<void> {
    // Subscribe first, then dispatch action to avoid race condition with Subject
    const orderContentPromise = firstValueFrom(this.paypalDataTransferService.paypalOrder$.pipe(take(1)));

    this.checkoutFacade.processPaypalOrderCreation();

    // Wait for order content to be available before opening Google Pay sheet
    const orderContent = await orderContentPromise;

    if (orderContent.orderStatus === 'ERROR' || !orderContent.orderId || !orderContent.paypalOrderId) {
      throw new Error('Error during order creation');
    }

    this.orderContext = orderContent;
  }

  /**
   * ICM order creation needs to be continued after Google Pay authorization, regardless of the result of the PayPal order confirmation.
   */
  private async continueICMOrderCreation(): Promise<GooglePayPaymentAuthorizationResult> {
    if (!this.orderContext?.orderId) {
      this.orderContext = undefined;
      return { transactionState: 'ERROR' };
    }

    const orderContextPromise = firstValueFrom(
      this.paypalDataTransferService.paypalOrder$.pipe(
        filter(order => !!order?.orderStatus),
        take(1)
      )
    );

    this.checkoutFacade.processPaypalOrderCreation(this.orderContext.orderId);

    const orderContext = await orderContextPromise;
    this.orderContext = undefined;

    return {
      transactionState: orderContext.orderStatus === 'SUCCESS' ? 'SUCCESS' : 'ERROR',
    };
  }
}
