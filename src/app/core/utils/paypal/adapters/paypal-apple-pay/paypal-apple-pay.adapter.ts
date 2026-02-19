import { DOCUMENT } from '@angular/common';
import { DestroyRef, Inject, Injectable, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom, map, race, switchMap, take, timer } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { OrderService } from 'ish-core/services/order/order.service';
import { PaymentPaypalService } from 'ish-core/services/payment-paypal/payment-paypal.service';
import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PAYPAL_APPLE_PAY_BUTTON_STYLING } from 'ish-core/utils/paypal/adapters/paypal-adapters.styling';
import {
  APPLE_PAY_STATUS,
  ApplePayConfig,
  ApplePayMerchantSession,
  ApplePayPaymentAuthorizedEvent,
  ApplePayPaymentRequest,
  ApplePaySession,
  ApplePayValidateMerchantEvent,
  PaypalApplePayComponent,
  PaypalComponent,
} from 'ish-core/utils/paypal/paypal-model/paypal.model';

/**
 * Representation of the PayPal SDK Apple Pay object, responsible for rendering the Apple Pay button
 * and handling the associated callbacks for order creation, approval, and error handling.
 *
 * The Apple Pay integration requires:
 * - PayPal JavaScript SDK (with applepay component)
 * - Safari browser on macOS or iOS device with Apple Pay capability
 * - HTTPS connection
 *
 * Life cycle of this component ends with destroying of parent component PaymentPaypalComponent.
 *
 * @see {@link https://developer.paypal.com/docs/checkout/apm/apple-pay/}
 */
@Injectable()
export class PaypalApplePayAdapter {
  static APPLE_PAY_VERSION = 4;

  private applePayConfig: ApplePayConfig;
  private paypalApplepay: PaypalApplePayComponent;
  private loading = false;
  private currentLocale = 'en';
  private currentCurrency = 'USD';

  constructor(
    private ngZone: NgZone,
    private appFacade: AppFacade,
    private destroyRef: DestroyRef,
    private checkoutFacade: CheckoutFacade,
    private orderService: OrderService,
    private paymentPaypalService: PaymentPaypalService,
    @Inject(DOCUMENT) private document: Document
  ) {
    // Subscribe to locale and currency changes
    this.appFacade.currentLocale$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(locale => {
      if (locale) {
        this.currentLocale = locale.trim().split('_')[0];
      }
    });

    this.appFacade.currentCurrency$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(currency => {
      if (currency) {
        this.currentCurrency = currency;
      }
    });
  }

  /**
   * Renders the Apple Pay button in the specified container.
   *
   * This method:
   * 1. Checks if Apple Pay is available on the device
   * 2. Initializes the PayPal Apple Pay component
   * 3. Fetches the Apple Pay configuration from PayPal
   * 4. Creates and renders the Apple Pay button
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

    // Check if Apple Pay is available on this device/browser
    if (!this.isApplePayAvailable()) {
      return Promise.reject(new Error('Apple Pay is not available on this device or browser'));
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
          console.error('PayPal Apple Pay configuration could not be retrieved:', configError);
          return Promise.reject(configError);
        }

        // Check if Apple Pay is eligible for this merchant
        if (!this.applePayConfig.isEligible) {
          return Promise.reject(new Error('Apple Pay is not eligible for this merchant'));
        }

        // Render the Apple Pay button
        this.renderButton(container);
        return Promise.resolve();
      } catch (error) {
        console.error('Apple Pay initialization failed:', error);
        return Promise.reject(error);
      }
    });
  }

  /**
   * Checks if Apple Pay is available on the current device/browser.
   * Apple Pay requires Safari on macOS or iOS device.
   */
  private isApplePayAvailable(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applePaySession = (window as any).ApplePaySession;
    return !!applePaySession && applePaySession.canMakePayments();
  }

  /**
   * Renders the Apple Pay button in the specified container.
   */
  private renderButton(container: HTMLElement): void {
    const button = this.document.createElement('apple-pay-button');

    // Apply styling
    const styling = PAYPAL_APPLE_PAY_BUTTON_STYLING;
    button.setAttribute('buttonstyle', 'black');
    button.setAttribute('type', 'check-out');
    button.setAttribute('locale', this.currentLocale);
    button.style.cssText = `${styling.height} ${styling.width} ${styling.borderRadius}`;

    // Add click handler
    button.addEventListener('click', () => this.ngZone.run(() => this.onApplePayButtonClicked()));

    container.appendChild(button);
  }

