import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, firstValueFrom, race, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PAYPAL_CART_FIELDS_STYLING } from 'ish-core/utils/paypal/adapters/paypal-adapters.styling';
import { PaypalDataTransferService } from 'ish-core/utils/paypal/paypal-data-transfer/paypal-data-transfer.service';
import {
  PaypalCardFieldError,
  PaypalCardFieldsComponent,
  PaypalCardFieldsIndividualField,
  PaypalCardFieldsStateObject,
  PaypalStateObject,
} from 'ish-core/utils/paypal/paypal-model/paypal.model';

/**
 * Representation of the PayPal SDK Card Fields object, responsible for rendering PayPal card fields and handling the associated callbacks for order creation, approval, cancellation, and error handling.
 * Life cycle of this component ends with destroying of parent component PaymentPaypalComponent.
 */
@Injectable()
export class PaypalCardFieldsAdapter {
  paymentMethod: PaymentMethod;
  cardField: PaypalCardFieldsComponent;

  /** Emits when the card fields form should be closed */
  closeForm$ = new Subject<void>();
  /** Emits true when the card fields is start to submit  */
  loadingIframe$ = new BehaviorSubject<boolean>(false);

  /** Error state observables for each field */
  nameFieldError$ = new BehaviorSubject<boolean>(false);
  numberFieldError$ = new BehaviorSubject<boolean>(false);
  cvvFieldError$ = new BehaviorSubject<boolean>(false);
  expiryFieldError$ = new BehaviorSubject<boolean>(false);

  private creditCardPaymentInstrumentId: string;
  /** Flag to prevent blur validation during field reset */
  private isResetting = false;
  /** Flag to prevent prevent double submission */
  private processing = false;
  // Store rendered field instances for later access
  private fields: Record<
    string,
    {
      containerId: string;
      instance: PaypalCardFieldsIndividualField;
    }
  > = {};

  constructor(
    private ngZone: NgZone,
    private checkoutFacade: CheckoutFacade,
    private paypalDataTransferService: PaypalDataTransferService,
    private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document
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
            onFocus: (data: PaypalCardFieldsStateObject) => {
              this.ngZone.run(() => this.handleFieldFocus(data));
            },
            onBlur: (data: PaypalCardFieldsStateObject) => {
              this.ngZone.run(() => this.handleFieldBlur(data));
            },
          },
        }) as PaypalCardFieldsComponent;

        if (!this.cardField.isEligible()) {
          console.warn('PayPal CardFields: Not eligible for rendering');
        }

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
   */
  protected async renderIndividualFields(): Promise<void> {
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
        const container = this.document.getElementById(config.containerId);
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
  private handleFieldFocus(data: PaypalCardFieldsStateObject): void {
    this.hideFieldError(data.emittedBy);
  }

  /**
   * Handles field blur events to validate and show errors if necessary.
   */
  private handleFieldBlur(data: PaypalCardFieldsStateObject): void {
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
   * Sets up the submit button and cancel button event handler for card field submission/cancellation.
   */
  private setupHandlerForButtons(): void {
    const submitButton = this.document.getElementById('card-field-submit-button');
    const cancelButton = this.document.getElementById('card-field-cancel-button');

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
   * Paypal Order Id creation callback. Creates a basket payment and waits for the orderId from the service.
   */
  protected async createOrderCallback(): Promise<string> {
    const orderId = this.waitForOrderData();

    this.checkoutFacade.createPaypalCreditCardBasketPayment({
      id: undefined,
      paymentMethod: this.paymentMethod.id,
    });

    return orderId;
  }

  /**
   * Waits for the PayPal order data from the service with a timeout.
   */
  private waitForOrderData(): Promise<string> {
    const orderData$ = this.paypalDataTransferService.paypalOrder$.pipe(
      take(1),
      map(data => {
        this.creditCardPaymentInstrumentId = data.paymentInstrumentId;
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
  protected async onApproveCallback() {
    this.loadingIframe$.next(false);
    this.resetFieldValues();
    this.checkoutFacade.submitPaypalPaymentInstrument({
      id: this.creditCardPaymentInstrumentId,
      paymentMethod: this.paymentMethod.id,
    });
    this.processing = false;
  }

  /**
   * Handles PayPal payment errors.
   */
  protected async onErrorCallback() {
    this.loadingIframe$.next(false);
    if (this.creditCardPaymentInstrumentId) {
      this.checkoutFacade.deletePaypalPayment(
        {
          id: this.creditCardPaymentInstrumentId,
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
  private validationErrorHandler(statePromise: Promise<PaypalStateObject>): void {
    statePromise.then(stateObject => {
      const cardFieldsState = stateObject?.value ?? (stateObject as unknown as PaypalCardFieldsStateObject);
      this.handleSubmitError(cardFieldsState);
    });
  }

  /**
   * Handles card field validation errors.
   */
  private handleSubmitError(state: PaypalCardFieldsStateObject): void {
    this.loadingIframe$.next(false);
    this.processing = false;
    state.errors.forEach(error => {
      switch (error) {
        case PaypalCardFieldError.InvalidName:
          this.showFieldError('name');
          break;
        case PaypalCardFieldError.InvalidNumber:
          this.showFieldError('number');
          break;
        case PaypalCardFieldError.InvalidCvv:
          this.showFieldError('cvv');
          break;
        case PaypalCardFieldError.InvalidExpiry:
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
      this.setFieldErrorState(fieldName, true);
      field.instance.addClass('invalid');
      field.instance.setAttribute('aria-invalid', 'true');
    }
  }

  /**
   * Hides error message, classes and aria attribute for a specific field
   */
  private hideFieldError(fieldName: string): void {
    const field = this.fields[fieldName];
    if (field) {
      this.setFieldErrorState(fieldName, false);
      field.instance.removeClass('invalid');
      field.instance.setAttribute('aria-invalid', 'false');
    }
  }

  /**
   * Updates the error state observable for a specific field.
   */
  private setFieldErrorState(fieldName: string, hasError: boolean): void {
    const errorSubjects: Record<string, BehaviorSubject<boolean>> = {
      name: this.nameFieldError$,
      number: this.numberFieldError$,
      cvv: this.cvvFieldError$,
      expiry: this.expiryFieldError$,
    };
    errorSubjects[fieldName]?.next(hasError);
  }
}
