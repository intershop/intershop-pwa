/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject, of, take } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PaypalDataTransferService } from 'ish-core/utils/paypal/paypal-data-transfer/paypal-data-transfer.service';
import {
  ApplePayConfig,
  ApplePayPaymentAuthorizedEvent,
  ApplePaySessionInstance,
} from 'ish-core/utils/paypal/paypal-model/paypal.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

import { PaypalApplePayAdapter } from './paypal-apple-pay.adapter';

/**
 * Testable subclass that exposes private methods for testing
 */
@Injectable()
class TestablePaypalApplePayAdapter extends PaypalApplePayAdapter {
  testOnApplePayButtonClicked(): void {
    return (this as any).onApplePayButtonClicked();
  }

  testOnValidateMerchant(validationURL: string, session: ApplePaySessionInstance): Promise<void> {
    return (this as any).onValidateMerchant(validationURL, session);
  }

  testOnPaymentAuthorized(event: ApplePayPaymentAuthorizedEvent, session: ApplePaySessionInstance): Promise<void> {
    return (this as any).onPaymentAuthorized(event, session);
  }

  testCacheBasketData(): Promise<void> {
    return (this as any).cacheBasketData();
  }

  testGetPaymentRequest(): any {
    return (this as any).getPaymentRequest();
  }

  testMapBillingContactData(): any {
    return (this as any).mapBillingContactData();
  }

  testContinueICMOrderCreation(orderId: string): Promise<{ status: 'SUCCESS' | 'CANCELLED' }> {
    return (this as any).continueICMOrderCreation(orderId);
  }

  setApplePayConfig(config: ApplePayConfig): void {
    (this as any).applePayConfig = config;
  }

  setPaypalApplepay(applepay: any): void {
    (this as any).paypalApplepay = applepay;
  }

  setOrderContext(context: any): void {
    (this as any).orderContext = context;
  }

  setCurrentBasket(basket: any): void {
    (this as any).currentBasket = basket;
  }

  setMerchantId(merchantId: string): void {
    (this as any).merchantId = merchantId;
  }

  setLoading(loading: boolean): void {
    (this as any).loading = loading;
  }

  getProcessPayment$(): BehaviorSubject<boolean> {
    return this.processPayment$;
  }
}