  /**
   * Handles the Apple Pay button click event.
   * Creates an Apple Pay session and handles the payment flow.
   */
  private async onApplePayButtonClicked(): Promise<void> {
    if (this.loading) {
      return;
    }

    this.loading = true;

    try {
      const paymentRequest = await this.getPaymentRequest();

      // Create Apple Pay session
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const applePaySessionClass = (window as any).ApplePaySession;
      const session: ApplePaySession = new applePaySessionClass(
        PaypalApplePayAdapter.APPLE_PAY_VERSION,
        paymentRequest
      );

      // Set up event handlers
      session.onvalidatemerchant = (event: ApplePayValidateMerchantEvent) => {
        this.ngZone.run(() => this.onValidateMerchant(event, session));
      };

      session.onpaymentauthorized = (event: ApplePayPaymentAuthorizedEvent) => {
        this.ngZone.run(() => this.onPaymentAuthorized(event, session));
      };

      session.oncancel = () => {
        this.loading = false;
      };

      // Begin the Apple Pay session
      session.begin();
    } catch (error) {
      this.loading = false;
      console.error('Apple Pay session creation failed:', error);
    }
  }

  /**
   * Creates the payment request for Apple Pay.
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
      currencyCode: this.currentCurrency,
      merchantCapabilities: this.applePayConfig.merchantCapabilities,
      supportedNetworks: this.applePayConfig.supportedNetworks,
      requiredBillingContactFields: ['name', 'phone', 'email', 'postalAddress'],
      requiredShippingContactFields: ['name', 'phone', 'email', 'postalAddress'],
      total: {
        label: 'Total',
        amount: basket.totals?.total?.gross?.toString() || '0',
        type: 'final',
      },
    };
  }

  /**
   * Handles the merchant validation event from Apple Pay.
   * Validates the merchant session with PayPal.
   */
  private async onValidateMerchant(event: ApplePayValidateMerchantEvent, session: ApplePaySession): Promise<void> {
    try {
      const merchantSession: ApplePayMerchantSession = await this.paypalApplepay.validateMerchant({
        validationUrl: event.validationURL,
      });

      session.completeMerchantValidation(merchantSession);
    } catch (error) {
      console.error('Merchant validation failed:', error);
      session.abort();
      this.loading = false;
    }
  }

  /**
   * Handles the payment authorization event from Apple Pay.
   * Confirms the order with PayPal and completes the payment.
   */
  private async onPaymentAuthorized(event: ApplePayPaymentAuthorizedEvent, session: ApplePaySession): Promise<void> {
    let orderContent = { orderId: '', paypalOrderId: '' };

    try {
      // Create order and set experience context on ICM
      orderContent = await this.createOrder();

      // Confirm order with PayPal
      if (orderContent) {
        const confirmOrderResponse = await this.paypalApplepay.confirmOrder({
          orderId: orderContent.paypalOrderId,
          token: event.payment.token,
          billingContact: event.payment.billingContact,
          shippingContact: event.payment.shippingContact,
        });

        if (confirmOrderResponse.status === 'APPROVED') {
          // Complete the Apple Pay session with success
          session.completePayment({ status: APPLE_PAY_STATUS.STATUS_SUCCESS });

          // Continue with order creation in PWA
          this.checkoutFacade.continueOrderCreation(orderContent.orderId);
          return;
        }

        // Handle payer action required (e.g., 3D Secure)
        if (confirmOrderResponse.status === 'PAYER_ACTION_REQUIRED') {
          session.completePayment({ status: APPLE_PAY_STATUS.STATUS_SUCCESS });
          this.checkoutFacade.continueOrderCreation(orderContent.orderId);
          return;
        }

        // Payment not approved
        session.completePayment({ status: APPLE_PAY_STATUS.STATUS_FAILURE });
        this.checkoutFacade.rollbackOrderCreation(orderContent.orderId);
      }
    } catch (error) {
      console.error('Payment authorization failed:', error);
      session.completePayment({ status: APPLE_PAY_STATUS.STATUS_FAILURE });
      this.loading = false;

      if (orderContent.orderId) {
        this.checkoutFacade.rollbackOrderCreation(orderContent.orderId);
      }
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
          switchMap(order =>
            this.paymentPaypalService.setExperienceContext(order.id).pipe(
              map(experienceContext => ({
                orderId: order.id,
                paypalOrderId: experienceContext.orderId,
              }))
            )
          )
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
