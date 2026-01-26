import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PAYPAL_CART_FIELDS_STYLING } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.styling';
import {
  PayPalCardFieldError,
  PayPalCardFieldsComponent,
  PayPalCardFieldsStateObject,
  PayPalStateObject,
} from 'ish-core/utils/sdk/paypal/paypal-model/paypal.interface';

@Injectable({ providedIn: 'root' })
export class PayPalCardFields {
  paymentMethod: PaymentMethod;
  private temporaryPaymentInstrumentId: string;
  cardField: PayPalCardFieldsComponent;

  /** Emits when the card fields form should be closed */
  closeForm$ = new Subject<void>();

  // Store rendered field instances for later access
  private nameFieldInstance: ReturnType<PayPalCardFieldsComponent['NameField']>;
  private numberFieldInstance: ReturnType<PayPalCardFieldsComponent['NumberField']>;
  private cvvFieldInstance: ReturnType<PayPalCardFieldsComponent['CVVField']>;
  private expiryFieldInstance: ReturnType<PayPalCardFieldsComponent['ExpiryField']>;

  constructor(private ngZone: NgZone, private checkoutFacade: CheckoutFacade) {}

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
        this.cardField = paypalObject.CardFields({
          createOrder: () => this.ngZone.run(() => this.createOrderCallback()),
          onApprove: () => this.ngZone.run(() => this.onApproveCallback()),
          onError: (error: unknown) => this.ngZone.run(() => this.onErrorCallback(error)),
          inputEvents: {
            onFocus: (data: PayPalCardFieldsStateObject) => {
              this.ngZone.run(() => this.handleFieldFocus(data));
            },
            onBlur: (data: PayPalCardFieldsStateObject) => {
              this.ngZone.run(() => this.handleFieldBlur(data));
            },
          },
        }) as PayPalCardFieldsComponent;

