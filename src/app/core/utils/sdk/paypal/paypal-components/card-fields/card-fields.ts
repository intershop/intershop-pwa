import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { whenTruthy } from 'ish-core/utils/operators';
import { PAYPAL_CART_FIELDS_STYLING } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.styling';

import { PayPalCardFieldsComponent } from './paypal-card-fields.interface';

/**
 * Configuration interface for PayPal card fields styling
 */
export interface CardFieldsStyleConfig {
  input?: {
    'font-size'?: string;
    'font-family'?: string;
    'font-weight'?: string;
    color?: string;
  };
  '.invalid'?: {
    color?: string;
  };
}

/**
 * Configuration interface for PayPal card fields
 */
export interface CardFieldsConfig {
  createOrder(): Promise<string>;
  onApprove(data: { orderID: string }): Promise<void>;
  onError?(error: unknown): void;
  style?: CardFieldsStyleConfig;
}

/**
 * PayPal Card Fields service for handling PayPal hosted card input fields.
 *
 * This service provides TypeScript/Angular integration for PayPal's CardFields component,
 * which allows secure collection of credit card information through hosted fields.
 *
 * Key features:
 * - Secure hosted card input fields (name, number, CVV, expiry)
 * - Integration with PayPal's payment processing
 * - Customizable styling and validation
 * - Angular-compatible error handling and navigation
 */
@Injectable({ providedIn: 'root' })
export class PayPalCardFieldsService {
  paymentMethod: PaymentMethod;
  constructor(
    private ngZone: NgZone,
    private router: Router,
    private checkoutFacade: CheckoutFacade,
    private paymentService: PaymentService,
    private translateService: TranslateService
  ) {}

  /**
   * Creates and renders PayPal card fields in the specified containers.
   *
   * @param scriptNamespace - The PayPal SDK namespace on the window object
   * @param config - Configuration for the card fields
   * @returns Promise that resolves when all fields are rendered
   */
  async renderCardFields(scriptNamespace: string, paymentMethod: PaymentMethod): Promise<void> {
    // Access PayPal SDK from window object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paypalObject = (window as any)[scriptNamespace];

    if (!paypalObject?.CardFields) {
      return Promise.reject(new Error(`PayPal CardFields not available on namespace '${scriptNamespace}'`));
    }

    // Run PayPal SDK operations inside Angular zone to ensure proper event handling
    return this.ngZone.run(async () => {
      try {
        // Initialize CardFields with MINIMAL configuration - exactly as official PayPal example
        // NO style parameter - this may interfere with keyboard input
        const cardField = paypalObject.CardFields({
          createOrder: () => this.ngZone.run(() => this.createOrder()),
          onApprove: (data: { orderID: string }) => this.ngZone.run(() => this.onApprove(data)),
          onError: (error: unknown) => this.ngZone.run(() => this.errorHandler(error)),
        }) as PayPalCardFieldsComponent;

        // Check if card fields are eligible
        if (!cardField.isEligible()) {
          console.warn('PayPal card fields are not eligible for this configuration');
          throw new Error('INELIGIBLE'); // Throw specific error for ineligibility
        }

        // Render individual fields outside Angular zone for proper iframe interaction
        await this.renderIndividualFields(cardField);

        // set payment method for use in createOrder
        this.paymentMethod = paymentMethod;

        // Setup submit button handler
        this.setupSubmitHandler(cardField);
      } catch (error) {
        console.error('PayPal card fields rendering failed:', error);
        return Promise.reject(error);
      }
    });
  }

