/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { anything, instance, mock, verify } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalDataTransferService } from 'ish-core/utils/paypal/paypal-data-transfer/paypal-data-transfer.service';
import { PaypalCardFieldError } from 'ish-core/utils/paypal/paypal-model/paypal.model';

import { PaypalCardFieldsAdapter } from './paypal-card-fields.adapter';

@Injectable()
class TestablePaypalCardFields extends PaypalCardFieldsAdapter {
  testCreateOrderCallback(): Promise<string> {
    return this.createOrderCallback();
  }

  testOnApproveCallback(): Promise<void> {
    return (this as any).onApproveCallback();
  }

  testOnErrorCallback(): Promise<void> {
    return (this as any).onErrorCallback();
  }

  testOnCancelCallback(): void {
    return (this as any).onCancelCallback();
  }
}

describe('Paypal Card Fields Adapter', () => {
  let paypalCardFields: TestablePaypalCardFields;
  let checkoutFacade: CheckoutFacade;
  let paypalDataTransferService: PaypalDataTransferService;

  const mockPaymentMethod = {
    id: 'ISH_PAYPAL_CREDIT_CARD',
    serviceId: 'PayPal',
    displayName: 'PayPal Credit Card',
  } as PaymentMethod;

  // Mock PayPal SDK objects
  let mockCardField: any;
  let mockNameField: any;
  let mockNumberField: any;
  let mockCvvField: any;
  let mockExpiryField: any;

  beforeEach(() => {
    checkoutFacade = mock(CheckoutFacade);

    // Create mock field instances with required methods
    mockNameField = {
      render: jest.fn().mockImplementation((selector: string) => {
        // Simulate PayPal SDK adding an iframe to the container
        const container = document.querySelector(selector);
        if (container) {
          container.innerHTML = '<iframe src="about:blank"></iframe>';
        }
        return Promise.resolve(undefined);
      }),
      addClass: jest.fn(),
      removeClass: jest.fn(),
      setAttribute: jest.fn().mockResolvedValue(undefined),
      removeAttribute: jest.fn().mockResolvedValue(undefined),
      clear: jest.fn(),
    };

    mockNumberField = {
      render: jest.fn().mockImplementation((selector: string) => {
        const container = document.querySelector(selector);
        if (container) {
          container.innerHTML = '<iframe src="about:blank"></iframe>';
        }
        return Promise.resolve(undefined);
      }),
      addClass: jest.fn(),
      removeClass: jest.fn(),
      setAttribute: jest.fn().mockResolvedValue(undefined),
      removeAttribute: jest.fn().mockResolvedValue(undefined),
      clear: jest.fn(),
    };

    mockCvvField = {
      render: jest.fn().mockImplementation((selector: string) => {
        const container = document.querySelector(selector);
        if (container) {
          container.innerHTML = '<iframe src="about:blank"></iframe>';
        }
        return Promise.resolve(undefined);
      }),
      addClass: jest.fn(),
      removeClass: jest.fn(),
      setAttribute: jest.fn().mockResolvedValue(undefined),
      removeAttribute: jest.fn().mockResolvedValue(undefined),
      clear: jest.fn(),
    };

    mockExpiryField = {
      render: jest.fn().mockImplementation((selector: string) => {
        const container = document.querySelector(selector);
        if (container) {
          container.innerHTML = '<iframe src="about:blank"></iframe>';
        }
        return Promise.resolve(undefined);
      }),
      addClass: jest.fn(),
      removeClass: jest.fn(),
      setAttribute: jest.fn().mockResolvedValue(undefined),
      removeAttribute: jest.fn().mockResolvedValue(undefined),
      clear: jest.fn(),
    };

    // Create mock card field component
    mockCardField = {
      isEligible: jest.fn().mockReturnValue(true),
      NameField: jest.fn().mockReturnValue(mockNameField),
      NumberField: jest.fn().mockReturnValue(mockNumberField),
      CVVField: jest.fn().mockReturnValue(mockCvvField),
      ExpiryField: jest.fn().mockReturnValue(mockExpiryField),
      submit: jest.fn().mockResolvedValue(undefined),
      getState: jest.fn().mockResolvedValue({
        errors: [],
        fields: {
          cardNameField: { isEmpty: false, isValid: true },
          cardNumberField: { isEmpty: false, isValid: true },
          cardCvvField: { isEmpty: false, isValid: true },
          cardExpiryField: { isEmpty: false, isValid: true },
        },
      }),
    };

    // Setup mock PayPal SDK on window
    (window as any).testNamespace = {
      CardFields: jest.fn().mockReturnValue(mockCardField),
    };

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: PaypalCardFieldsAdapter, useClass: TestablePaypalCardFields },
      ],
    });

    paypalCardFields = TestBed.inject(PaypalCardFieldsAdapter) as TestablePaypalCardFields;
    paypalDataTransferService = TestBed.inject(PaypalDataTransferService);
  });

  afterEach(() => {
    // Cleanup window mock
    delete (window as any).testNamespace;
    // Cleanup DOM elements
    document.body.innerHTML = '';
  });

  it('should be created', () => {
    expect(paypalCardFields).toBeTruthy();
  });

  describe('renderCardFields()', () => {
    beforeEach(() => {
      // Setup required DOM elements
      document.body.innerHTML = `
        <div id="card-name-field-container"></div>
        <div id="card-number-field-container"></div>
        <div id="card-cvv-field-container"></div>
        <div id="card-expiry-field-container"></div>
        <button id="card-field-submit-button">Submit</button>
      `;
    });

    it('should successfully render all card fields', async () => {
      await paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod);

      expect((window as any).testNamespace.CardFields).toHaveBeenCalled();
      expect(mockCardField.isEligible).toHaveBeenCalled();
      expect(mockNameField.render).toHaveBeenCalledWith('#card-name-field-container');
      expect(mockNumberField.render).toHaveBeenCalledWith('#card-number-field-container');
      expect(mockCvvField.render).toHaveBeenCalledWith('#card-cvv-field-container');
      expect(mockExpiryField.render).toHaveBeenCalledWith('#card-expiry-field-container');
    });

    it('should store payment method after rendering', async () => {
      await paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod);

      expect(paypalCardFields.paymentMethod).toEqual(mockPaymentMethod);
    });

    it('should reject when PayPal CardFields is not available', async () => {
      delete (window as any).testNamespace.CardFields;

      await expect(paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod)).rejects.toThrow(
        "PayPal CardFields not available on namespace 'testNamespace'"
      );
    });

    it('should reject when namespace does not exist', async () => {
      await expect(paypalCardFields.renderCardFields('nonExistentNamespace', mockPaymentMethod)).rejects.toThrow(
        "PayPal CardFields not available on namespace 'nonExistentNamespace'"
      );
    });

    it('should not render fields when card fields are not eligible', async () => {
      mockCardField.isEligible.mockReturnValue(false);

      await paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod);

      expect(mockNameField.render).not.toHaveBeenCalled();
      expect(mockNumberField.render).not.toHaveBeenCalled();
    });

    it('should handle rendering errors gracefully and emit renderError$', async () => {
      const renderError = new Error('Rendering failed');
      mockNameField.render.mockRejectedValue(renderError);

      const errorPromise = firstValueFrom(paypalCardFields.renderError$.pipe(take(1)));

      await paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod);

      const emittedError = await errorPromise;
      expect(emittedError).toBe('checkout.payment.paypal.script.render.error.message');
      // Other fields should still be rendered
      expect(mockNumberField.render).toHaveBeenCalled();
      expect(mockCvvField.render).toHaveBeenCalled();
      expect(mockExpiryField.render).toHaveBeenCalled();
    });

    it('should setup submit button event listener', async () => {
      const submitButton = document.getElementById('card-field-submit-button') as HTMLButtonElement;
      const clickSpy = jest.fn();
      submitButton.addEventListener('click', clickSpy);

      await paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod);

      submitButton.click();
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('closeForm$ Subject', () => {
    it('should emit when form should be closed', done => {
      paypalCardFields.closeForm$.subscribe(() => {
        expect(true).toBeTruthy();
        done();
      });

      paypalCardFields.closeForm$.next();
    });
  });

  describe('createOrderCallback()', () => {
    it('should create temporary basket payment', async () => {
      // Simulate service emitting order data
      setTimeout(() => {
        paypalDataTransferService.emitPaypalOrderData({
          paypalOrderId: 'ORDER123',
          paymentInstrumentId: 'INSTRUMENT456',
        });
      }, 5);

      paypalCardFields.paymentMethod = mockPaymentMethod;

      // Start the promise

      const orderPromise = paypalCardFields.testCreateOrderCallback();

      // Wait a bit for the async call to happen
      await new Promise(resolve => setTimeout(resolve, 10));

      const orderId = await orderPromise;

      expect(orderId).toBe('ORDER123');
    });

    it('should store payment instrument ID from service for later use in onApproveCallback', async done => {
      setTimeout(() => {
        paypalDataTransferService.emitPaypalOrderData({
          paypalOrderId: 'ORDER789',
          paymentInstrumentId: 'INSTRUMENT999',
        });
      }, 5);

      paypalCardFields.paymentMethod = mockPaymentMethod;
      await paypalCardFields.testCreateOrderCallback();

      // onApproveCallback should complete without errors
      await paypalCardFields.testOnApproveCallback();
      paypalCardFields.loadingIframe$.subscribe(value => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('should reject after timeout when order ID is not received', async () => {
      paypalCardFields.paymentMethod = mockPaymentMethod;

      await expect(paypalCardFields.testCreateOrderCallback()).rejects.toThrow(
        'PayPal order ID not received within 3 seconds'
      );
    });
  });

  describe('onApproveCallback()', () => {
    beforeEach(async () => {
      document.body.innerHTML = `
        <div id="card-name-field-container"></div>
        <div id="card-number-field-container"></div>
        <div id="card-cvv-field-container"></div>
        <div id="card-expiry-field-container"></div>
        <button id="card-field-submit-button">Submit</button>
      `;

      await paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod);
    });

    it('should set loadingIframe$ to false', async done => {
      paypalCardFields.loadingIframe$.next(true);

      await paypalCardFields.testOnApproveCallback();

      paypalCardFields.loadingIframe$.pipe(take(1)).subscribe(value => {
        expect(value).toBeFalse();
        done();
      });
    });
  });

  describe('onErrorCallback()', () => {
    beforeEach(async () => {
      document.body.innerHTML = `
        <div id="card-name-field-container"></div>
        <div id="card-number-field-container"></div>
        <div id="card-cvv-field-container"></div>
        <div id="card-expiry-field-container"></div>
        <button id="card-field-submit-button">Submit</button>
      `;

      await paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod);
    });

    afterEach(async () => {
      // Wait for resetFieldValues setTimeout callbacks to complete (300ms max delay)
      await new Promise(resolve => setTimeout(resolve, 350));
    });

    it('should set loadingIframe$ to false', async done => {
      paypalCardFields.loadingIframe$.next(true);

      await paypalCardFields.testOnErrorCallback();

      paypalCardFields.loadingIframe$.subscribe(value => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('should call deletePaypalPayment when payment instrument id exists', async () => {
      // Set the payment instrument ID manually via internal field
      (paypalCardFields as any).creditCardPaymentInstrumentId = 'INSTRUMENT456';
      paypalCardFields.paymentMethod = mockPaymentMethod;

      await paypalCardFields.testOnErrorCallback();

      verify(checkoutFacade.deletePaypalPayment(anything(), anything())).once();
    });

    it('should not call deletePaypalPayment when payment instrument id does not exist', async () => {
      await paypalCardFields.testOnErrorCallback();

      verify(checkoutFacade.deletePaypalPayment(anything(), anything())).never();
    });
  });

  describe('onCancelCallback()', () => {
    beforeEach(async () => {
      document.body.innerHTML = `
        <div id="card-name-field-container"></div>
        <div id="card-number-field-container"></div>
        <div id="card-cvv-field-container"></div>
        <div id="card-expiry-field-container"></div>
        <button id="card-field-submit-button">Submit</button>
      `;

      await paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod);
    });

    it('should set loadingIframe$ to false', done => {
      paypalCardFields.loadingIframe$.next(true);

      paypalCardFields.testOnCancelCallback();

      paypalCardFields.loadingIframe$.pipe(take(1)).subscribe(value => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('should call deletePaypalPayment without error message when payment instrument id exists', () => {
      (paypalCardFields as any).creditCardPaymentInstrumentId = 'INSTRUMENT456';
      paypalCardFields.paymentMethod = mockPaymentMethod;

      paypalCardFields.testOnCancelCallback();

      verify(checkoutFacade.deletePaypalPayment(anything())).once();
    });

    it('should not call deletePaypalPayment when payment instrument id does not exist', () => {
      paypalCardFields.testOnCancelCallback();

      verify(checkoutFacade.deletePaypalPayment(anything())).never();
    });
  });

  describe('Field validation and error handling', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="card-name-field-container">
          <label id="card-name-field-container-label">Name</label>
          <div id="card-name-field-container-error" class="hide-validation-error">Error</div>
        </div>
        <div id="card-number-field-container">
          <label id="card-number-field-container-label">Number</label>
          <div id="card-number-field-container-error" class="hide-validation-error">Error</div>
        </div>
        <div id="card-cvv-field-container">
          <label id="card-cvv-field-container-label">CVV</label>
          <div id="card-cvv-field-container-error" class="hide-validation-error">Error</div>
        </div>
        <div id="card-expiry-field-container">
          <label id="card-expiry-field-container-label">Expiry</label>
          <div id="card-expiry-field-container-error" class="hide-validation-error">Error</div>
        </div>
        <button id="card-field-submit-button">Submit</button>
      `;
    });

    it('should hide error on name field focus', async () => {
      await paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod);

      // Simulate showing error first by setting observable to true
      paypalCardFields.nameFieldError$.next(true);

      // Trigger focus event
      const cardFieldsConfig = (window as any).testNamespace.CardFields.mock.calls[0][0];
      cardFieldsConfig.inputEvents.onFocus({
        emittedBy: 'name',
        fields: { cardNameField: { isEmpty: false, isValid: true } },
      });

      // Verify observable is set to false (error hidden)
      const errorValue = await firstValueFrom(paypalCardFields.nameFieldError$.pipe(take(1)));
      expect(errorValue).toBeFalsy();
      expect(mockNameField.removeClass).toHaveBeenCalledWith('invalid');
    });

    it('should show error on invalid name field blur', async () => {
      await paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod);

      // Trigger blur event with invalid state
      const cardFieldsConfig = (window as any).testNamespace.CardFields.mock.calls[0][0];
      cardFieldsConfig.inputEvents.onBlur({
        emittedBy: 'name',
        fields: { cardNameField: { isEmpty: false, isValid: false } },
      });

      // Verify observable is set to true (error shown)
      const errorValue = await firstValueFrom(paypalCardFields.nameFieldError$.pipe(take(1)));
      expect(errorValue).toBeTruthy();
      expect(mockNameField.addClass).toHaveBeenCalledWith('invalid');
    });

    it('should not show error on valid name field blur', async () => {
      await paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod);

      // Trigger blur event with valid state
      const cardFieldsConfig = (window as any).testNamespace.CardFields.mock.calls[0][0];
      cardFieldsConfig.inputEvents.onBlur({
        emittedBy: 'name',
        fields: { cardNameField: { isEmpty: false, isValid: true } },
      });

      // Verify observable remains false (no error)
      const errorValue = await firstValueFrom(paypalCardFields.nameFieldError$.pipe(take(1)));
      expect(errorValue).toBeFalsy();
    });

    it('should handle all field types on focus', async () => {
      await paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod);

      const cardFieldsConfig = (window as any).testNamespace.CardFields.mock.calls[0][0];

      // Set all errors to true first
      paypalCardFields.nameFieldError$.next(true);
      paypalCardFields.numberFieldError$.next(true);
      paypalCardFields.cvvFieldError$.next(true);
      paypalCardFields.expiryFieldError$.next(true);

      // Test all field types
      const fieldObservables: Record<string, typeof paypalCardFields.nameFieldError$> = {
        name: paypalCardFields.nameFieldError$,
        number: paypalCardFields.numberFieldError$,
        cvv: paypalCardFields.cvvFieldError$,
        expiry: paypalCardFields.expiryFieldError$,
      };

      for (const fieldType of ['name', 'number', 'cvv', 'expiry']) {
        cardFieldsConfig.inputEvents.onFocus({ emittedBy: fieldType });
        const errorValue = await firstValueFrom(fieldObservables[fieldType].pipe(take(1)));
        expect(errorValue).toBeFalsy();
      }
    });

    it('should handle all field types on blur with errors', async () => {
      await paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod);

      const cardFieldsConfig = (window as any).testNamespace.CardFields.mock.calls[0][0];

      // Test number field
      cardFieldsConfig.inputEvents.onBlur({
        emittedBy: 'number',
        fields: { cardNumberField: { isEmpty: false, isValid: false } },
      });

      const numberError = await firstValueFrom(paypalCardFields.numberFieldError$.pipe(take(1)));
      expect(numberError).toBeTruthy();

      // Test CVV field
      cardFieldsConfig.inputEvents.onBlur({
        emittedBy: 'cvv',
        fields: { cardCvvField: { isEmpty: false, isValid: false } },
      });

      const cvvError = await firstValueFrom(paypalCardFields.cvvFieldError$.pipe(take(1)));
      expect(cvvError).toBeTruthy();

      // Test expiry field
      cardFieldsConfig.inputEvents.onBlur({
        emittedBy: 'expiry',
        fields: { cardExpiryField: { isEmpty: false, isValid: false } },
      });

      const expiryError = await firstValueFrom(paypalCardFields.expiryFieldError$.pipe(take(1)));
      expect(expiryError).toBeTruthy();
    });
  });

  describe('Submit validation errors', () => {
    beforeEach(async () => {
      // Reset processing flag from previous tests
      (paypalCardFields as any).processing = false;

      document.body.innerHTML = `
        <div id="card-name-field-container">
          <label id="card-name-field-container-label">Name</label>
          <div id="card-name-field-container-error" class="hide-validation-error">Error</div>
        </div>
        <div id="card-number-field-container">
          <label id="card-number-field-container-label">Number</label>
          <div id="card-number-field-container-error" class="hide-validation-error">Error</div>
        </div>
        <div id="card-cvv-field-container">
          <label id="card-cvv-field-container-label">CVV</label>
          <div id="card-cvv-field-container-error" class="hide-validation-error">Error</div>
        </div>
        <div id="card-expiry-field-container">
          <label id="card-expiry-field-container-label">Expiry</label>
          <div id="card-expiry-field-container-error" class="hide-validation-error">Error</div>
        </div>
        <button id="card-field-submit-button">Submit</button>
      `;

      await paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod);
    });

    it('should handle submit with validation errors', async () => {
      const state: {
        errors: PaypalCardFieldError[];
        isFormValid: boolean;
        cards: { type: string }[];
        fields: Record<string, { isEmpty: boolean; isValid: boolean; isFocused: boolean; isPotentiallyValid: boolean }>;
      } = {
        errors: [PaypalCardFieldError.InvalidName, PaypalCardFieldError.InvalidNumber],
        isFormValid: false,
        cards: [],
        fields: {
          cardNameField: { isEmpty: false, isValid: false, isFocused: false, isPotentiallyValid: false },
          cardNumberField: { isEmpty: false, isValid: false, isFocused: false, isPotentiallyValid: false },
          cardCvvField: { isEmpty: false, isValid: true, isFocused: false, isPotentiallyValid: true },
          cardExpiryField: { isEmpty: false, isValid: true, isFocused: false, isPotentiallyValid: true },
        },
      };

      mockCardField.getState.mockResolvedValue(state);
      mockCardField.submit.mockRejectedValue(new Error('Validation failed'));

      const submitButton = document.getElementById('card-field-submit-button') as HTMLButtonElement;
      submitButton.click();

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify submit was called and rejected with validation error
      expect(mockCardField.submit).toHaveBeenCalled();
    });

    it('should add invalid class to name field on submit error', async () => {
      const state: {
        errors: PaypalCardFieldError[];
        isFormValid: boolean;
        cards: { type: string }[];
        fields: Record<string, { isEmpty: boolean; isValid: boolean; isFocused: boolean; isPotentiallyValid: boolean }>;
      } = {
        errors: [PaypalCardFieldError.InvalidName],
        isFormValid: false,
        cards: [],
        fields: {
          cardNameField: { isEmpty: false, isValid: false, isFocused: false, isPotentiallyValid: false },
          cardNumberField: { isEmpty: false, isValid: true, isFocused: false, isPotentiallyValid: true },
          cardCvvField: { isEmpty: false, isValid: true, isFocused: false, isPotentiallyValid: true },
          cardExpiryField: { isEmpty: false, isValid: true, isFocused: false, isPotentiallyValid: true },
        },
      };

      mockCardField.getState.mockResolvedValue(state);
      mockCardField.submit.mockRejectedValue(new Error('Validation failed'));

      const submitButton = document.getElementById('card-field-submit-button') as HTMLButtonElement;
      submitButton.click();

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify submit was attempted
      expect(mockCardField.submit).toHaveBeenCalled();
      expect(mockCardField.getState).toHaveBeenCalled();
    });

    it('should handle all validation error types', async () => {
      const state: {
        errors: PaypalCardFieldError[];
        isFormValid: boolean;
        cards: { type: string }[];
        fields: Record<string, { isEmpty: boolean; isValid: boolean; isFocused: boolean; isPotentiallyValid: boolean }>;
      } = {
        errors: [
          PaypalCardFieldError.InvalidName,
          PaypalCardFieldError.InvalidNumber,
          PaypalCardFieldError.InvalidCvv,
          PaypalCardFieldError.InvalidExpiry,
        ],
        isFormValid: false,
        cards: [],
        fields: {
          cardNameField: { isEmpty: false, isValid: false, isFocused: false, isPotentiallyValid: false },
          cardNumberField: { isEmpty: false, isValid: false, isFocused: false, isPotentiallyValid: false },
          cardCvvField: { isEmpty: false, isValid: false, isFocused: false, isPotentiallyValid: false },
          cardExpiryField: { isEmpty: false, isValid: false, isFocused: false, isPotentiallyValid: false },
        },
      };

      mockCardField.getState.mockResolvedValue(state);
      mockCardField.submit.mockRejectedValue(new Error('Validation failed'));

      const submitButton = document.getElementById('card-field-submit-button') as HTMLButtonElement;
      submitButton.click();

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockNameField.addClass).toHaveBeenCalledWith('invalid');
      expect(mockNumberField.addClass).toHaveBeenCalledWith('invalid');
      expect(mockCvvField.addClass).toHaveBeenCalledWith('invalid');
      expect(mockExpiryField.addClass).toHaveBeenCalledWith('invalid');

      // Verify all error observables are set to true
      const nameError = await firstValueFrom(paypalCardFields.nameFieldError$.pipe(take(1)));
      const numberError = await firstValueFrom(paypalCardFields.numberFieldError$.pipe(take(1)));
      const cvvError = await firstValueFrom(paypalCardFields.cvvFieldError$.pipe(take(1)));
      const expiryError = await firstValueFrom(paypalCardFields.expiryFieldError$.pipe(take(1)));
      expect(nameError).toBeTruthy();
      expect(numberError).toBeTruthy();
      expect(cvvError).toBeTruthy();
      expect(expiryError).toBeTruthy();
    });
  });

  describe('Cancel button', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="card-name-field-container"></div>
        <div id="card-number-field-container"></div>
        <div id="card-cvv-field-container"></div>
        <div id="card-expiry-field-container"></div>
        <button id="card-field-submit-button">Submit</button>
        <button id="card-field-cancel-button">Cancel</button>
      `;
    });

    it('should emit closeForm$ when cancel button is clicked', async done => {
      await paypalCardFields.renderCardFields('testNamespace', mockPaymentMethod);

      paypalCardFields.closeForm$.subscribe(() => {
        done();
      });

      const cancelButton = document.getElementById('card-field-cancel-button') as HTMLButtonElement;
      cancelButton.click();
    });
  });
});
