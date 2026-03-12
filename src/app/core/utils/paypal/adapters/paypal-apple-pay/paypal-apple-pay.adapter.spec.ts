/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PaypalDataTransferService } from 'ish-core/utils/paypal/paypal-data-transfer/paypal-data-transfer.service';
import { ApplePayConfig, PaypalComponent } from 'ish-core/utils/paypal/paypal-model/paypal.model';

import { PaypalApplePayAdapter } from './paypal-apple-pay.adapter';

/**
 * Testable subclass that exposes private methods for testing
 */
@Injectable()
class TestablePaypalApplePayAdapter extends PaypalApplePayAdapter {
  testIsApplePayAvailable(): boolean {
    return (this as any).isApplePayAvailable();
  }

  testRenderButton(container: HTMLElement): void {
    return (this as any).renderButton(container);
  }

  testOnApplePayButtonClicked(): Promise<void> {
    return (this as any).onApplePayButtonClicked();
  }

  testGetPaymentRequest(): Promise<ApplePayPaymentRequest> {
    return (this as any).getPaymentRequest();
  }

  setPaypalApplepay(component: any): void {
    (this as any).paypalApplepay = component;
  }

  setApplePayConfig(config: ApplePayConfig): void {
    (this as any).applePayConfig = config;
  }

  setLoading(loading: boolean): void {
    (this as any).loading = loading;
  }
}

