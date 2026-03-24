import { DOCUMENT } from '@angular/common';
import { DestroyRef, Inject, Injectable, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private googlePayApiVersion: number[];
  private googlePayEnvironment: string;

  private readonly googlePaySdkUrl = 'https://pay.google.com/gp/p/js/pay.js';
  private googlePaymentClient: GooglePayPaymentClient;
  private googlePayConfig: GooglePayConfig;
  private paypalGooglepay: PaypalGooglePayComponent;
  private orderId: string;
  private paypalOrderId: string;

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
   * Renders the Google Pay button in the specified container.
   *
   * @param config - Configuration for the Google Pay component
   * @returns Promise that resolves when the button is rendered
   */
  async renderGooglePayButton(config: PaypalComponentsConfig): Promise<void> {
    const containerId = config.containerId;
    const container = this.document.getElementById(containerId);
    this.appFacade
      .paypalClientConfig$()
      .pipe(take(1))
      .subscribe(paypalSettings => {
        this.googlePayApiVersion = paypalSettings.googlePay
          ? paypalSettings.googlePay.apiVersion?.split('.').map(num => Number.parseInt(num, 10))
          : [2, 0];
        this.googlePayEnvironment = paypalSettings.googlePay ? paypalSettings.googlePay.environment : 'TEST';
      });

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
          apiVersion: this.googlePayApiVersion[0],
          apiVersionMinor: this.googlePayApiVersion[1],
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
        environment: this.googlePayEnvironment,
        merchantInfo: this.googlePayConfig?.merchantInfo,
        paymentDataCallbacks: {
          onPaymentAuthorized: (paymentData: GooglePayPaymentData) => this.onPaymentAuthorizedCallback(paymentData),
        },
      });
    }
    return this.googlePaymentClient;
  }

  /**
   * Renders the Google Pay button in the specified container.
   */
  private renderButton(container: HTMLElement): void {
    container.innerHTML = '';
    let buttonLocale = 'en';
    this.appFacade.currentLocale$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(locale => {
      if (locale) {
        buttonLocale = locale.trim().split('_')[0];
      }
    });
    const buttonOptions: GooglePayButtonOptions = {
      onClick: () => this.onGooglePayButtonClicked(),
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
    try {
      // Step 1: Start order creation and wait for orderId to be available
      await this.startOrderCreation();

      // Step 2: Create payment data request with basket information
      const paymentDataRequest = await this.getPaymentDataRequest();

      // Step 3: Load payment data - this triggers onPaymentAuthorized callback
      await this.getGooglePaymentsClient().loadPaymentData(paymentDataRequest);
    } catch (error) {
      // User closed the Google Pay popup without completing payment
      if (error.statusCode === 'CANCELED' && this.orderId) {
        this.checkoutFacade.processPaypalOrderCreation(this.orderId);
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
      apiVersion: this.googlePayApiVersion[0],
      apiVersionMinor: this.googlePayApiVersion[1],
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
  private async onPaymentAuthorizedCallback(
    paymentData: GooglePayPaymentData
  ): Promise<GooglePayPaymentAuthorizationResult> {
    try {
      const confirmOrderResponse = await this.paypalGooglepay.confirmOrder({
        orderId: this.paypalOrderId,
        paymentMethodData: paymentData.paymentMethodData,
      });

      if (confirmOrderResponse.status === 'APPROVED') {
        return await this.continueICMOrderCreation();
      } else if (confirmOrderResponse.status === 'PAYER_ACTION_REQUIRED') {
        // Handle 3D Secure authentication using .then() pattern as recommended
        this.paypalGooglepay
          .initiatePayerAction({ orderId: this.paypalOrderId })
          .then(async () => await this.continueICMOrderCreation())
          .catch(async () => await this.continueICMOrderCreation());
        // Return immediately so Google Pay sheet closes
        return { transactionState: 'SUCCESS' };
      } else {
        return await this.continueICMOrderCreation();
      }
    } catch (error) {
      return await this.continueICMOrderCreation();
    }
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
    this.checkoutFacade.processPaypalOrderCreation(this.orderId);
    return { transactionState: 'SUCCESS' };
  }
}
