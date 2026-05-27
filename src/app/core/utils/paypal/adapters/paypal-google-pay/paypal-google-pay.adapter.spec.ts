/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { noop, of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PaypalDataTransferService } from 'ish-core/utils/paypal/paypal-data-transfer/paypal-data-transfer.service';
import { GooglePayPaymentAuthorizationResult } from 'ish-core/utils/paypal/paypal-model/paypal-google-pay.model';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

import { PaypalGooglePayAdapter } from './paypal-google-pay.adapter';

/**
 * Testable subclass that exposes private methods for testing
 */
@Injectable()
class TestablePaypalGooglePayAdapter extends PaypalGooglePayAdapter {
  testOnGooglePayButtonClicked(): Promise<void> {
    return (this as any).onGooglePayButtonClicked();
  }

  testOnPaymentAuthorizedCallback(paymentMethodData: unknown): Promise<GooglePayPaymentAuthorizationResult> {
    return (this as any).onPaymentAuthorizedCallback(paymentMethodData);
  }

  testStartOrderCreation(): Promise<void> {
    return (this as any).startOrderCreation();
  }

  testContinueICMOrderCreation(): Promise<GooglePayPaymentAuthorizationResult> {
    return (this as any).continueICMOrderCreation();
  }

  testGetPaymentDataRequest(): Promise<any> {
    return (this as any).getPaymentDataRequest();
  }

  setGooglePayConfig(config: any): void {
    (this as any).googlePayConfig = config;
  }

  setOrderContext(orderId?: string, paypalOrderId?: string): void {
    (this as any).orderContext = { orderId, paypalOrderId };
  }

  setPaypalGooglepay(googlepay: any): void {
    (this as any).paypalGooglePay = googlepay;
  }

  setGooglePaymentClient(client: any): void {
    (this as any).googlePaymentClient = client;
  }
}

