import { DOCUMENT } from '@angular/common';
import { DestroyRef, Inject, Injectable, NgZone, isDevMode } from '@angular/core';
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
        environment: isDevMode() ? 'TEST' : 'PRODUCTION',
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
   */
  private async onGooglePayButtonClicked(): Promise<void> {
    if (this.loading) {
      return;
    }

    this.loading = true;
    const paymentDataRequest = await this.getPaymentDataRequest();

    // Set postion for Google Pay popup to avoid overlapping with PayPal 3DS iframe.
    // There are certain configurations, particularly in Google Chrome, where
    // the Google Pay pop-up window and the PayPal 3DS iframe overlap.
    // In this case, the customer cannot see the 3DS iframe.
    this.setPositionForGooglePayPopup();

    try {
      await this.getGooglePaymentsClient().loadPaymentData(paymentDataRequest);
    } catch (error) {
      this.loading = false;
      // User closed the Google Pay popup without completing payment
      if (error?.statusCode === 'CANCELED') {
        console.log('Google Pay payment was canceled by the user.');
        return;
      }
      throw error;
    }
  }

  /**
   * Intercepts window.open calls to position the Google Pay popup on the left side of the screen.
   */
  private setPositionForGooglePayPopup(): void {
    const originalWindowOpen = window.open.bind(window);
    window.open = (url?: string | URL, target?: string, features?: string): Window | null => {
      if (target === 'gp-js-popup') {
        // Get parent window position and dimensions
        const parentLeft = window.screenX ?? window.screenLeft ?? 0;
        const parentTop = window.screenY ?? window.screenTop ?? 0;
        const parentWidth = window.outerWidth;
        const parentHeight = window.outerHeight;

        const popupWidth = Math.min(Math.round(parentWidth * 0.25), 500);
        const popupHeight = Math.min(Math.round(parentHeight * 0.4), 600);

        // Position popup 70% from left edge of parent, vertically centered within parent
        const left = Math.round(parentLeft + parentWidth * 0.7);
        const top = Math.round(parentTop + (parentHeight - popupHeight) / 2);

        const positionedFeatures = `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,resizable=yes`;
        const popup = originalWindowOpen(url, target, positionedFeatures);

        // Firefox ignores left/top in window.open(), so use moveTo() as fallback
        if (popup) {
          try {
            popup.moveTo(left, top);
            popup.resizeTo(popupWidth, popupHeight);
          } catch {
            // moveTo/resizeTo may fail due to cross-origin restrictions - silently ignore
          }
        }

        return popup;
      }
      return originalWindowOpen(url, target, features);
    };
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
   */
  private async onPaymentAuthorizedCallback(
    paymentData: GooglePayPaymentData
  ): Promise<GooglePayPaymentAuthorizationResult> {
    // Start ICM order creation
    this.checkoutFacade.processPaypalOrderCreation();
    const orderContent = firstValueFrom(this.paypalDataTransferService.paypalOrder$);

    try {
      const confirmOrderResponse = await this.paypalGooglepay.confirmOrder({
        orderId: (await orderContent).paypalOrderId,
        paymentMethodData: paymentData.paymentMethodData,
      });
      // Handle 3D Secure authentication if required
      if (confirmOrderResponse.status === 'PAYER_ACTION_REQUIRED') {
        await this.paypalGooglepay.initiatePayerAction({ orderId: (await orderContent).paypalOrderId });
      }

      return this.continueICMOrderCreation((await orderContent).orderId);
    } catch (error) {
      console.error('Error during PayPal order confirmation or payer action:', error);
      return this.continueICMOrderCreation((await orderContent).orderId);
    }
  }

  /**
   * ICM order creation needs to be continued after Google Pay authorization, regardless of the result of the PayPal order confirmation.
   */
  private async continueICMOrderCreation(orderId: string): Promise<GooglePayPaymentAuthorizationResult> {
    const authorizationResult = firstValueFrom(this.paypalDataTransferService.paypalOrderAuthorizationResult$);

    this.checkoutFacade.processPaypalOrderCreation(orderId);

    return (await authorizationResult).status === 'SUCCESS'
      ? { transactionState: 'SUCCESS' }
      : {
          transactionState: 'ERROR',
          error: {
            intent: (await authorizationResult).message,
            message: (await authorizationResult).message,
          },
        };
  }
}
