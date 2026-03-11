/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import {
  PaypalDataTransferService,
  PaypalOrderAuthorizationResult,
} from 'ish-core/utils/paypal/paypal-data-transfer/paypal-data-transfer.service';
import {
  GooglePayConfig,
  GooglePayPaymentAuthorizationResult,
  GooglePayPaymentData,
  GooglePayPaymentDataRequest,
  PaypalComponent,
} from 'ish-core/utils/paypal/paypal-model/paypal.model';
import { ScriptLoaderService, ScriptType } from 'ish-core/utils/script-loader/script-loader.service';

import { PaypalGooglePayAdapter } from './paypal-google-pay.adapter';

/**
 * Testable subclass that exposes private methods for testing
 */
@Injectable()
class TestablePaypalGooglePayAdapter extends PaypalGooglePayAdapter {
  testLoadGooglePaySdk(): Promise<void> {
    return (this as any).loadGooglePaySdk();
  }

  testGetGooglePaymentsClient(): any {
    return (this as any).getGooglePaymentsClient();
  }

  testRenderButton(container: HTMLElement): void {
    return (this as any).renderButton(container);
  }

  testOnGooglePayButtonClicked(): Promise<void> {
    return (this as any).onGooglePayButtonClicked();
  }

  testGetPaymentDataRequest(): Promise<GooglePayPaymentDataRequest> {
    return (this as any).getPaymentDataRequest();
  }

  testOnPaymentAuthorizedCallback(paymentData: GooglePayPaymentData): Promise<GooglePayPaymentAuthorizationResult> {
    return (this as any).onPaymentAuthorizedCallback(paymentData);
  }

  testContinueICMOrderCreation(): Promise<GooglePayPaymentAuthorizationResult> {
    return (this as any).continueICMOrderCreation();
  }

  setPaypalGooglepay(component: any): void {
    (this as any).paypalGooglepay = component;
  }

  setGooglePayConfig(config: GooglePayConfig): void {
    (this as any).googlePayConfig = config;
  }

  setOrderId(orderId: string): void {
    (this as any).orderId = orderId;
  }

  setPaypalOrderId(paypalOrderId: string): void {
    (this as any).paypalOrderId = paypalOrderId;
  }
}

