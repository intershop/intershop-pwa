import { DOCUMENT } from '@angular/common';
import { DestroyRef, Inject, Injectable, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom, map, race, switchMap, take, timer } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { OrderService } from 'ish-core/services/order/order.service';
import { PaymentPaypalService } from 'ish-core/services/payment-paypal/payment-paypal.service';
import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PAYPAL_GOOGLE_PAY_BUTTON_STYLING } from 'ish-core/utils/paypal/adapters/paypal-adapters.styling';
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
  private loading = false;

  constructor(
    private ngZone: NgZone,
    private appFacade: AppFacade,
    private destroyRef: DestroyRef,
    private checkoutFacade: CheckoutFacade,
    private orderService: OrderService,
    private paymentPaypalService: PaymentPaypalService,
    private scriptLoaderService: ScriptLoaderService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Renders the Google Pay button in the specified container.
   *
   * This method:
   * 1. Loads the Google Pay JavaScript SDK
   * 2. Initializes the PayPal Google Pay component
   * 3. Checks eligibility
   * 4. Creates and renders the Google Pay button
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
        // Load Google Pay SDK => URL: http://pay.google.com/gp/p/js/pay.js
        await this.loadGooglePaySdk();

        // Initialize PayPal Google Pay component
        this.paypalGooglepay = paypalObject.Googlepay();

        // Get Google Pay configuration from PayPal
        // This can fail if Google Pay is not enabled in the merchant's PayPal account
        try {
          this.googlePayConfig = await this.paypalGooglepay.config();
        } catch (configError) {
          console.error('Paypal Google Pay configuration could not estimated:', configError);
          return Promise.reject(configError);
        }

        // Initialize Google Payments Client
        this.googlePaymentClient = this.createGooglePaymentClient();

        // Check if Google Pay is available
        const isReadyToPay = await this.googlePaymentClient.isReadyToPay({
          apiVersion: PaypalGooglePayAdapter.GOOGLE_PAY_API_VERSION,
          apiVersionMinor: PaypalGooglePayAdapter.GOOGLE_PAY_API_VERSION_MINOR,
          allowedPaymentMethods: this.googlePayConfig.allowedPaymentMethods,
        });

        if (!isReadyToPay.result) {
          return Promise.reject('Google Pay is not available for the current user or device');
        }

        // Render the Google Pay button
        this.renderButton(container);
        return Promise.resolve();
      } catch (error) {
        console.error('Google Pay initialization failed:', error);
        return Promise.reject(error);
      }
    });
  }

  /**
   * Loads the Google Pay JavaScript SDK.
   */
  private async loadGooglePaySdk(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).google?.payments?.api?.PaymentsClient) {
      return Promise.resolve();
    }

    await firstValueFrom(
      this.scriptLoaderService.load(this.googlePaySdkUrl, {
        attributes: [{ name: 'async', value: 'true' }],
      })
    );

    // Wait for Google Pay to be available
    await new Promise<void>((resolve, reject) => {
      const checkGoogle = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).google?.payments?.api?.PaymentsClient) {
          resolve();
        } else {
          setTimeout(checkGoogle, 100);
        }
      };
      setTimeout(() => reject(new Error('Google Pay SDK failed to load')), 5000);
      checkGoogle();
    });
  }

  /**
   * Creates a Google Payments Client instance.
   */
  private createGooglePaymentClient(): GooglePayPaymentClient {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const googlePayments = (window as any).google.payments.api;
    return new googlePayments.PaymentsClient({
      environment: 'TEST',
      paymentDataCallbacks: {
        onPaymentAuthorized: (paymentData: GooglePayPaymentData) =>
          this.ngZone.run(() => this.onPaymentAuthorizedCallback(paymentData)),
      },
    });
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

    const button = this.googlePaymentClient.createButton(buttonOptions);
    container.appendChild(button);
  }

  /**
   * Handles the Google Pay button click event.
   * Creates the payment data request and opens the Google Pay payment sheet.
   */
  private async onGooglePayButtonClicked(): Promise<void> {
    if (this.loading) {
      return;
    }

    this.loading = true;

    try {
      const paymentDataRequest = await this.getPaymentDataRequest();
      await this.googlePaymentClient.loadPaymentData(paymentDataRequest);
    } catch (error) {
      this.loading = false;
      if ((error as { statusCode: string }).statusCode !== 'CANCELED') {
        console.error('Google Pay payment failed:', error);
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
   * This is called when the user authorizes the payment in the Google Pay sheet.
   */
  private async onPaymentAuthorizedCallback(
    paymentData: GooglePayPaymentData
  ): Promise<GooglePayPaymentAuthorizationResult> {
    let orderContent = { orderId: '', paypalOrderId: '' };
    try {
      // Create order and set experience context on ICM
      orderContent = await this.createOrder();

      // Confirm order with PayPal
      if (orderContent) {
        const confirmOrderResponse = await this.paypalGooglepay.confirmOrder({
          orderId: orderContent.paypalOrderId,
          paymentMethodData: paymentData.paymentMethodData,
        });

        if (confirmOrderResponse.status === 'PAYER_ACTION_REQUIRED') {
          // Handle 3D Secure authentication
          await this.paypalGooglepay.initiatePayerAction({ orderId: orderContent.paypalOrderId });
        }
        if (confirmOrderResponse.status === 'APPROVED') {
          this.checkoutFacade.continueOrderCreation(orderContent.orderId);

          return Promise.resolve({ transactionState: 'SUCCESS' });
        }
        return Promise.reject({
          transactionState: 'ERROR',
          error: {
            intent: 'PAYMENT_AUTHORIZATION',
            message: 'Payment authorization failed',
            reason: confirmOrderResponse.status,
          },
        });
      }
    } catch (error) {
      console.error('Payment authorization failed:', error);
      this.loading = false;
      this.checkoutFacade.rollbackOrderCreation(orderContent.orderId);

      return Promise.reject({
        transactionState: 'ERROR',
        error: {
          intent: 'PAYMENT_AUTHORIZATION',
          message: 'Payment could not be processed',
          reason: 'PAYMENT_DATA_INVALID',
        },
      });
    }
  }

  /**
   * Creates an order via the checkout facade and waits for the order ID.
   */
  private async createOrder(): Promise<{ orderId: string; paypalOrderId: string }> {
    const orderIds$ = this.checkoutFacade.basket$.pipe(
      map(basket => basket?.id),
      switchMap(basketId =>
        this.orderService.createOrder(basketId, true).pipe(
          filter(
            order =>
              order.orderCreation?.status === 'STOPPED' &&
              order.orderCreation.stopAction.exitReason === 'paypal_wallet_initialized'
          ),
          map(order => ({
            orderId: order.id,
            paypalOrderId: order.orderCreation.redirect?.parameters.find(p => p.name === 'PayPalOrderID')?.value || '',
          }))
        )
      )
    );

    const timeout$ = timer(3000).pipe(
      map(() => {
        throw new Error('PayPal order ID not received within 3 seconds');
      })
    );

    return firstValueFrom(race(orderIds$, timeout$));
  }
}