describe('Paypal Apple Pay Adapter', () => {
  let adapter: TestablePaypalApplePayAdapter;
  let appFacade: AppFacade;
  let checkoutFacade: CheckoutFacade;
  let paypalDataTransferService: PaypalDataTransferService;
  let scriptLoaderService: ScriptLoaderService;

  const mockPaymentMethod = {
    id: 'ISH_PAYPAL_APPLEPAY',
    serviceId: 'PayPalApplePay',
    displayName: 'Apple Pay',
    capabilities: ['ApplePay'],
    paymentInstruments: [{ id: 'test-instrument-id' }],
  } as PaymentMethod;

  const mockBasket = {
    id: 'test-basket',
    totals: {
      total: {
        currency: 'EUR',
        gross: 99.99,
      },
    },
    invoiceToAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneHome: '+1234567890',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4',
      city: 'New York',
      mainDivisionCode: 'NY',
      postalCode: '10001',
      countryCode: 'US',
    },
  } as Basket;

  const mockConfig: PaypalComponentsConfig = {
    containerId: 'applepay-button-container',
    scriptNamespace: 'PPCP_ISH_PAYPAL_APPLEPAY',
    paypalPaymentMethod: mockPaymentMethod,
    pageType: 'checkout',
    adapterType: 'Applepay',
    merchantId: 'Test Merchant',
  };

  const mockApplePayConfig: ApplePayConfig = {
    isEligible: true,
    countryCode: 'US',
    merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit'],
    supportedNetworks: ['visa', 'mastercard', 'amex'],
  };

  let mockPaypalApplepay: any;
  let mockApplePaySession: any;

  beforeEach(() => {
    appFacade = mock(AppFacade);
    checkoutFacade = mock(CheckoutFacade);
    paypalDataTransferService = mock(PaypalDataTransferService);
    scriptLoaderService = mock(ScriptLoaderService);

    // Mock AppFacade
    when(appFacade.currentLocale$).thenReturn(of('en_US'));

    // Mock CheckoutFacade
    when(checkoutFacade.basket$).thenReturn(of(mockBasket));

    // Mock PaypalDataTransferService
    when(paypalDataTransferService.paypalOrder$).thenReturn(
      of({ orderId: 'ICM_ORDER_123', paypalOrderId: 'PAYPAL_ORDER_456', orderStatus: 'SUCCESS' })
    );

    // Mock ScriptLoaderService
    when(scriptLoaderService.load(anything())).thenReturn(
      of({ src: 'https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js', loaded: true })
    );

    // Create mock ApplePaySession
    mockApplePaySession = {
      begin: jest.fn(),
      abort: jest.fn(),
      completeMerchantValidation: jest.fn(),
      completePayment: jest.fn(),
    };

    // Create mock PayPal Applepay component
    mockPaypalApplepay = {
      config: jest.fn().mockResolvedValue(mockApplePayConfig),
      confirmOrder: jest.fn().mockResolvedValue({ status: 'APPROVED' }),
      validateMerchant: jest.fn().mockResolvedValue({ merchantSession: { merchantSessionIdentifier: 'test-session' } }),
    };

    // Setup mock ApplePaySession on window
    (window as any).ApplePaySession = jest.fn().mockImplementation(() => mockApplePaySession);
    (window as any).ApplePaySession.canMakePayments = jest.fn().mockReturnValue(true);
    (window as any).ApplePaySession.supportsVersion = jest.fn().mockReturnValue(true);
    (window as any).ApplePaySession.STATUS_SUCCESS = 0;
    (window as any).ApplePaySession.STATUS_FAILURE = 1;

    // Setup mock PayPal SDK on window
    (window as any).PPCP_ISH_PAYPAL_APPLEPAY = {
      Applepay: jest.fn().mockReturnValue(mockPaypalApplepay),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: PaypalDataTransferService, useFactory: () => instance(paypalDataTransferService) },
        { provide: ScriptLoaderService, useFactory: () => instance(scriptLoaderService) },
        TestablePaypalApplePayAdapter,
      ],
    });

    adapter = TestBed.inject(TestablePaypalApplePayAdapter);
  });

  afterEach(() => {
    // Cleanup window mocks
    delete (window as any).ApplePaySession;
    delete (window as any).PPCP_ISH_PAYPAL_APPLEPAY;
    // Cleanup DOM elements
    document.body.innerHTML = '';
  });

  it('should be created', () => {
    expect(adapter).toBeTruthy();
  });

  it('should initialize processPayment$ as false', done => {
    adapter
      .getProcessPayment$()
      .pipe(take(1))
      .subscribe(value => {
        expect(value).toBeFalse();
        done();
      });
  });

  describe('isApplePayAvailable()', () => {
    it('should return false when ApplePaySession is undefined', () => {
      delete (window as any).ApplePaySession;

      expect(PaypalApplePayAdapter.isApplePayAvailable()).toBeFalse();
    });

    it('should return false when canMakePayments returns false', () => {
      (window as any).ApplePaySession.canMakePayments.mockReturnValue(false);

      expect(PaypalApplePayAdapter.isApplePayAvailable()).toBeFalse();
    });

    it('should return false when supportsVersion returns false', () => {
      (window as any).ApplePaySession.supportsVersion.mockReturnValue(false);

      expect(PaypalApplePayAdapter.isApplePayAvailable()).toBeFalse();
    });

    it('should return false when supportsVersion throws', () => {
      (window as any).ApplePaySession.supportsVersion.mockImplementation(() => {
        throw new Error('Invalid version');
      });

      expect(PaypalApplePayAdapter.isApplePayAvailable()).toBeFalse();
    });

    it('should return true when Apple Pay is available', () => {
      expect(PaypalApplePayAdapter.isApplePayAvailable()).toBeTrue();
    });
  });

  describe('renderApplePayButton()', () => {
    beforeEach(() => {
      // Create container element in DOM
      const container = document.createElement('div');
      container.id = 'applepay-button-container';
      document.body.appendChild(container);
    });

    it('should load Apple Pay SDK', async () => {
      await adapter.renderApplePayButton(mockConfig);

      verify(scriptLoaderService.load('https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js')).once();
    });

    it('should reject when container element is not found', async () => {
      const configWithInvalidContainer = { ...mockConfig, containerId: 'non-existent-container' };

      await expect(adapter.renderApplePayButton(configWithInvalidContainer)).rejects.toThrow(
        "Container element 'non-existent-container' not found in DOM"
      );
    });

    it('should reject when Apple Pay is not available', async () => {
      (window as any).ApplePaySession.canMakePayments.mockReturnValue(false);

      await expect(adapter.renderApplePayButton(mockConfig)).rejects.toThrow(
        'Apple Pay is not available in this browser'
      );
    });

    it('should reject when PayPal Applepay is not available on namespace', async () => {
      delete (window as any).PPCP_ISH_PAYPAL_APPLEPAY;

      await expect(adapter.renderApplePayButton(mockConfig)).rejects.toThrow(
        "PayPal Applepay not available on namespace 'PPCP_ISH_PAYPAL_APPLEPAY'"
      );
    });

    it('should reject when namespace exists but Applepay is undefined', async () => {
      (window as any).PPCP_ISH_PAYPAL_APPLEPAY = { Applepay: undefined };

      await expect(adapter.renderApplePayButton(mockConfig)).rejects.toThrow(
        "PayPal Applepay not available on namespace 'PPCP_ISH_PAYPAL_APPLEPAY'"
      );
    });

    it('should reject when Apple Pay is not eligible for merchant', async () => {
      mockPaypalApplepay.config.mockResolvedValue({ ...mockApplePayConfig, isEligible: false });

      await expect(adapter.renderApplePayButton(mockConfig)).rejects.toThrow(
        'Apple Pay is not eligible for this merchant'
      );
    });

    it('should reject when config() throws error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(jest.fn());
      mockPaypalApplepay.config.mockRejectedValue(new Error('Config error'));

      await expect(adapter.renderApplePayButton(mockConfig)).rejects.toThrow('Config error');

      consoleSpy.mockRestore();
    });

    it('should render apple-pay-button element in container', async () => {
      const container = document.getElementById('applepay-button-container');

      await adapter.renderApplePayButton(mockConfig);

      expect(container?.children).toHaveLength(1);
      expect(container?.children[0].tagName.toLowerCase()).toBe('apple-pay-button');
    });

    it('should set button attributes correctly', async () => {
      await adapter.renderApplePayButton(mockConfig);

      const button = document.querySelector('apple-pay-button');
      expect(button?.getAttribute('id')).toBe('btn-appl');
      expect(button?.getAttribute('locale')).toBe('en');
    });
  });

  describe('onApplePayButtonClicked()', () => {
    beforeEach(() => {
      adapter.setApplePayConfig(mockApplePayConfig);
      adapter.setCurrentBasket(mockBasket);
      adapter.setMerchantId('Test Merchant');
    });

    it('should not proceed when already loading', () => {
      adapter.setLoading(true);

      adapter.testOnApplePayButtonClicked();

      verify(checkoutFacade.processPaypalOrderCreation()).never();
    });

    it('should set processPayment$ to true when button is clicked', fakeAsync(() => {
      adapter.testOnApplePayButtonClicked();
      tick();

      adapter
        .getProcessPayment$()
        .pipe(take(1))
        .subscribe(value => {
          expect(value).toBeTrue();
        });
    }));

    it('should call processPaypalOrderCreation on checkout facade', fakeAsync(() => {
      adapter.testOnApplePayButtonClicked();
      tick();

      verify(checkoutFacade.processPaypalOrderCreation()).once();
    }));

    it('should create ApplePaySession with correct parameters', fakeAsync(() => {
      adapter.testOnApplePayButtonClicked();
      tick();

      expect((window as any).ApplePaySession).toHaveBeenCalledWith(4, expect.any(Object));
    }));

    it('should call session.begin()', fakeAsync(() => {
      adapter.testOnApplePayButtonClicked();
      tick();

      expect(mockApplePaySession.begin).toHaveBeenCalled();
    }));
  });

  describe('cacheBasketData()', () => {
    it('should cache basket data from checkout facade', async () => {
      adapter.setApplePayConfig(mockApplePayConfig);
      adapter.setMerchantId('Test Merchant');

      await adapter.testCacheBasketData();

      const paymentRequest = adapter.testGetPaymentRequest();
      expect(paymentRequest.currencyCode).toBe('EUR');
    });
  });

  describe('getPaymentRequest()', () => {
    beforeEach(() => {
      adapter.setApplePayConfig(mockApplePayConfig);
      adapter.setCurrentBasket(mockBasket);
      adapter.setMerchantId('Test Merchant');
    });

    it('should include country code from Apple Pay config', () => {
      const request = adapter.testGetPaymentRequest();

      expect(request.countryCode).toBe('US');
    });

    it('should include basket currency', () => {
      const request = adapter.testGetPaymentRequest();

      expect(request.currencyCode).toBe('EUR');
    });

    it('should include merchant capabilities from config', () => {
      const request = adapter.testGetPaymentRequest();

      expect(request.merchantCapabilities).toEqual(['supports3DS', 'supportsCredit', 'supportsDebit']);
    });

    it('should include supported networks from config', () => {
      const request = adapter.testGetPaymentRequest();

      expect(request.supportedNetworks).toEqual(['visa', 'mastercard', 'amex']);
    });

    it('should include total with merchant label', () => {
      const request = adapter.testGetPaymentRequest();

      expect(request.total.label).toBe('Test Merchant');
      expect(request.total.amount).toBe('99.99');
      expect(request.total.type).toBe('final');
    });

    it('should use USD as default currency when basket currency is not available', () => {
      adapter.setCurrentBasket({ id: 'test', totals: { total: { gross: 50 } } });

      const request = adapter.testGetPaymentRequest();

      expect(request.currencyCode).toBe('USD');
    });

    it('should use 0 as default total when basket total is not available', () => {
      adapter.setCurrentBasket({ id: 'test', totals: {} });

      const request = adapter.testGetPaymentRequest();

      expect(request.total.amount).toBe('0');
    });
  });

  describe('mapBillingContactData()', () => {
    beforeEach(() => {
      adapter.setCurrentBasket(mockBasket);
    });

    it('should map billing address correctly', () => {
      const contact = adapter.testMapBillingContactData();

      expect(contact.givenName).toBe('John');
      expect(contact.familyName).toBe('Doe');
      expect(contact.emailAddress).toBe('john@example.com');
      expect(contact.phoneNumber).toBe('+1234567890');
      expect(contact.addressLines).toEqual(['123 Main St', 'Apt 4']);
      expect(contact.locality).toBe('New York');
      expect(contact.administrativeArea).toBe('NY');
      expect(contact.postalCode).toBe('10001');
      expect(contact.countryCode).toBe('US');
    });

    it('should return empty object when invoice address is not available', () => {
      adapter.setCurrentBasket({ id: 'test' });

      const contact = adapter.testMapBillingContactData();

      expect(contact).toBeEmpty();
    });

    it('should filter out empty address lines', () => {
      adapter.setCurrentBasket({
        ...mockBasket,
        invoiceToAddress: {
          ...mockBasket.invoiceToAddress,
          addressLine2: undefined,
          addressLine3: undefined,
        },
      });

      const contact = adapter.testMapBillingContactData();

      expect(contact.addressLines).toEqual(['123 Main St']);
    });
  });

  describe('onValidateMerchant()', () => {
    beforeEach(() => {
      adapter.setPaypalApplepay(mockPaypalApplepay);
      adapter.setOrderContext({ orderId: 'ICM_ORDER_123', paypalOrderId: 'PAYPAL_ORDER_456' });
    });

    it('should call validateMerchant with correct parameters', async () => {
      await adapter.testOnValidateMerchant('https://apple.com/validate', mockApplePaySession);

      expect(mockPaypalApplepay.validateMerchant).toHaveBeenCalledWith({
        validationUrl: 'https://apple.com/validate',
        domainName: window.location.hostname,
      });
    });

    it('should complete merchant validation on success', async () => {
      await adapter.testOnValidateMerchant('https://apple.com/validate', mockApplePaySession);

      expect(mockApplePaySession.completeMerchantValidation).toHaveBeenCalledWith({
        merchantSessionIdentifier: 'test-session',
      });
    });

    it('should abort session on validateMerchant error', async () => {
      mockPaypalApplepay.validateMerchant.mockRejectedValue(new Error('Validation failed'));

      await adapter.testOnValidateMerchant('https://apple.com/validate', mockApplePaySession);

      expect(mockApplePaySession.abort).toHaveBeenCalled();
    });
  });

  describe('onPaymentAuthorized()', () => {
    const mockEvent: ApplePayPaymentAuthorizedEvent = {
      payment: {
        token: {
          paymentData: {
            data: 'encrypted-data',
            header: {
              ephemeralPublicKey: 'key',
              publicKeyHash: 'hash',
              transactionId: 'txn-123',
            },
            signature: 'sig',
            version: 'EC_v1',
          },
          paymentMethod: {
            displayName: 'Visa 1234',
            network: 'Visa',
            type: 'credit',
          },
          transactionIdentifier: 'txn-id-123',
        },
      },
    };

    beforeEach(() => {
      adapter.setPaypalApplepay(mockPaypalApplepay);
      adapter.setOrderContext({ orderId: 'ICM_ORDER_123', paypalOrderId: 'PAYPAL_ORDER_456' });
      adapter.setCurrentBasket(mockBasket);
    });

    it('should call confirmOrder with correct parameters', async () => {
      await adapter.testOnPaymentAuthorized(mockEvent, mockApplePaySession);

      expect(mockPaypalApplepay.confirmOrder).toHaveBeenCalledWith({
        orderId: 'PAYPAL_ORDER_456',
        token: mockEvent.payment.token,
        billingContact: expect.any(Object),
      });
    });

    it('should complete payment with SUCCESS on successful order', async () => {
      await adapter.testOnPaymentAuthorized(mockEvent, mockApplePaySession);

      expect(mockApplePaySession.completePayment).toHaveBeenCalledWith({
        status: (window as any).ApplePaySession.STATUS_SUCCESS,
      });
    });

    it('should complete payment with FAILURE on confirmOrder error', async () => {
      mockPaypalApplepay.confirmOrder.mockRejectedValue(new Error('Confirm failed'));

      await adapter.testOnPaymentAuthorized(mockEvent, mockApplePaySession);

      expect(mockApplePaySession.completePayment).toHaveBeenCalledWith({
        status: (window as any).ApplePaySession.STATUS_FAILURE,
      });
    });
  });

  describe('continueICMOrderCreation()', () => {
    it('should call processPaypalOrderCreation with orderId', async () => {
      await adapter.testContinueICMOrderCreation('ICM_ORDER_123');

      verify(checkoutFacade.processPaypalOrderCreation('ICM_ORDER_123')).once();
    });

    it('should return SUCCESS status', async () => {
      const result = await adapter.testContinueICMOrderCreation('ICM_ORDER_123');

      expect(result.status).toBe('SUCCESS');
    });
  });

  describe('processPayment$', () => {
    it('should emit false initially', done => {
      adapter.processPayment$.pipe(take(1)).subscribe(value => {
        expect(value).toBeFalse();
        done();
      });
    });

    it('should be a BehaviorSubject', () => {
      expect(adapter.processPayment$).toBeInstanceOf(BehaviorSubject);
    });

    it('should allow subscribing to value changes', done => {
      adapter.processPayment$.subscribe(value => {
        if (value) {
          expect(value).toBeTrue();
          done();
        }
      });

      adapter.processPayment$.next(true);
    });
  });
});