  /**
   * Renders individual card input fields (name, number, CVV, expiry).
   *
   * Note: PayPal SDK may trigger browser warnings about geolocation permissions.
   * This is expected behavior from PayPal's fraud detection mechanisms and does not
   * affect functionality. The warning can be safely ignored or suppressed via
   * Permissions-Policy headers if needed.
   */
  private async renderIndividualFields(cardField: PayPalCardFieldsComponent): Promise<void> {
    // Render name field
    const nameField = cardField.NameField({
      style: PAYPAL_CART_FIELDS_STYLING,
      placeholder: this.translateService.instant('checkout.credit_card.holder.placeholder'),
    });
    await nameField.render('#card-name-field-container');

    // Render number field
    const numberField = cardField.NumberField({
      style: PAYPAL_CART_FIELDS_STYLING,
      placeholder: this.translateService.instant('checkout.credit_card.number.label'),
      // inputEvents,  // Temporarily remove to test
    });
    await numberField.render('#card-number-field-container');

    // Render CVV field
    const cvvField = cardField.CVVField({
      style: PAYPAL_CART_FIELDS_STYLING,
      placeholder: this.translateService.instant('checkout.credit_card.cvc.label'),
      // inputEvents,  // Temporarily remove to test
    });
    await cvvField.render('#card-cvv-field-container');

    // Render expiry field
    const expiryField = cardField.ExpiryField({
      style: PAYPAL_CART_FIELDS_STYLING,
      placeholder: this.translateService.instant('checkout.credit_card.expiration_date.placeholder'),
      // inputEvents,  // Temporarily remove to test
    });
    await expiryField.render('#card-expiry-field-container');
  }

  /**
   * Sets up the submit button event handler for card field submission.
   */
  private setupSubmitHandler(cardField: PayPalCardFieldsComponent): void {
    const submitButton = document.getElementById('card-field-submit-button');

    if (submitButton) {
      submitButton.addEventListener('click', () => {
        this.ngZone.run(async () => {
          try {
            cardField.submit();
            // Submit successful - handle success case
            this.handleSubmitSuccess();
          } catch (error) {
            this.handleSubmitError(error);
          }
        });
      });
    }
  }

  /**
   * Creates PayPal order through the checkout facade.
   */
  async createOrder(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.paymentService
        .createBasketPayment({
          id: undefined,
          paymentMethod: this.paymentMethod.id,
        })
        .pipe(
          whenTruthy(),
          switchMap(paymentInstrument =>
            this.paymentService.setBasketPayment(paymentInstrument.id).pipe(
              whenTruthy(),
              switchMap(() => this.paymentService.initializePayPal3DSecureFlow())
            )
          )
        )
        .subscribe({
          next: orderID => resolve(orderID),
          error: error => reject(error),
        });
    });
  }

  /**
   * Handles PayPal payment approval.
   */
  async onApprove(data: { orderID: string }): Promise<void> {
    console.log('PayPal payment approved with order ID:', data.orderID);
    try {
      // Navigate to checkout review or success page
      this.ngZone.run(() => {
        this.router.navigate(['/checkout/review'], {
          queryParams: { paypalOrderId: data.orderID },
        });
      });
    } catch (error) {
      console.error('PayPal approval handling failed:', error);
      this.showResultMessage(`Transaction could not be processed: ${error}`);
      throw error;
    }
  }

  /**
   * Default error handler for PayPal card fields.
   */
  private errorHandler(error: unknown): void {
    console.error('PayPal card fields error:', error);
    this.showResultMessage(`PayPal error: ${error}`);
  }

  /**
   * Handles successful card field submission.
   */
  private handleSubmitSuccess(): void {
    this.showResultMessage('Payment submitted successfully');
  }

  /**
   * Handles card field submission errors.
   */
  private handleSubmitError(error: unknown): void {
    console.error('Card field submission error:', error);
    this.showResultMessage(`Payment submission failed: ${error}`);
  }

  /**
   * Gets default styling configuration for card fields.
   */
  private getDefaultStyle(): CardFieldsStyleConfig {
    return {
      input: {
        'font-size': '16px',
        'font-family': 'courier, monospace',
        'font-weight': 'lighter',
        color: '#ccc',
      },
      '.invalid': {
        color: 'purple',
      },
    };
  }

  /**
   * Displays result messages to the user.
   * In a real implementation, this should integrate with the application's notification system.
   */
  private showResultMessage(message: string): void {
    const container = document.querySelector('#result-message');
    if (container) {
      container.innerHTML = message;
    }
    // TODO: Integrate with application's notification/toast system
    console.log('PayPal message:', message);
  }
}
