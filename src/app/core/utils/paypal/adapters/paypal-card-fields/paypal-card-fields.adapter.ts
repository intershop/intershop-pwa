import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject, firstValueFrom, race, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PAYPAL_CART_FIELDS_STYLING } from 'ish-core/utils/paypal/adapters/paypal-adapters.styling';
import { PaypalConfigService } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';
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
  /** Emits true when the card fields is start to submit  */
  renderError$ = new Subject<string>();

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
   * Must be called outside Angular zone (via PaypalAdaptersBuilder) to prevent
   * Zone.js from tracking PayPal SDK async tasks.
   *
   * @param scriptNamespace - The PayPal SDK namespace on the window object
   * @param paymentMethod - PayPal payment method configuration
   * @returns Promise that resolves when all fields are rendered
   */
  async renderCardFields(paymentMethod: PaymentMethod): Promise<void> {
    const paypalObject = PaypalConfigService.getPaypalComponent(paymentMethod);

    if (!paypalObject?.CardFields) {
      return Promise.reject(
        new Error(
          `PayPal CardFields not available on namespace '${PaypalConfigService.getPaypalScriptNameSpace(
            paymentMethod
          )}'`
        )
      );
    }

    // Reset state for reinitialization
    this.processing = false;
    this.isResetting = false;
    this.creditCardPaymentInstrumentId = undefined;

    try {
      // Create CardFields instance - callbacks use ngZone.run() to re-enter Angular zone for change detection
      this.cardField = paypalObject.CardFields({
        createOrder: () => this.ngZone.run(() => this.createOrderCallback()),
        onApprove: () => this.ngZone.run(() => this.onApproveCallback()),
        onError: () => {
          this.ngZone.run(() => this.onErrorCallback());
        },
        onCancel: () => {
          this.ngZone.run(() => this.onCancelCallback());
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
        // Render individual fields
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
  }

  /**
   * Renders individual card input fields (name, number, CVV, expiry).
   */
  protected async renderIndividualFields(): Promise<void> {
    // Clear any existing fields from previous renders
    this.cleanupExistingFields();

    // Wait for DOM to be fully ready before rendering
    await new Promise<void>(resolve => setTimeout(resolve, 100));

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

    // Render fields sequentially - PayPal SDK may have issues with parallel rendering
    for (const config of fieldConfigs) {
      await this.renderSingleField(config, 0);
    }
  }

  /**
   * Cleans up existing field instances before reinitialization.
   */
  private cleanupExistingFields(): void {
    // Clear containers in DOM
    Object.values(this.fields).forEach(field => {
      const container = this.document.getElementById(field.containerId);
      if (container) {
        container.innerHTML = '';
      }
    });
    // Reset fields record
    this.fields = {};
  }

  /**
   * Renders a single card field with retry capability.
   * @param config - Field configuration
   * @param attempt - Current attempt number (0-based)
   */
  private async renderSingleField(
    config: { key: string; containerId: string; factory(): PaypalCardFieldsIndividualField },
    attempt: number
  ): Promise<void> {
    const maxRetries = 3;
    const retryDelay = 500;

    try {
      const container = this.document.getElementById(config.containerId);
      if (!container) {
        console.warn(`PayPal CardFields: Container '#${config.containerId}' not found in DOM`);
        return;
      }

      // Ensure container is empty before rendering
      if (container.innerHTML) {
        container.innerHTML = '';
        // Small delay after clearing to let DOM settle
        await new Promise<void>(resolve => setTimeout(resolve, 50));
      }

      this.fields[config.key] = {
        containerId: config.containerId,
        instance: config.factory(),
      };
      await this.fields[config.key].instance.render(`#${config.containerId}`);

      // Small delay after render to let iframe initialize
      await new Promise<void>(resolve => setTimeout(resolve, 100));

      // Verify that PayPal SDK actually rendered content in the container
      if (!container.hasChildNodes() && attempt < maxRetries) {
        // Retry if we haven't exceeded max attempts
        delete this.fields[config.key];
        await new Promise<void>(resolve => setTimeout(resolve, retryDelay));
        return this.renderSingleField(config, attempt + 1);
      }
      if (!container.hasChildNodes() && attempt === maxRetries) {
        this.renderError$.next('checkout.payment.paypal.script.render.error.message');
      }
    } catch (error) {
      // On error, retry if possible
      if (attempt < maxRetries) {
        delete this.fields[config.key];
        await new Promise<void>(resolve => setTimeout(resolve, retryDelay));
        return this.renderSingleField(config, attempt + 1);
      }
      this.renderError$.next('checkout.payment.paypal.script.render.error.message');
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
        if (!this.processing) {
          this.ngZone.run(() => {
            this.loadingIframe$.next(true);
          });
          this.processing = true;
          // Keep submit() outside Angular zone to prevent PostRobot communication issues
          this.cardField.submit().catch(() => {
            this.validationErrorHandler(this.cardField.getState());
          });
        }
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
        return data.paypalOrderId;
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

  /**
   * Handles PayPal payment cancellation.
   */
  protected onCancelCallback(): void {
    this.loadingIframe$.next(false);
    this.processing = false;
    if (this.creditCardPaymentInstrumentId) {
      this.checkoutFacade.deletePaypalPayment({
        id: this.creditCardPaymentInstrumentId,
        paymentMethod: this.paymentMethod.id,
      });
    }
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
      this.ngZone.run(() => this.handleSubmitError(cardFieldsState));
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