        // Check if card fields are eligible
        if (this.cardField.isEligible()) {
          // Store card field component for later access
          //this.cardFieldComponent = cardField;

          // Render individual fields outside Angular zone for proper iframe interaction
          await this.renderIndividualFields();

          // set payment method for use in createOrder
          this.paymentMethod = paymentMethod;

          // Setup submit button handler
          this.setupSubmitHandler();
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
  async renderIndividualFields(): Promise<void> {
    // Render name field and store instance
    this.nameFieldInstance = this.cardField.NameField({
      style: PAYPAL_CART_FIELDS_STYLING,
      placeholder: '',
    });
    await this.nameFieldInstance.render('#card-name-field-container');

    // Render number field and store instance
    this.numberFieldInstance = this.cardField.NumberField({
      style: PAYPAL_CART_FIELDS_STYLING,
      placeholder: '',
    });
    await this.numberFieldInstance.render('#card-number-field-container');

    // Render CVV field and store instance
    this.cvvFieldInstance = this.cardField.CVVField({
      style: PAYPAL_CART_FIELDS_STYLING,
      placeholder: '',
    });
    await this.cvvFieldInstance.render('#card-cvv-field-container');

    // Render expiry field and store instance
    this.expiryFieldInstance = this.cardField.ExpiryField({
      style: PAYPAL_CART_FIELDS_STYLING,
    });
    await this.expiryFieldInstance.render('#card-expiry-field-container');
  }

  private handleFieldFocus(data: PayPalCardFieldsStateObject): void {
    switch (data.emittedBy) {
      case 'name':
        this.hideFieldError('card-name-field-container');
        break;
      case 'number':
        this.hideFieldError('card-number-field-container');
        break;
      case 'cvv':
        this.hideFieldError('card-cvv-field-container');
        break;
      case 'expiry':
        this.hideFieldError('card-expiry-field-container');
        break;
    }
  }

  private handleFieldBlur(data: PayPalCardFieldsStateObject): void {
    switch (data.emittedBy) {
      case 'name':
        if (!data.fields.cardNameField.isValid) {
          this.showFieldError('card-name-field-container');
        }
        break;
      case 'number':
        if (!data.fields.cardNumberField.isValid) {
          this.showFieldError('card-number-field-container');
        }
        break;
      case 'cvv':
        if (!data.fields.cardCvvField.isValid) {
          this.showFieldError('card-cvv-field-container');
        }
        break;
      case 'expiry':
        if (!data.fields.cardExpiryField.isValid) {
          this.showFieldError('card-expiry-field-container');
        }
        break;
    }
  }

  /**
   * Sets up the submit button event handler for card field submission.
   */
  private setupSubmitHandler(): void {
    const submitButton = document.getElementById('card-field-submit-button');

    if (submitButton) {
      submitButton.addEventListener('click', () => {
        this.ngZone.run(async () => {
          this.cardField.submit().catch(() => {
            this.validationErrorHandler(this.cardField.getState());
          });
        });
      });
    }
  }

  /**
   * Paypal Order Id creation callback. Creates a temporary basket payment, stores the orderId temporary in the local storage and submit order id to paypal sdk.
   */
  async createOrderCallback(): Promise<string> {
    const orderId = this.setStorageListener();

    this.checkoutFacade.createTemporaryBasketPayment({
      id: undefined,
      paymentMethod: this.paymentMethod.id,
    });

    return orderId;
  }

  /**
   * Listens for the PayPal order ID in local storage with a timeout.
   */
  private setStorageListener(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Check localStorage every 100ms
      const intervalId = window.setInterval(() => {
        const temporaryPaypalData = localStorage.getItem('temporaryPaypalData');
        if (temporaryPaypalData) {
          const data = temporaryPaypalData.split('_PI_');
          this.temporaryPaymentInstrumentId = data[1];
          cleanup();
          resolve(data[0]);
          localStorage.removeItem('temporaryPaypalData');
        }
      }, 10);

      // Timeout after 3 seconds
      const timeoutId = window.setTimeout(() => {
        cleanup();
        reject(new Error('PayPal order ID not received within 3 seconds'));
      }, 3000);

      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    });
  }

  /**
   * Handles PayPal payment approval.
   */
  async onApproveCallback() {
    this.checkoutFacade.submitPayPalPaymentInstrumentData({
      id: this.temporaryPaymentInstrumentId,
      paymentMethod: this.paymentMethod.id,
    });
    this.closeForm$.next();
  }

  /**
   * Default error handler for PayPal card fields.
   */
  private onErrorCallback(error: unknown): void {
    console.error('PayPal Card Fields error:', error);
  }

  /**
   * Default error handler for PayPal card fields.
   */
  private validationErrorHandler(statePromise: Promise<PayPalStateObject>): void {
    statePromise.then(stateObject => {
      const cardFieldsState = stateObject?.value ?? (stateObject as unknown as PayPalCardFieldsStateObject);
      this.handleSubmitError(cardFieldsState);
    });
  }

  /**
   * Handles card field validation errors.
   */
  private handleSubmitError(state: PayPalCardFieldsStateObject): void {
    state.errors.forEach(error => {
      switch (error) {
        case PayPalCardFieldError.INVALID_NAME:
          this.showFieldError('card-name-field-container', 'name');
          break;
        case PayPalCardFieldError.INVALID_NUMBER:
          this.showFieldError('card-number-field-container', 'number');
          break;
        case PayPalCardFieldError.INVALID_CVV:
          this.showFieldError('card-cvv-field-container', 'cvv');
          break;
        case PayPalCardFieldError.INVALID_EXPIRY:
          this.showFieldError('card-expiry-field-container', 'expiry');
          break;
      }
    });
  }

  /**
   * Displays error message for a specific field and marks the input as touched/invalid.
   */
  private showFieldError(containerId: string, fieldName?: 'name' | 'number' | 'cvv' | 'expiry'): void {
    const errorElement = document.getElementById(containerId.concat('-error'));
    const labelElement = document.getElementById(containerId.concat('-label'));
    if (errorElement && labelElement) {
      errorElement.classList.remove('hide-validation-error');
      labelElement.classList.add('text-danger');
    }

    // Mark the PayPal input field as invalid only if field is never touched before and form is submitted
    if (fieldName) {
      const fieldInstance = this.getFieldInstance(fieldName);
      if (fieldInstance) {
        fieldInstance.addClass('invalid');
      }
    }
  }

  /**
   * Hides error message for a specific field and removes touched/invalid state.
   */
  private hideFieldError(containerId: string): void {
    const errorElement = document.getElementById(containerId.concat('-error'));
    const labelElement = document.getElementById(containerId.concat('-label'));
    if (errorElement && labelElement) {
      errorElement.classList.add('hide-validation-error');
      labelElement.classList.remove('text-danger');
    }
  }

  /**
   * Returns the field instance for the given field name.
   */
  private getFieldInstance(
    fieldName: 'name' | 'number' | 'cvv' | 'expiry'
  ): ReturnType<PayPalCardFieldsComponent['NameField']> | undefined {
    switch (fieldName) {
      case 'name':
        return this.nameFieldInstance;
      case 'number':
        return this.numberFieldInstance;
      case 'cvv':
        return this.cvvFieldInstance;
      case 'expiry':
        return this.expiryFieldInstance;
    }
  }
}
