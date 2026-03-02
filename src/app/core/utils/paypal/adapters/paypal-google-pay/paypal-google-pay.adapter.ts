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
  private loading = false;

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
          console.error('Paypal Google Pay configuration could not estimated:', configError);
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
        console.error('Google Pay initialization failed:', error);
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
          Promise.resolve();
        }
      });
  }

  /**
   * Get a Google Payments Client instance. In case of multiple calls, the same instance will be returned to avoid unnecessary re-initialization.
   */
  private getGooglePaymentsClient(): GooglePayPaymentClient {
    if (this.googlePaymentClient === undefined) {
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
   */
  private async onGooglePayButtonClicked(): Promise<void> {
    if (this.loading) {
      return;
    }

    this.loading = true;
    const paymentDataRequest = await this.getPaymentDataRequest();
    await this.getGooglePaymentsClient().loadPaymentData(paymentDataRequest);
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
    // Start ICM order creation
    this.checkoutFacade.paypalOrderCreation();
    const orderContent = firstValueFrom(this.paypalDataTransferService.paypalOrder$);

    return this.handlePaypalOrderCreation(
      (await orderContent).paypalOrderId,
      (await orderContent).orderId,
      paymentData
    );
  }

  private async handlePaypalOrderCreation(
    paypalOrderId: string,
    orderId: string,
    paymentData: GooglePayPaymentData
  ): Promise<GooglePayPaymentAuthorizationResult> {
    try {
      const confirmOrderResponse = await this.paypalGooglepay.confirmOrder({
        orderId: paypalOrderId,
        paymentMethodData: paymentData.paymentMethodData,
      });

      // Handle 3D Secure authentication if required
      if (confirmOrderResponse.status === 'PAYER_ACTION_REQUIRED') {
        const payerActionResponse = await this.paypalGooglepay.initiatePayerAction({ orderId: paypalOrderId });

        // After 3DS, check liability shift - if not shifted, payment may still proceed
        // but merchant assumes liability for chargebacks
        if (payerActionResponse?.liabilityShift !== 'POSSIBLE') {
          console.warn('3DS liability shift not achieved:', payerActionResponse?.liabilityShift);
        }
      }
      if (confirmOrderResponse.status !== 'APPROVED') {
        return {
          transactionState: 'ERROR',
          error: {
            intent: 'PAYMENT_AUTHORIZATION',
            message: 'Payment authorization failed',
            reason: confirmOrderResponse.status,
          },
        };
      }
      return this.completeOrderAfterApproval(orderId);
    } catch (error) {
      this.completeOrderAfterApproval(orderId);
      return {
        transactionState: 'ERROR',
        error: {
          intent: 'PAYMENT_AUTHORIZATION',
          message: this.translateService.instant('checkout.credit_card.invalid.error'),
          reason: 'ERROR',
        },
      };
    }
  }

  /**
   * Completes the order after PayPal approval (either direct or after 3DS).
   */
  private async completeOrderAfterApproval(orderId: string): Promise<GooglePayPaymentAuthorizationResult> {
    const authorizationResult = firstValueFrom(this.paypalDataTransferService.paypalOrderAuthorizationResult$);

    this.checkoutFacade.paypalOrderCreation(orderId);

    return (await authorizationResult).status === 'SUCCESS'
      ? { transactionState: 'SUCCESS' }
      : {
          transactionState: 'ERROR',
          error: {
            intent: 'PAYMENT_AUTHORIZATION',
            message: 'Payment capture failed',
            reason: 'TRANSACTION FAILED',
          },
        };
  }
}