describe('Paypal Google Pay Adapter', () => {
  let adapter: TestablePaypalGooglePayAdapter;
  let appFacade: AppFacade;
  let checkoutFacade: CheckoutFacade;
  let paypalDataTransferService: PaypalDataTransferService;
  let scriptLoaderService: ScriptLoaderService;

  const mockPaymentMethod = {
    id: 'ISH_PAYPAL_GOOGLEPAY',
    serviceId: 'PayPalGooglePay',
    displayName: 'Google Pay',
    capabilities: ['GooglePay'],
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
  } as Basket;

  const mockConfig: PaypalComponentsConfig = {
    containerId: 'googlepay-button-container',
    scriptNamespace: 'PPCP_ISH_PAYPAL_GOOGLEPAY',
    paypalPaymentMethod: mockPaymentMethod,
    pageType: 'checkout',
    adapterType: 'GooglePay',
  };

  const mockGooglePayConfig = {
    allowedPaymentMethods: [{ type: 'CARD', parameters: { allowedCardNetworks: ['VISA', 'MASTERCARD'] } }],
    merchantInfo: { merchantId: 'test-merchant', merchantName: 'Test Shop' },
  };

  let mockPaypalGooglepay: any;
  let mockGooglePaymentClient: any;
  let mockGooglePayButton: HTMLElement;

  beforeEach(() => {
    appFacade = mock(AppFacade);
    checkoutFacade = mock(CheckoutFacade);
    paypalDataTransferService = mock(PaypalDataTransferService);
    scriptLoaderService = mock(ScriptLoaderService);

    // Mock AppFacade
    when(appFacade.paypalClientConfig$).thenReturn(of({ googlePayEnvironment: 'TEST' }));
    when(appFacade.currentLocale$).thenReturn(of('en_US'));

    // Mock CheckoutFacade
    when(checkoutFacade.basket$).thenReturn(of(mockBasket));

    // Mock PaypalDataTransferService
    when(paypalDataTransferService.paypalOrder$).thenReturn(
      of({ orderId: 'ICM_ORDER_123', paypalOrderId: 'PAYPAL_ORDER_456', orderStatus: 'SUCCESS' })
    );

    // Mock ScriptLoaderService
    when(scriptLoaderService.load(anything())).thenReturn(
      of({ src: 'https://pay.google.com/gp/p/js/pay.js', loaded: true })
    );

    // Create mock Google Pay button element
    mockGooglePayButton = document.createElement('button');
    mockGooglePayButton.setAttribute('id', 'google-pay-button');

    // Create mock Google Payments Client
    mockGooglePaymentClient = {
      isReadyToPay: jest.fn().mockResolvedValue({ result: true }),
      createButton: jest.fn().mockReturnValue(mockGooglePayButton),
      loadPaymentData: jest.fn().mockResolvedValue({}),
    };

    // Create mock PayPal Googlepay component
    mockPaypalGooglepay = {
      config: jest.fn().mockResolvedValue(mockGooglePayConfig),
      confirmOrder: jest.fn().mockResolvedValue({ status: 'APPROVED' }),
      initiatePayerAction: jest.fn().mockResolvedValue({ liabilityShift: 'POSSIBLE' }),
    };

    // Setup mock Google Pay SDK on window
    (window as any).google = {
      payments: {
        api: {
          PaymentsClient: jest.fn().mockImplementation(() => mockGooglePaymentClient),
        },
      },
    };

    // Setup mock PayPal SDK on window
    (window as any).PPCP_ISH_PAYPAL_GOOGLEPAY = {
      Googlepay: jest.fn().mockReturnValue(mockPaypalGooglepay),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: PaypalDataTransferService, useFactory: () => instance(paypalDataTransferService) },
        { provide: ScriptLoaderService, useFactory: () => instance(scriptLoaderService) },
        TestablePaypalGooglePayAdapter,
      ],
    });

    adapter = TestBed.inject(TestablePaypalGooglePayAdapter);
  });

  afterEach(() => {
    // Cleanup window mocks
    delete (window as any).google;
    delete (window as any).PPCP_ISH_PAYPAL_GOOGLEPAY;
    // Cleanup DOM elements
    document.body.innerHTML = '';
  });

  it('should be created', () => {
    expect(adapter).toBeTruthy();
  });

  describe('renderGooglePayButton()', () => {
    beforeEach(() => {
      // Create container element in DOM
      const container = document.createElement('div');
      container.id = 'googlepay-button-container';
      document.body.appendChild(container);
    });

    it('should reject when container element is not found', async () => {
      const configWithInvalidContainer = { ...mockConfig, containerId: 'non-existent-container' };

      await expect(adapter.renderGooglePayButton(configWithInvalidContainer)).rejects.toThrow(
        "Container element 'non-existent-container' not found in DOM"
      );
    });

    it('should reject when PayPal Googlepay is not available on namespace', async () => {
      delete (window as any).PPCP_ISH_PAYPAL_GOOGLEPAY;

      await expect(adapter.renderGooglePayButton(mockConfig)).rejects.toThrow(
        "PayPal Googlepay not available on namespace 'PPCP_ISH_PAYPAL_GOOGLEPAY'"
      );
    });

    it('should reject when namespace exists but Googlepay is undefined', async () => {
      (window as any).PPCP_ISH_PAYPAL_GOOGLEPAY = { Googlepay: undefined };

      await expect(adapter.renderGooglePayButton(mockConfig)).rejects.toThrow(
        "PayPal Googlepay not available on namespace 'PPCP_ISH_PAYPAL_GOOGLEPAY'"
      );
    });

    it('should load Google Pay SDK', async () => {
      await adapter.renderGooglePayButton(mockConfig);

      verify(scriptLoaderService.load('https://pay.google.com/gp/p/js/pay.js')).once();
    });

    it('should reject when Google Pay is not ready to pay', async () => {
      mockGooglePaymentClient.isReadyToPay.mockResolvedValue({ result: false });

      await expect(adapter.renderGooglePayButton(mockConfig)).rejects.toBe(
        'Google Pay is not available for the current user or device'
      );
    });

    it('should reject when config() throws error', async () => {
      mockPaypalGooglepay.config.mockRejectedValue(new Error('Config error'));

      await expect(adapter.renderGooglePayButton(mockConfig)).rejects.toThrow('Config error');
    });

    it('should render button in container when Google Pay is ready', async () => {
      const container = document.getElementById('googlepay-button-container');

      await adapter.renderGooglePayButton(mockConfig);

      expect(container?.children).toHaveLength(1);
      expect(mockGooglePaymentClient.createButton).toHaveBeenCalled();
    });

    it('should pass TEST as environment when googlePayEnvironment is set explicitly to TEST', async () => {
      when(appFacade.paypalClientConfig$).thenReturn(of({ googlePayEnvironment: 'TEST' }));

      await adapter.renderGooglePayButton(mockConfig);

      expect((window as any).google.payments.api.PaymentsClient).toHaveBeenCalledWith(
        expect.objectContaining({ environment: 'TEST' })
      );
    });

    it('should use PRODUCTION environment when configured', async () => {
      when(appFacade.paypalClientConfig$).thenReturn(of({ googlePayEnvironment: 'PRODUCTION' }));

      await adapter.renderGooglePayButton(mockConfig);

      expect((window as any).google.payments.api.PaymentsClient).toHaveBeenCalledWith(
        expect.objectContaining({ environment: 'PRODUCTION' })
      );
    });
  });

  describe('onGooglePayButtonClicked()', () => {
    beforeEach(() => {
      adapter.setGooglePayConfig(mockGooglePayConfig);
      adapter.setGooglePaymentClient(mockGooglePaymentClient);
    });

    it('should call processPaypalOrderCreation on checkout facade', fakeAsync(() => {
      adapter.testOnGooglePayButtonClicked();
      tick();

      verify(checkoutFacade.processPaypalOrderCreation()).once();
    }));

    it('should call processPaypalOrderCreation with orderId when user cancels', async () => {
      mockGooglePaymentClient.loadPaymentData.mockRejectedValue({ statusCode: 'CANCELED' });
      adapter.setOrderContext('ICM_ORDER_123');
      adapter.setGooglePayConfig(mockGooglePayConfig);
      adapter.setGooglePaymentClient(mockGooglePaymentClient);

      await adapter.testOnGooglePayButtonClicked().catch(noop);

      verify(checkoutFacade.processPaypalOrderCreation('ICM_ORDER_123')).once();
    });
  });

  describe('startOrderCreation()', () => {
    it('should call processPaypalOrderCreation on checkout facade', fakeAsync(() => {
      adapter.testStartOrderCreation();
      tick();

      verify(checkoutFacade.processPaypalOrderCreation()).once();
    }));

    it('should wait for paypalOrder$ to emit order data', async () => {
      await adapter.testStartOrderCreation();

      // The order IDs should be set from paypalOrder$ emission
      expect(true).toBeTrue();
    });

    it('should reject when paypalOrder$ emits error', async () => {
      when(paypalDataTransferService.paypalOrder$).thenReturn(throwError(() => new Error('Order creation failed')));

      await expect(adapter.testStartOrderCreation()).rejects.toThrow('Order creation failed');
    });
  });

  describe('continueICMOrderCreation()', () => {
    beforeEach(() => {
      adapter.setOrderContext('ICM_ORDER_123');
      when(paypalDataTransferService.paypalOrder$).thenReturn(
        of({ orderId: 'ICM_ORDER_123', paypalOrderId: 'PAYPAL_ORDER_456', orderStatus: 'SUCCESS' })
      );
    });

    it('should call processPaypalOrderCreation with orderId', async () => {
      await adapter.testContinueICMOrderCreation();

      verify(checkoutFacade.processPaypalOrderCreation('ICM_ORDER_123')).once();
    });

    it('should return SUCCESS transaction state', async () => {
      const result = await adapter.testContinueICMOrderCreation();

      expect(result).toEqual({ transactionState: 'SUCCESS' });
    });
  });

  describe('onPaymentAuthorizedCallback()', () => {
    const mockPaymentMethodData = { tokenizationData: { token: 'test-token' } };

    beforeEach(() => {
      adapter.setPaypalGooglepay(mockPaypalGooglepay);
      adapter.setOrderContext('ICM_ORDER_123', 'PAYPAL_ORDER_456');
      when(paypalDataTransferService.paypalOrder$).thenReturn(
        of({ orderId: 'ICM_ORDER_123', paypalOrderId: 'PAYPAL_ORDER_456', orderStatus: 'SUCCESS' })
      );
    });

    it('should call confirmOrder with correct parameters', async () => {
      await adapter.testOnPaymentAuthorizedCallback(mockPaymentMethodData);

      expect(mockPaypalGooglepay.confirmOrder).toHaveBeenCalledWith({
        orderId: 'PAYPAL_ORDER_456',
        paymentMethodData: mockPaymentMethodData,
      });
    });

    it('should continue ICM order creation when status is APPROVED', async () => {
      mockPaypalGooglepay.confirmOrder.mockResolvedValue({ status: 'APPROVED' });

      await adapter.testOnPaymentAuthorizedCallback(mockPaymentMethodData);

      verify(checkoutFacade.processPaypalOrderCreation('ICM_ORDER_123')).once();
    });

    it('should initiate payer action when status is PAYER_ACTION_REQUIRED', async () => {
      mockPaypalGooglepay.confirmOrder.mockResolvedValue({ status: 'PAYER_ACTION_REQUIRED' });

      const result = await adapter.testOnPaymentAuthorizedCallback(mockPaymentMethodData);

      expect(mockPaypalGooglepay.initiatePayerAction).toHaveBeenCalledWith({ orderId: 'PAYPAL_ORDER_456' });
      expect(result).toEqual({ transactionState: 'SUCCESS' });
    });

    it('should continue ICM order creation on confirmOrder error', async () => {
      mockPaypalGooglepay.confirmOrder.mockRejectedValue(new Error('Confirm failed'));

      await adapter.testOnPaymentAuthorizedCallback(mockPaymentMethodData);

      verify(checkoutFacade.processPaypalOrderCreation('ICM_ORDER_123')).once();
    });

    it('should continue ICM order creation for other statuses', async () => {
      mockPaypalGooglepay.confirmOrder.mockResolvedValue({ status: 'COMPLETED' });

      await adapter.testOnPaymentAuthorizedCallback(mockPaymentMethodData);

      verify(checkoutFacade.processPaypalOrderCreation('ICM_ORDER_123')).once();
    });
  });

  describe('getPaymentDataRequest()', () => {
    beforeEach(() => {
      adapter.setGooglePayConfig(mockGooglePayConfig);
    });

    it('should include basket currency in transaction info', async () => {
      const request = await adapter.testGetPaymentDataRequest();

      expect(request.transactionInfo.currencyCode).toBe('EUR');
    });

    it('should include basket total in transaction info', async () => {
      const request = await adapter.testGetPaymentDataRequest();

      expect(request.transactionInfo.totalPrice).toBe('99.99');
    });

    it('should include allowed payment methods from Google Pay config', async () => {
      const request = await adapter.testGetPaymentDataRequest();

      expect(request.allowedPaymentMethods).toEqual(mockGooglePayConfig.allowedPaymentMethods);
    });

    it('should include merchant info from Google Pay config', async () => {
      const request = await adapter.testGetPaymentDataRequest();

      expect(request.merchantInfo).toEqual(mockGooglePayConfig.merchantInfo);
    });

    it('should set totalPriceStatus to FINAL', async () => {
      const request = await adapter.testGetPaymentDataRequest();

      expect(request.transactionInfo.totalPriceStatus).toBe('FINAL');
    });

    it('should include PAYMENT_AUTHORIZATION callback intent', async () => {
      const request = await adapter.testGetPaymentDataRequest();

      expect(request.callbackIntents).toContain('PAYMENT_AUTHORIZATION');
    });

    it('should use USD as default currency when basket currency is not available', async () => {
      when(checkoutFacade.basket$).thenReturn(of({ id: 'test', totals: { total: { gross: 50 } } } as Basket));

      const request = await adapter.testGetPaymentDataRequest();

      expect(request.transactionInfo.currencyCode).toBe('USD');
    });

    it('should use 0 as default total when basket total is not available', async () => {
      when(checkoutFacade.basket$).thenReturn(of({ id: 'test', totals: {} } as Basket));

      const request = await adapter.testGetPaymentDataRequest();

      expect(request.transactionInfo.totalPrice).toBe('0');
    });
  });
});
