import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PAYPAL_CART_FIELDS_STYLING } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.styling';
import {
  PayPalCardFieldError,
  PayPalCardFieldsComponent,
  PayPalCardFieldsIndividualField,
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
  private fields: Record<
    string,
    {
      containerId: string;
      instance: PayPalCardFieldsIndividualField;
    }
  > = {};

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
          // Render individual fields outside Angular zone for proper iframe interaction
          await this.renderIndividualFields();

          // set payment method for use in createOrder and onApprove callbacks
          this.paymentMethod = paymentMethod;

          // Setup submit and cancel button handlers
          this.setupHandlerForButtons();
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
    this.fields.name = {
      containerId: 'card-name-field-container',
      instance: this.cardField.NameField({
        style: PAYPAL_CART_FIELDS_STYLING,
        placeholder: '',
      }),
    };
    await this.fields.name.instance.render('#card-name-field-container');

    // Render number field and store instance
    this.fields.number = {
      containerId: 'card-number-field-container',
      instance: this.cardField.NumberField({
        style: PAYPAL_CART_FIELDS_STYLING,
        placeholder: '',
      }),
    };
    await this.fields.number.instance.render('#card-number-field-container');

    // Render CVV field and store instance
    this.fields.cvv = {
      containerId: 'card-cvv-field-container',
      instance: this.cardField.CVVField({
        style: PAYPAL_CART_FIELDS_STYLING,
        placeholder: '',
      }),
    };
    await this.fields.cvv.instance.render('#card-cvv-field-container');

    // Render expiry field and store instance
    this.fields.expiry = {
      containerId: 'card-expiry-field-container',
      instance: this.cardField.ExpiryField({
        style: PAYPAL_CART_FIELDS_STYLING,
      }),
    };
    await this.fields.expiry.instance.render('#card-expiry-field-container');
  }

  /**
   * Handles field focus events to hide any existing error messages.
   */
  private handleFieldFocus(data: PayPalCardFieldsStateObject): void {
    this.hideFieldError(data.emittedBy);
  }

  /**
   * Handles field blur events to validate and show errors if necessary.
   */
  private handleFieldBlur(data: PayPalCardFieldsStateObject): void {
    const fieldConfig: Record<string, { fieldState: { isValid: boolean; isEmpty: boolean } }> = {
      name: { fieldState: data.fields.cardNameField },
      number: { fieldState: data.fields.cardNumberField },
      cvv: { fieldState: data.fields.cardCvvField },
      expiry: { fieldState: data.fields.cardExpiryField },
    };

    const config = fieldConfig[data.emittedBy];
    if (config && !config.fieldState.isValid) {
      config.fieldState.isEmpty ? this.hideFieldError(data.emittedBy) : this.showFieldError(data.emittedBy);
    }
  }

  /**
   * Sets up the submit button event handler for card field submission.
   */
  private setupHandlerForButtons(): void {
    const submitButton = document.getElementById('card-field-submit-button');
    const cancelButton = document.getElementById('card-field-cancel-button');

    if (submitButton) {
      submitButton.addEventListener('click', () => {
        this.ngZone.run(async () => {
          this.cardField.submit().catch(() => {
            this.validationErrorHandler(this.cardField.getState());
          });
        });
      });
    }

    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        this.ngZone.run(() => {
          this.resetFieldValues();
          this.closeForm$.next();
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
    this.resetFieldValues();
    this.checkoutFacade.submitPayPalPaymentInstrumentData({
      id: this.temporaryPaymentInstrumentId,
      paymentMethod: this.paymentMethod.id,
    });
  }

  private resetFieldValues(): void {
    const allFields = Object.keys(this.fields);

    // Clear field values
    allFields.forEach(key => {
      this.fields[key].instance.clear();
    });

    // Remove error styles and possible error messages after a short delay to avoid interfering with PayPal internal validation
    setTimeout(() => {
      allFields.forEach(field => {
        this.hideFieldError(field);
      });
    }, 100);
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
        case PayPalCardFieldError.InvalidName:
          this.showFieldError('name');
          break;
        case PayPalCardFieldError.InvalidNumber:
          this.showFieldError('number');
          break;
        case PayPalCardFieldError.InvalidCvv:
          this.showFieldError('cvv');
          break;
        case PayPalCardFieldError.InvalidExpiry:
          this.showFieldError('expiry');
          break;
      }
    });
  }

  /**
   * Displays error message for a specific field and marks the input as invalid.
   */
  private showFieldError(fieldName: string): void {
    const field = this.fields[fieldName];
    if (field) {
      const errorElements = this.getErrorElementsById(field.containerId);
      if (errorElements?.error && errorElements?.label) {
        errorElements.error.classList.remove('hide-validation-error');
        errorElements.label.classList.add('validation-error');
      }
      field.instance.addClass('invalid');
      field.instance.setAttribute('aria-invalid', 'true');
    }
  }

  /**
   * Hides error message, classes and aria attribute for a specific field
   */
  private hideFieldError(field: string): void {
    const errorElements = this.getErrorElementsById(this.fields[field].containerId);
    if (errorElements?.error && errorElements?.label) {
      errorElements.error.classList.add('hide-validation-error');
      errorElements.label.classList.remove('validation-error');
    }
    this.fields[field].instance.removeClass('invalid');
    this.fields[field].instance.removeAttribute('aria-invalid');
  }

  /**
   * Retrieves error and label elements by container ID.
   */
  private getErrorElementsById(id: string): Record<string, HTMLElement | null> {
    return {
      error: document.getElementById(id.concat('-error')),
      label: document.getElementById(id.concat('-label')),
    };
  }
}