describe('Paypal Apple Pay Adapter', () => {
  let adapter: TestablePaypalApplePayAdapter;
  let appFacade: AppFacade;
  let destroyRef: DestroyRef;
  let checkoutFacade: CheckoutFacade;
  let paypalDataTransferService: PaypalDataTransferService;

  const mockBasket = {
    id: 'test-basket',
    totals: {
      total: {
        currency: 'USD',
        gross: 100.0,
      },
    },
  } as Basket;

  const mockApplePayConfig: ApplePayConfig = {
    isEligible: true,
    countryCode: 'US',
    merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit'],
    supportedNetworks: ['visa', 'masterCard', 'amex'],
  };

  const mockConfig: PaypalComponentsConfig = {
    containerId: 'apple-pay-container',
    scriptNamespace: 'testPaypal',
    adapterType: 'Applepay',
    pageType: 'checkout',
  };

  let mockPaypalApplepay: any;

  beforeEach(() => {
    appFacade = mock(AppFacade);
    destroyRef = mock(DestroyRef);
    checkoutFacade = mock(CheckoutFacade);
    paypalDataTransferService = mock(PaypalDataTransferService);

    // Mock PayPal Apple Pay component
    mockPaypalApplepay = {
      config: jest.fn().mockResolvedValue(mockApplePayConfig),
      confirmOrder: jest.fn().mockResolvedValue({ id: 'order-123', status: 'APPROVED' }),
      initiatePayerAction: jest.fn().mockResolvedValue({ liabilityShift: 'POSSIBLE' }),
      createOrder: jest.fn(),
      onApprove: jest.fn(),
      onError: jest.fn(),
      render: jest.fn(),
    };

    // Setup window mocks for PayPal SDK
    (window as any).testPaypal = {
      Applepay: jest.fn().mockReturnValue(mockPaypalApplepay),
    } as unknown as PaypalComponent;

    // Mock ApplePaySession (not available in jsdom)
    (window as any).ApplePaySession = {
      STATUS_SUCCESS: 0,
      STATUS_FAILURE: 1,
      canMakePayments: jest.fn().mockReturnValue(true),
      supportsVersion: jest.fn().mockReturnValue(true),
    };

    when(appFacade.currentLocale$).thenReturn(of('en_US'));
    when(checkoutFacade.basket$).thenReturn(of(mockBasket));
    when(paypalDataTransferService.paypalOrder$).thenReturn(
      of({ paypalOrderId: 'paypal-order-123', orderId: 'order-123' })
    );
    when(checkoutFacade.processPaypalOrderCreation(anything())).thenReturn(undefined);

    TestBed.configureTestingModule({
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: DestroyRef, useFactory: () => instance(destroyRef) },
        { provide: DOCUMENT, useValue: document },
        { provide: PaypalDataTransferService, useFactory: () => instance(paypalDataTransferService) },
        TestablePaypalApplePayAdapter,
      ],
    });

    adapter = TestBed.inject(TestablePaypalApplePayAdapter);
  });

  afterEach(() => {
    delete (window as any).testPaypal;
    delete (window as any).ApplePaySession;
  });

  it('should be created', () => {
    expect(adapter).toBeTruthy();
  });

  describe('renderApplePayButton', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement('div');
      container.id = mockConfig.containerId;
      document.body.appendChild(container);
      jest.spyOn(document, 'getElementById').mockReturnValue(container);
    });

    afterEach(() => {
      container?.remove();
      jest.restoreAllMocks();
    });

    it('should reject if container is not found', async () => {
      jest.spyOn(document, 'getElementById').mockReturnValue(null);

      const config: PaypalComponentsConfig = {
        containerId: 'non-existent-container',
        scriptNamespace: 'testPaypal',
        pageType: 'checkout',
        adapterType: 'Applepay',
      };

      await expect(adapter.renderApplePayButton(config)).rejects.toThrow(
        "Container element 'non-existent-container' not found in DOM"
      );
    });

    it('should reject if Apple Pay is not available in browser', async () => {
      // Remove ApplePaySession to simulate unsupported browser
      delete (window as any).ApplePaySession;

      await expect(adapter.renderApplePayButton(mockConfig)).rejects.toThrow(
        'Apple Pay is not available in this browser'
      );
    });

    it('should reject if PayPal Applepay is not available on namespace', async () => {
      (window as any).testPaypal = { Buttons: jest.fn(), Marks: jest.fn() };

      await expect(adapter.renderApplePayButton(mockConfig)).rejects.toThrow(
        "PayPal Applepay not available on namespace 'testPaypal'"
      );
    });

    it('should reject if Apple Pay is not eligible for merchant', async () => {
      mockPaypalApplepay.config.mockResolvedValue({ ...mockApplePayConfig, isEligible: false });

      await expect(adapter.renderApplePayButton(mockConfig)).rejects.toThrow(
        'Apple Pay is not eligible for this merchant'
      );
    });

    it('should render Apple Pay button successfully', async () => {
      await adapter.renderApplePayButton(mockConfig);

      expect(mockPaypalApplepay.config).toHaveBeenCalled();
      const button = container.querySelector('apple-pay-button');
      expect(button).toBeTruthy();
    });
  });

  describe('getPaymentRequest', () => {
    it('should create correct payment request from basket', async () => {
      adapter.setApplePayConfig(mockApplePayConfig);

      const request = await adapter.testGetPaymentRequest();

      expect(request.countryCode).toBe('US');
      expect(request.currencyCode).toBe('USD');
      expect(request.total.amount).toBe('100');
      expect(request.total.label).toBe('Intershop');
      expect(request.total.type).toBe('final');
      expect(request.merchantCapabilities).toEqual(['supports3DS', 'supportsCredit', 'supportsDebit']);
      expect(request.supportedNetworks).toEqual(['visa', 'masterCard', 'amex']);
    });
  });

  describe('renderButton', () => {
    it('should create and configure Apple Pay button element', () => {
      adapter.setApplePayConfig(mockApplePayConfig);
      const container = document.createElement('div');

      adapter.testRenderButton(container);

      const button = container.querySelector('apple-pay-button');
      expect(button).toBeTruthy();
      expect(button?.getAttribute('buttonstyle')).toBe('black');
      expect(button?.getAttribute('type')).toBe('buy');
    });
  });

  describe('onApplePayButtonClicked', () => {
    it('should not start new session if already loading', async () => {
      adapter.setLoading(true);
      adapter.setApplePayConfig(mockApplePayConfig);

      await adapter.testOnApplePayButtonClicked();

      // Should return early without doing anything - loading flag prevents new session
    });
  });
});