describe('Paypal Google Pay Adapter', () => {
  let adapter: TestablePaypalGooglePayAdapter;
  let appFacade: AppFacade;
  let destroyRef: DestroyRef;
  let checkoutFacade: CheckoutFacade;
  let paypalDataTransferService: PaypalDataTransferService;
  let scriptLoaderService: ScriptLoaderService;
  let translateService: TranslateService;

  const mockBasket = {
    id: 'test-basket',
    totals: {
      total: {
        currency: 'USD',
        gross: 100.0,
      },
    },
  } as Basket;

  const mockGooglePayConfig: GooglePayConfig = {
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['MASTERCARD', 'VISA'],
        },
      },
    ],
    merchantInfo: {
      merchantId: 'test-merchant-id',
      merchantName: 'Test Merchant',
    },
  };

  const mockPaymentData: GooglePayPaymentData = {
    apiVersion: 2,
    apiVersionMinor: 0,
    paymentMethodData: {
      type: 'CARD',
      description: 'Visa •••• 1234',
      info: {
        cardNetwork: 'VISA',
        cardDetails: '1234',
      },
      tokenizationData: {
        type: 'PAYMENT_GATEWAY',
        token: 'test-token',
      },
    },
  };

  const mockConfig: PaypalComponentsConfig = {
    containerId: 'google-pay-container',
    scriptNamespace: 'testPaypal',
    adapterType: 'Googlepay',
    pageType: 'checkout',
  };

  let mockGooglePaymentClient: any;
  let mockPaypalGooglepay: any;

  beforeEach(() => {
    appFacade = mock(AppFacade);
    destroyRef = mock(DestroyRef);
    checkoutFacade = mock(CheckoutFacade);
    paypalDataTransferService = mock(PaypalDataTransferService);
    scriptLoaderService = mock(ScriptLoaderService);
    translateService = mock(TranslateService);

    // Create a mock button element
    const mockButton = document.createElement('div');

    // Mock Google Pay client
    mockGooglePaymentClient = {
      isReadyToPay: jest.fn().mockResolvedValue({ result: true }),
      createButton: jest.fn().mockReturnValue(mockButton),
      loadPaymentData: jest.fn().mockResolvedValue(mockPaymentData),
    };

    // Mock PayPal Googlepay component
    mockPaypalGooglepay = {
      config: jest.fn().mockResolvedValue(mockGooglePayConfig),
      confirmOrder: jest.fn().mockResolvedValue({ status: 'APPROVED' }),
      initiatePayerAction: jest.fn().mockResolvedValue({ liabilityShift: 'POSSIBLE' }),
    };

    // Setup window mocks
    (window as any).google = {
      payments: {
        api: {
          PaymentsClient: jest.fn().mockImplementation(() => mockGooglePaymentClient),
        },
      },
    };

    (window as any).testPaypal = {
      Googlepay: jest.fn().mockReturnValue(mockPaypalGooglepay),
    } as unknown as PaypalComponent;

    when(appFacade.currentLocale$).thenReturn(of('en_US'));
    when(checkoutFacade.basket$).thenReturn(of(mockBasket));
    when(scriptLoaderService.load(anything())).thenReturn(of<ScriptType>({ src: 'test-script', loaded: true }));

    TestBed.configureTestingModule({
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: DestroyRef, useFactory: () => instance(destroyRef) },
        { provide: DOCUMENT, useValue: document },
        { provide: PaypalDataTransferService, useFactory: () => instance(paypalDataTransferService) },
        { provide: ScriptLoaderService, useFactory: () => instance(scriptLoaderService) },
        { provide: TranslateService, useFactory: () => instance(translateService) },
        TestablePaypalGooglePayAdapter,
      ],
    });

    adapter = TestBed.inject(TestablePaypalGooglePayAdapter);
  });

  afterEach(() => {
    delete (window as any).google;
    delete (window as any).testPaypal;
  });

  it('should be created', () => {
    expect(adapter).toBeTruthy();
  });

  describe('renderGooglePayButton()', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement('div');
      container.id = mockConfig.containerId;
      document.body.appendChild(container);
      jest.spyOn(document, 'getElementById').mockReturnValue(container);
    });

    afterEach(() => {
      container?.remove();
    });

    it('should render Google Pay button successfully', async () => {
      await adapter.renderGooglePayButton(mockConfig);

      expect(mockPaypalGooglepay.config).toHaveBeenCalled();
      expect(mockGooglePaymentClient.isReadyToPay).toHaveBeenCalled();
      expect(mockGooglePaymentClient.createButton).toHaveBeenCalled();
    });

    it('should reject when container element is not found', async () => {
      jest.spyOn(document, 'getElementById').mockReturnValue(undefined);

      await expect(adapter.renderGooglePayButton(mockConfig)).rejects.toThrow(
        `Container element '${mockConfig.containerId}' not found in DOM`
      );
    });

    it('should reject when PayPal Googlepay is not available', async () => {
      delete (window as any).testPaypal.Googlepay;

      await expect(adapter.renderGooglePayButton(mockConfig)).rejects.toThrow(
        `PayPal Googlepay not available on namespace 'testPaypal'`
      );
    });

    it('should reject when Google Pay config fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Config error');
      mockPaypalGooglepay.config.mockRejectedValue(error);

      await expect(adapter.renderGooglePayButton(mockConfig)).rejects.toBe(error);
      consoleErrorSpy.mockRestore();
    });

    it('should reject when Google Pay is not ready to pay', async () => {
      mockGooglePaymentClient.isReadyToPay.mockResolvedValue({ result: false });

      await expect(adapter.renderGooglePayButton(mockConfig)).rejects.toBe(
        'Google Pay is not available for the current user or device'
      );
    });

    it('should handle initialization error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Initialization failed');
      mockPaypalGooglepay.config.mockRejectedValue(error);

      await expect(adapter.renderGooglePayButton(mockConfig)).rejects.toBe(error);
      consoleErrorSpy.mockRestore();
    });
  });

  describe('loadGooglePaySdk()', () => {
    it('should load Google Pay SDK if not already loaded', async () => {
      delete (window as any).google;

      // Simulate async SDK loading
      setTimeout(() => {
        (window as any).google = {
          payments: {
            api: {
              PaymentsClient: jest.fn(),
            },
          },
        };
      }, 10);

      await adapter.testLoadGooglePaySdk();

      verify(scriptLoaderService.load(anything())).once();
    });

    it('should call script loader service', async () => {
      await adapter.testLoadGooglePaySdk();

      verify(scriptLoaderService.load(anything())).once();
    });
  });

  describe('getGooglePaymentsClient()', () => {
    it('should return Google Payments Client instance', () => {
      const client = adapter.testGetGooglePaymentsClient();

      expect(client).toBe(mockGooglePaymentClient);
      expect((window as any).google.payments.api.PaymentsClient).toHaveBeenCalled();
    });

    it('should reuse existing client instance on multiple calls', () => {
      const client1 = adapter.testGetGooglePaymentsClient();
      const client2 = adapter.testGetGooglePaymentsClient();

      expect(client1).toBe(client2);
    });
  });

  describe('renderButton()', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement('div');
      adapter.setGooglePayConfig(mockGooglePayConfig);
    });

    it('should render button in container', () => {
      adapter.testRenderButton(container);

      expect(mockGooglePaymentClient.createButton).toHaveBeenCalled();
      expect(container.children).toHaveLength(1);
    });

    it('should use correct locale for button', () => {
      when(appFacade.currentLocale$).thenReturn(of('de_DE'));

      adapter.testRenderButton(container);

      const buttonOptions = mockGooglePaymentClient.createButton.mock.calls[0][0];
      expect(buttonOptions.buttonLocale).toBe('de');
    });
  });

  describe('onGooglePayButtonClicked()', () => {
    beforeEach(() => {
      adapter.setGooglePayConfig(mockGooglePayConfig);
      when(paypalDataTransferService.paypalOrder$).thenReturn(of({ paypalOrderId: 'PAYPAL123', orderId: 'ORDER456' }));
    });

    it('should load payment data when button is clicked', async () => {
      await adapter.testOnGooglePayButtonClicked();

      expect(mockGooglePaymentClient.loadPaymentData).toHaveBeenCalled();
    });

    it('should start order creation before loading payment data', async () => {
      await adapter.testOnGooglePayButtonClicked();

      verify(checkoutFacade.processPaypalOrderCreation()).once();
    });
  });

  describe('getPaymentDataRequest()', () => {
    beforeEach(() => {
      adapter.setGooglePayConfig(mockGooglePayConfig);
    });

    it('should create payment data request with basket information', async () => {
      const request = await adapter.testGetPaymentDataRequest();

      expect(request.apiVersion).toBe(2);
      expect(request.apiVersionMinor).toBe(0);
      expect(request.transactionInfo.currencyCode).toBe('USD');
      expect(request.transactionInfo.totalPrice).toBe('100');
      expect(request.callbackIntents).toContain('PAYMENT_AUTHORIZATION');
    });

    it('should use default values when basket totals are missing', async () => {
      const incompleteBasket = { id: 'test' } as Basket;
      when(checkoutFacade.basket$).thenReturn(of(incompleteBasket));

      const request = await adapter.testGetPaymentDataRequest();

      expect(request.transactionInfo.currencyCode).toBe('USD');
      expect(request.transactionInfo.totalPrice).toBe('0');
    });
  });

  describe('onPaymentAuthorizedCallback()', () => {
    beforeEach(() => {
      jest.spyOn(window, 'focus').mockImplementation(() => undefined);
      adapter.setPaypalGooglepay(mockPaypalGooglepay);
      adapter.setOrderId('ORDER456');
      adapter.setPaypalOrderId('PAYPAL123');
      when(paypalDataTransferService.paypalOrder$).thenReturn(of({ paypalOrderId: 'PAYPAL123', orderId: 'ORDER456' }));
      when(paypalDataTransferService.paypalOrderAuthorizationResult$).thenReturn(
        of({ status: 'SUCCESS', orderId: 'ORDER456' } as PaypalOrderAuthorizationResult)
      );
    });

    it('should confirm order and return SUCCESS when payment is authorized', async () => {
      const result = await adapter.testOnPaymentAuthorizedCallback(mockPaymentData);

      expect(mockPaypalGooglepay.confirmOrder).toHaveBeenCalledWith({
        orderId: 'PAYPAL123',
        paymentMethodData: mockPaymentData.paymentMethodData,
      });
      verify(checkoutFacade.processPaypalOrderCreation('ORDER456')).once();
      expect(result.transactionState).toBe('SUCCESS');
    });

    it('should initiate payer action when 3DS is required', async () => {
      mockPaypalGooglepay.confirmOrder.mockResolvedValue({ status: 'PAYER_ACTION_REQUIRED' });

      await adapter.testOnPaymentAuthorizedCallback(mockPaymentData);

      expect(mockPaypalGooglepay.initiatePayerAction).toHaveBeenCalledWith({
        orderId: 'PAYPAL123',
      });
    });
  });

  describe('continueICMOrderCreation()', () => {
    beforeEach(() => {
      adapter.setOrderId('ORDER456');
    });

    it('should return SUCCESS when authorization succeeds', async () => {
      when(paypalDataTransferService.paypalOrderAuthorizationResult$).thenReturn(
        of({ status: 'SUCCESS' } as PaypalOrderAuthorizationResult)
      );

      const result = await adapter.testContinueICMOrderCreation();

      verify(checkoutFacade.processPaypalOrderCreation('ORDER456')).once();
      expect(result.transactionState).toBe('SUCCESS');
    });

    it('should return ERROR when authorization fails', async () => {
      when(paypalDataTransferService.paypalOrder$).thenReturn(of({ paypalOrderId: 'PAYPAL123', orderId: 'ORDER456' }));
      when(paypalDataTransferService.paypalOrderAuthorizationResult$).thenReturn(
        of({ status: 'ERROR', message: 'Payment capture failed' } as PaypalOrderAuthorizationResult)
      );

      const result = await adapter.testContinueICMOrderCreation();

      expect(result.transactionState).toBe('ERROR');
      expect(result.error?.message).toBe('Payment capture failed');
    });

    it('should return SUCCESS when orderId is not set', async () => {
      adapter.setOrderId(undefined);

      const result = await adapter.testContinueICMOrderCreation();

      expect(result.transactionState).toBe('SUCCESS');
    });
  });
});
