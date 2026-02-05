import { Injectable, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, firstValueFrom, race, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PAYPAL_CART_FIELDS_STYLING } from 'ish-core/utils/sdk/paypal/paypal-components/paypal-component.styling';
import { PayPalDataTransferService } from 'ish-core/utils/sdk/paypal/paypal-data-transfer/paypal-data-transfer.service';
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
  /** Emits true when the card fields is start to submit  */
  loadingIframe$ = new BehaviorSubject<boolean>(false);
  /** Flag to prevent blur validation during field reset */
  private isResetting = false;

  /** Flag to prevent prevent double submission */
  private processing = false;

  // Store rendered field instances for later access
  private fields: Record<
    string,
    {
      containerId: string;
      instance: PayPalCardFieldsIndividualField;
    }
  > = {};

  constructor(
    private ngZone: NgZone,
    private checkoutFacade: CheckoutFacade,
    private payPalDataTransferService: PayPalDataTransferService,
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
        this.cardField = paypalObject.CardFields({
          createOrder: () => this.ngZone.run(() => this.createOrderCallback()),
          onApprove: () => this.ngZone.run(() => this.onApproveCallback()),
          onError: () => {
            this.ngZone.run(() => this.onErrorCallback());
          },
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
    const fieldConfigs = [
      {
        key: 'name',
        containerId: 'card-name-field-container',
        factory: () => this.cardField.NameField({ style: PAYPAL_CART_FIELDS_STYLING, placeholder: '' }),
      },
      {
        key: 'number',
        containerId: 'card-number-field-container',
        factory: () => this.cardField.NumberField({ style: PAYPAL_CART_FIELDS_STYLING, placeholder: '' }),
      },
      {
        key: 'cvv',
        containerId: 'card-cvv-field-container',
        factory: () => this.cardField.CVVField({ style: PAYPAL_CART_FIELDS_STYLING, placeholder: '' }),
      },
      {
        key: 'expiry',
        containerId: 'card-expiry-field-container',
        factory: () => this.cardField.ExpiryField({ style: PAYPAL_CART_FIELDS_STYLING }),
      },
    ];

    for (const config of fieldConfigs) {
      try {
        const container = document.getElementById(config.containerId);
        if (!container) {
          console.warn(`PayPal CardFields: Container '#${config.containerId}' not found in DOM`);
          continue;
        }

        this.fields[config.key] = {
          containerId: config.containerId,
          instance: config.factory(),
        };
        await this.fields[config.key].instance.render(`#${config.containerId}`);
      } catch (error) {
        console.error(`PayPal CardFields: Failed to render '${config.key}' field:`, error);
      }
    }
  }

  /**
   * Handles field focus events to hide any existing error messages and re-enable submit button.
   */
  private handleFieldFocus(data: PayPalCardFieldsStateObject): void {
    this.hideFieldError(data.emittedBy);
  }

  /**
   * Handles field blur events to validate and show errors if necessary.
   */
  private handleFieldBlur(data: PayPalCardFieldsStateObject): void {
    // Skip validation during field reset to prevent race conditions
    if (this.isResetting) {
      return;
    }

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
          if (!this.processing) {
            this.cardField.submit().catch(() => {
              this.validationErrorHandler(this.cardField.getState());
            });
            this.loadingIframe$.next(true);
            this.processing = true;
          }
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
   * Paypal Order Id creation callback. Creates a temporary basket payment and waits for the orderId from the service.
   */
  async createOrderCallback(): Promise<string> {
    const orderId = this.waitForOrderData();

    this.checkoutFacade.createPaypalCreditCardBasketPayment({
      id: undefined,
      paymentMethod: this.paymentMethod.id,
    });

    return orderId;
  }

  /**
   * Waits for the PayPal order data from the service with a timeout.
   * Uses RxJS race to implement timeout behavior.
   */
  private waitForOrderData(): Promise<string> {
    const orderData$ = this.payPalDataTransferService.orderDataStream$.pipe(
      take(1),
      map(data => {
        this.temporaryPaymentInstrumentId = data.paymentInstrumentId;
        return data.orderId;
      })
    );

    const timeout$ = timer(3000).pipe(
      map(() => {
        throw new Error('PayPal order ID not received within 3 seconds');
      })
    );

    return firstValueFrom(race(orderData$, timeout$));
  }

  /**
   * Handles PayPal payment approval.
   */
  async onApproveCallback() {
    this.loadingIframe$.next(false);
    this.resetFieldValues();
    this.checkoutFacade.submitPaypalPaymentInstrument({
      id: this.temporaryPaymentInstrumentId,
      paymentMethod: this.paymentMethod.id,
    });
    this.processing = false;
  }

  async onErrorCallback() {
    this.loadingIframe$.next(false);
    if (this.temporaryPaymentInstrumentId) {
      this.checkoutFacade.deletePaypalPayment(
        {
          id: this.temporaryPaymentInstrumentId,
          paymentMethod: this.paymentMethod.id,
        },
        this.translateService.instant('checkout.payment.paypal.error.message')
      );
    }
    this.resetFieldValues();
    this.processing = false;
  }

  private resetFieldValues(): void {
    this.isResetting = true;
    const allFields = Object.keys(this.fields);

    // Clear field values
    allFields.forEach(key => {
      this.fields[key].instance.clear();
    });

    // Remove error styles multiple times to ensure we override PayPal's internal async validation
    // PayPal SDK sets 'invalid' class internally during blur, timing is unpredictable
    const removeInvalidClass = () => allFields.forEach(field => this.hideFieldError(field));

    // Multiple attempts at different timings to catch PayPal's async validation
    const delays = [50, 150, 300];
    delays.forEach((delay, index) => {
      setTimeout(() => {
        removeInvalidClass();
        if (index === delays.length - 1) {
          this.isResetting = false;
        }
      }, delay);
    });
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
    this.fields[field].instance.setAttribute('aria-invalid', 'false');
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
