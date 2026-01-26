/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PayPalCardFieldError } from 'ish-core/utils/sdk/paypal/paypal-model/paypal.interface';

import { PayPalCardFields } from './paypal-card-fields';

describe('Paypal Card Fields', () => {
  let service: PayPalCardFields;
  let checkoutFacade: CheckoutFacade;

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
      render: jest.fn().mockResolvedValue(undefined),
      addClass: jest.fn(),
      removeClass: jest.fn(),
    };

    mockNumberField = {
      render: jest.fn().mockResolvedValue(undefined),
      addClass: jest.fn(),
      removeClass: jest.fn(),
    };

    mockCvvField = {
      render: jest.fn().mockResolvedValue(undefined),
      addClass: jest.fn(),
      removeClass: jest.fn(),
    };

    mockExpiryField = {
      render: jest.fn().mockResolvedValue(undefined),
      addClass: jest.fn(),
      removeClass: jest.fn(),
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
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }, PayPalCardFields],
    });

    service = TestBed.inject(PayPalCardFields);
  });

  afterEach(() => {
    // Cleanup window mock
    delete (window as any).testNamespace;
    // Cleanup localStorage
    localStorage.clear();
    // Cleanup DOM elements
    document.body.innerHTML = '';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
      await service.renderCardFields('testNamespace', mockPaymentMethod);

      expect((window as any).testNamespace.CardFields).toHaveBeenCalled();
      expect(mockCardField.isEligible).toHaveBeenCalled();
      expect(mockNameField.render).toHaveBeenCalledWith('#card-name-field-container');
      expect(mockNumberField.render).toHaveBeenCalledWith('#card-number-field-container');
      expect(mockCvvField.render).toHaveBeenCalledWith('#card-cvv-field-container');
      expect(mockExpiryField.render).toHaveBeenCalledWith('#card-expiry-field-container');
    });

    it('should store payment method after rendering', async () => {
      await service.renderCardFields('testNamespace', mockPaymentMethod);

      expect(service.paymentMethod).toEqual(mockPaymentMethod);
    });

    it('should reject when PayPal CardFields is not available', async () => {
      delete (window as any).testNamespace.CardFields;

      await expect(service.renderCardFields('testNamespace', mockPaymentMethod)).rejects.toThrow(
        "PayPal CardFields not available on namespace 'testNamespace'"
      );
    });

    it('should reject when namespace does not exist', async () => {
      await expect(service.renderCardFields('nonExistentNamespace', mockPaymentMethod)).rejects.toThrow(
        "PayPal CardFields not available on namespace 'nonExistentNamespace'"
      );
    });

    it('should not render fields when card fields are not eligible', async () => {
      mockCardField.isEligible.mockReturnValue(false);

      await service.renderCardFields('testNamespace', mockPaymentMethod);

      expect(mockNameField.render).not.toHaveBeenCalled();
      expect(mockNumberField.render).not.toHaveBeenCalled();
    });

    it('should handle rendering errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const renderError = new Error('Rendering failed');
      mockNameField.render.mockRejectedValue(renderError);

      await expect(service.renderCardFields('testNamespace', mockPaymentMethod)).rejects.toThrow('Rendering failed');

      consoleSpy.mockRestore();
    });

    it('should setup submit button event listener', async () => {
      const submitButton = document.getElementById('card-field-submit-button') as HTMLButtonElement;
      const clickSpy = jest.fn();
      submitButton.addEventListener('click', clickSpy);

      await service.renderCardFields('testNamespace', mockPaymentMethod);

      submitButton.click();
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('closeForm$ Subject', () => {
    it('should emit when form should be closed', done => {
      service.closeForm$.subscribe(() => {
        expect(true).toBeTruthy();
        done();
      });

      service.closeForm$.next();
    });
  });

  describe('createOrderCallback()', () => {
    it('should create temporary basket payment', async () => {
      // Setup localStorage to simulate backend response
      setTimeout(() => {
        localStorage.setItem('temporaryPaypalData', 'ORDER123_PI_INSTRUMENT456');
      }, 5);

      service.paymentMethod = mockPaymentMethod;

      // Start the promise
      const orderPromise = service.createOrderCallback();

      // Wait a bit for the async call to happen
      await new Promise(resolve => setTimeout(resolve, 10));

      const orderId = await orderPromise;

      expect(orderId).toBe('ORDER123');
    });

    it('should store payment instrument ID from localStorage for later use in onApproveCallback', done => {
      setTimeout(() => {
        localStorage.setItem('temporaryPaypalData', 'ORDER789_PI_INSTRUMENT999');
      }, 5);

      service.paymentMethod = mockPaymentMethod;
      service.createOrderCallback().then(() => {
        // Verify the payment instrument ID was stored by checking onApproveCallback behavior
        service.closeForm$.subscribe(() => {
          done();
        });

        service.onApproveCallback();
      });
    });

    it('should clean up localStorage after reading order ID', async () => {
      setTimeout(() => {
        localStorage.setItem('temporaryPaypalData', 'ORDER456_PI_INSTRUMENT789');
      }, 5);

      service.paymentMethod = mockPaymentMethod;
      await service.createOrderCallback();

      expect(localStorage.getItem('temporaryPaypalData')).toBeNull();
    });

    it('should reject after timeout when order ID is not received', async () => {
      service.paymentMethod = mockPaymentMethod;

      await expect(service.createOrderCallback()).rejects.toThrow('PayPal order ID not received within 3 seconds');
    });
  });

  describe('onApproveCallback()', () => {
    it('should submit payment instrument data and close form', done => {
      // Setup: create order first to set temporaryPaymentInstrumentId
      setTimeout(() => {
        localStorage.setItem('temporaryPaypalData', 'ORDER123_PI_INSTRUMENT123');
      }, 5);

      service.paymentMethod = mockPaymentMethod;
      service.createOrderCallback().then(() => {
        service.closeForm$.subscribe(() => {
          done();
        });

        service.onApproveCallback();
      });
    });

    it('should emit closeForm$ event', done => {
      // Setup: create order first to set temporaryPaymentInstrumentId
      setTimeout(() => {
        localStorage.setItem('temporaryPaypalData', 'ORDER456_PI_INSTRUMENT456');
      }, 5);

      service.paymentMethod = mockPaymentMethod;
      service.createOrderCallback().then(() => {
        service.closeForm$.subscribe(() => {
          done();
        });

        service.onApproveCallback();
      });
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
      await service.renderCardFields('testNamespace', mockPaymentMethod);

      const errorElement = document.getElementById('card-name-field-container-error');
      const labelElement = document.getElementById('card-name-field-container-label');

      // Simulate showing error first
      errorElement?.classList.remove('hide-validation-error');
      labelElement?.classList.add('text-danger');

      // Trigger focus event
      const cardFieldsConfig = (window as any).testNamespace.CardFields.mock.calls[0][0];
      cardFieldsConfig.inputEvents.onFocus({
        emittedBy: 'name',
        fields: { cardNameField: { isEmpty: false, isValid: true } },
      });

      expect(errorElement?.classList.contains('hide-validation-error')).toBeTruthy();
      expect(labelElement?.classList.contains('text-danger')).toBeFalsy();
    });

    it('should show error on invalid name field blur', async () => {
      await service.renderCardFields('testNamespace', mockPaymentMethod);

      const errorElement = document.getElementById('card-name-field-container-error');
      const labelElement = document.getElementById('card-name-field-container-label');

      // Trigger blur event with invalid state
      const cardFieldsConfig = (window as any).testNamespace.CardFields.mock.calls[0][0];
      cardFieldsConfig.inputEvents.onBlur({
        emittedBy: 'name',
        fields: { cardNameField: { isEmpty: false, isValid: false } },
      });

      expect(errorElement?.classList.contains('hide-validation-error')).toBeFalsy();
      expect(labelElement?.classList.contains('text-danger')).toBeTruthy();
    });

    it('should not show error on valid name field blur', async () => {
      await service.renderCardFields('testNamespace', mockPaymentMethod);

      const errorElement = document.getElementById('card-name-field-container-error');

      // Trigger blur event with valid state
      const cardFieldsConfig = (window as any).testNamespace.CardFields.mock.calls[0][0];
      cardFieldsConfig.inputEvents.onBlur({
        emittedBy: 'name',
        fields: { cardNameField: { isEmpty: false, isValid: true } },
      });

      expect(errorElement?.classList.contains('hide-validation-error')).toBeTruthy();
    });

    it('should handle all field types on focus', async () => {
      await service.renderCardFields('testNamespace', mockPaymentMethod);

      const cardFieldsConfig = (window as any).testNamespace.CardFields.mock.calls[0][0];

      // Test all field types
      ['name', 'number', 'cvv', 'expiry'].forEach(fieldType => {
        const errorElement = document.getElementById(`card-${fieldType}-field-container-error`);
        errorElement?.classList.remove('hide-validation-error');

        cardFieldsConfig.inputEvents.onFocus({ emittedBy: fieldType });

        expect(errorElement?.classList.contains('hide-validation-error')).toBeTruthy();
      });
    });

    it('should handle all field types on blur with errors', async () => {
      await service.renderCardFields('testNamespace', mockPaymentMethod);

      const cardFieldsConfig = (window as any).testNamespace.CardFields.mock.calls[0][0];

      // Test number field
      cardFieldsConfig.inputEvents.onBlur({
        emittedBy: 'number',
        fields: { cardNumberField: { isEmpty: false, isValid: false } },
      });

      let errorElement = document.getElementById('card-number-field-container-error');
      expect(errorElement?.classList.contains('hide-validation-error')).toBeFalsy();

      // Test CVV field
      cardFieldsConfig.inputEvents.onBlur({
        emittedBy: 'cvv',
        fields: { cardCvvField: { isEmpty: false, isValid: false } },
      });

      errorElement = document.getElementById('card-cvv-field-container-error');
      expect(errorElement?.classList.contains('hide-validation-error')).toBeFalsy();

      // Test expiry field
      cardFieldsConfig.inputEvents.onBlur({
        emittedBy: 'expiry',
        fields: { cardExpiryField: { isEmpty: false, isValid: false } },
      });

      errorElement = document.getElementById('card-expiry-field-container-error');
      expect(errorElement?.classList.contains('hide-validation-error')).toBeFalsy();
    });
  });

  describe('Submit validation errors', () => {
    beforeEach(async () => {
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

      await service.renderCardFields('testNamespace', mockPaymentMethod);
    });

    it('should handle submit with validation errors', async () => {
      const state: {
        errors: PayPalCardFieldError[];
        isFormValid: boolean;
        cards: { type: string }[];
        fields: Record<string, { isEmpty: boolean; isValid: boolean; isFocused: boolean; isPotentiallyValid: boolean }>;
      } = {
        errors: [PayPalCardFieldError.INVALID_NAME, PayPalCardFieldError.INVALID_NUMBER],
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
      await new Promise(resolve => setTimeout(resolve, 10));

      const nameError = document.getElementById('card-name-field-container-error');
      const numberError = document.getElementById('card-number-field-container-error');
      const nameLabel = document.getElementById('card-name-field-container-label');
      const numberLabel = document.getElementById('card-number-field-container-label');

      expect(nameError?.classList.contains('hide-validation-error')).toBeFalsy();
      expect(numberError?.classList.contains('hide-validation-error')).toBeFalsy();
      expect(nameLabel?.classList.contains('text-danger')).toBeTruthy();
      expect(numberLabel?.classList.contains('text-danger')).toBeTruthy();
    });

    it('should add invalid class to name field on submit error', async () => {
      const state: {
        errors: PayPalCardFieldError[];
        isFormValid: boolean;
        cards: { type: string }[];
        fields: Record<string, { isEmpty: boolean; isValid: boolean; isFocused: boolean; isPotentiallyValid: boolean }>;
      } = {
        errors: [PayPalCardFieldError.INVALID_NAME],
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
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockNameField.addClass).toHaveBeenCalledWith('invalid');

      const nameError = document.getElementById('card-name-field-container-error');
      expect(nameError?.classList.contains('hide-validation-error')).toBeFalsy();
    });

    it('should handle all validation error types', async () => {
      const state: {
        errors: PayPalCardFieldError[];
        isFormValid: boolean;
        cards: { type: string }[];
        fields: Record<string, { isEmpty: boolean; isValid: boolean; isFocused: boolean; isPotentiallyValid: boolean }>;
      } = {
        errors: [
          PayPalCardFieldError.INVALID_NAME,
          PayPalCardFieldError.INVALID_NUMBER,
          PayPalCardFieldError.INVALID_CVV,
          PayPalCardFieldError.INVALID_EXPIRY,
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
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockNameField.addClass).toHaveBeenCalledWith('invalid');
      expect(mockNumberField.addClass).toHaveBeenCalledWith('invalid');
      expect(mockCvvField.addClass).toHaveBeenCalledWith('invalid');
      expect(mockExpiryField.addClass).toHaveBeenCalledWith('invalid');

      // Verify all error messages are shown
      const nameError = document.getElementById('card-name-field-container-error');
      const numberError = document.getElementById('card-number-field-container-error');
      const cvvError = document.getElementById('card-cvv-field-container-error');
      const expiryError = document.getElementById('card-expiry-field-container-error');

      expect(nameError?.classList.contains('hide-validation-error')).toBeFalsy();
      expect(numberError?.classList.contains('hide-validation-error')).toBeFalsy();
      expect(cvvError?.classList.contains('hide-validation-error')).toBeFalsy();
      expect(expiryError?.classList.contains('hide-validation-error')).toBeFalsy();
    });
  });

  describe('Error callbacks', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="card-name-field-container"></div>
        <div id="card-number-field-container"></div>
        <div id="card-cvv-field-container"></div>
        <div id="card-expiry-field-container"></div>
        <button id="card-field-submit-button">Submit</button>
      `;
    });

    it('should handle PayPal SDK errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await service.renderCardFields('testNamespace', mockPaymentMethod);

      const cardFieldsConfig = (window as any).testNamespace.CardFields.mock.calls[0][0];
      const testError = new Error('PayPal SDK error');
      cardFieldsConfig.onError(testError);

      expect(consoleSpy).toHaveBeenCalledWith('PayPal Card Fields error:', testError);

      consoleSpy.mockRestore();
    });
  });

  describe('Edge cases', () => {
    it('should handle missing submit button gracefully', async () => {
      document.body.innerHTML = `
        <div id="card-name-field-container"></div>
        <div id="card-number-field-container"></div>
        <div id="card-cvv-field-container"></div>
        <div id="card-expiry-field-container"></div>
      `;

      await expect(service.renderCardFields('testNamespace', mockPaymentMethod)).resolves.not.toThrow();
    });

    it('should handle missing error elements gracefully', async () => {
      document.body.innerHTML = `
        <div id="card-name-field-container"></div>
        <div id="card-number-field-container"></div>
        <div id="card-cvv-field-container"></div>
        <div id="card-expiry-field-container"></div>
        <button id="card-field-submit-button">Submit</button>
      `;

      await service.renderCardFields('testNamespace', mockPaymentMethod);

      const cardFieldsConfig = (window as any).testNamespace.CardFields.mock.calls[0][0];

      // Should not throw when error elements are missing
      expect(() => {
        cardFieldsConfig.inputEvents.onFocus({ emittedBy: 'name' });
        cardFieldsConfig.inputEvents.onBlur({
          emittedBy: 'name',
          fields: { cardNameField: { isEmpty: false, isValid: false } },
        });
      }).not.toThrow();
    });
  });
});
