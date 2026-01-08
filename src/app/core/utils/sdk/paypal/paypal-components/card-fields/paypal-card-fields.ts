import { Injectable, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { whenTruthy } from 'ish-core/utils/operators';
import { PAYPAL_CART_FIELDS_STYLING } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.styling';
import {
  PayPalCardFieldsComponent,
  PayPalCardFieldsStateObject,
} from 'ish-core/utils/sdk/paypal/paypal-model/paypal.interface';

@Injectable({ providedIn: 'root' })
export class PayPalCardFields {
  paymentMethod: PaymentMethod;
  private paymentInstrument: PaymentInstrument;
  private cardFieldComponent: PayPalCardFieldsComponent;

  constructor(
    private ngZone: NgZone,
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
          onApprove: () => this.ngZone.run(() => this.onApprove()),
          onError: (error: unknown) => this.ngZone.run(() => this.errorHandler(error)),
        }) as PayPalCardFieldsComponent;

        // Check if card fields are eligible
        if (cardField.isEligible()) {
          // Store card field component for later access
          this.cardFieldComponent = cardField;

          // Render individual fields outside Angular zone for proper iframe interaction
          await this.renderIndividualFields(cardField);

          // set payment method for use in createOrder
          this.paymentMethod = paymentMethod;

          // Setup submit button handler
          this.setupSubmitHandler(cardField);
        }
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
    // Hide any existing error messages
    this.hideFieldError('card-name-field-error');

    // Render name field
    const nameField = cardField.NameField({
      style: PAYPAL_CART_FIELDS_STYLING,
      placeholder: '',
      inputEvents: {
        onChange: (state: PayPalCardFieldsStateObject): void => {
          if (state.emittedBy === 'name' && state.errors?.includes('INVALID_NAME')) {
            console.log('FAILURE');
            this.showFieldError('card-name-field-error', 'blubber');
          } else {
            console.log('NO FAILURE');
            this.hideFieldError('card-name-field-error');
          }
        },
      },
    });
    await nameField.render('#card-name-field-container');

    // Render number field
    const numberField = cardField.NumberField({
      style: PAYPAL_CART_FIELDS_STYLING,
      placeholder: '',
    });
    await numberField.render('#card-number-field-container');

    // Render CVV field
    const cvvField = cardField.CVVField({
      style: PAYPAL_CART_FIELDS_STYLING,
      placeholder: '',
    });
    await cvvField.render('#card-cvv-field-container');

    // Render expiry field
    const expiryField = cardField.ExpiryField({
      style: PAYPAL_CART_FIELDS_STYLING,
      placeholder: this.translateService.instant('checkout.credit_card.expiration_date.placeholder'),
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
            // Await the submit call to handle 3D Secure authentication properly
            this.checkoutFacade.initializePayPal3DSecureFlow();
            await cardField.submit();
          } catch (error) {
            // Check if error is due to popup being closed
            if (error instanceof Error && error.message.includes('Window closed')) {
              console.warn('3D Secure authentication was cancelled or popup was closed');
              this.showResultMessage('Payment authentication was cancelled. Please try again.');
            } else {
              const state = await cardField.getState();
              this.handleSubmitError(state);
            }
          }
        });
      });
    }
  }

  /**
   * Creates PayPal order through the checkout facade.
   * official PayPal developer documentation link: https://developer.paypal.com/studio/checkout/advanced/integrate
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
          switchMap(paymentInstrument => {
            this.paymentInstrument = paymentInstrument;
            return this.paymentService.setBasketPayment(paymentInstrument.id).pipe(
              whenTruthy(),
              switchMap(() => this.paymentService.initializePayPal3DSecureFlow())
            );
          })
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
  async onApprove(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.paymentService
        .approvePayPal3DSecure(this.paymentInstrument)
        .pipe(whenTruthy())
        .subscribe({
          next: () => {
            // After successful approval, reload eligible payment methods
            this.checkoutFacade.loadEligiblePaymentMethods();
            this.checkoutFacade.loadBasketAfterChanges();
            resolve();
          },
          error: error => reject(error),
        });
    });
  }

  /**
   * Resets card fields by clearing containers and re-rendering them.
   */
  private async resetCardFields(): Promise<void> {
    if (!this.cardFieldComponent) {
      return;
    }

    try {
      // Clear all field containers
      const containerIds = [
        'card-name-field-container',
        'card-number-field-container',
        'card-cvv-field-container',
        'card-expiry-field-container',
      ];

      containerIds.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
          container.innerHTML = '';
        }
      });

      // Re-render fields with empty values
      await this.renderIndividualFields(this.cardFieldComponent);
    } catch (error) {
      console.error('Error resetting card fields:', error);
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
   * Handles card field submission errors.
   */
  private handleSubmitError(error: PayPalCardFieldsStateObject): void {
    console.error('PayPal card fields error:', error);
    if (error.errors.includes('INVALID_NAME')) {
      const errorMessages = 'Der verwendete Name ist ungültig.';
      this.showFieldError('card-name-field-error', errorMessages);
    }

    this.showResultMessage(`Payment submission failed: ${error}`);
  }

  /**
   * Displays error message for a specific field.
   */
  private showFieldError(errorElementId: string, message: string): void {
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  /**
   * Hides error message for a specific field.
   */
  private hideFieldError(errorElementId: string): void {
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
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
  }
}
