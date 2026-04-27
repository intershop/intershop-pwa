/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Address } from 'ish-core/models/address/address.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';
import { PaypalConfigService } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';
import { PaypalDataTransferService } from 'ish-core/utils/paypal/paypal-data-transfer/paypal-data-transfer.service';

import { PaypalButtonsAdapter } from './paypal-buttons.adapter';

/**
 * Testable subclass that exposes private methods for testing
 */
@Injectable()
class TestablePaypalButtons extends PaypalButtonsAdapter {
  testCreateOrder(paymentMethod: PaymentMethod): Promise<string> {
    return this.createOrderCallback(paymentMethod);
  }

  testOnApproveCallback(data: { payerID: string; orderID: string }): void {
    (this as any).onApproveCallback(data);
  }

  testOnAbortCallback(config: PaypalComponentsConfig, reason: 'cancel' | 'failure' | 'unavailable' = 'cancel'): void {
    this.onAbortCallback(config, reason);
  }
}

describe('Paypal Buttons Adapter', () => {
  let paypalButtons: TestablePaypalButtons;
  let checkoutFacade: CheckoutFacade;
  let paypalDataTransferService: PaypalDataTransferService;
  let paypalConfigServiceMock: { getPaypalComponent: jest.Mock };

  const mockPaymentMethod = {
    id: 'ISH_PAYPAL',
    serviceId: 'PayPal',
    displayName: 'PayPal',
    capabilities: ['PaypalCheckout', 'FastCheckout'],
    paymentInstruments: [{ id: 'test-instrument-id' }],
  } as PaymentMethod;

  const mockBasket = {
    id: 'test-basket',
    payment: {
      capabilities: ['PaypalCheckout'],
      redirectUrl: 'https://paypal.com?token=ORDER123',
    },
    commonShipToAddress: {
      city: 'Berlin',
      postalCode: '10115',
      country: 'DE',
    } as Address,
  } as Basket;

  const mockBasketWithMatchingPayment = {
    ...mockBasket,
    payment: {
      capabilities: ['PaypalCheckout'],
      redirectUrl: 'https://paypal.com?token=ORDER123',
      paymentInstrument: { id: 'test-instrument-id' },
    },
  } as Basket;

  const mockBasketWithoutPayment = {
    ...mockBasket,
    payment: undefined,
  } as Basket;

  const mockConfig: PaypalComponentsConfig = {
    containerId: 'paypal-button-container',
    scriptNamespace: 'PPCP_ISH_PAYPAL',
    paypalPaymentMethod: mockPaymentMethod,
    pageType: 'checkout',
    adapterType: 'Buttons',
  };

  let mockPaypalButtons: any;

  beforeEach(() => {
    checkoutFacade = mock(CheckoutFacade);
    paypalDataTransferService = mock(PaypalDataTransferService);
    paypalConfigServiceMock = {
      getPaypalComponent: jest.fn().mockImplementation(() => (window as any).PPCP_ISH_PAYPAL),
    };

    // Mock paypalOrder$ to emit orderId
    when(paypalDataTransferService.paypalOrder$).thenReturn(
      of({ paypalOrderId: 'ORDER123', paymentInstrumentId: 'test-instrument-id' })
    );

    // Create mock PayPal Buttons component
    mockPaypalButtons = jest.fn().mockReturnValue({
      render: jest.fn().mockResolvedValue(undefined),
    });

    // Setup mock PayPal SDK on window
    (window as any).PPCP_ISH_PAYPAL = {
      Buttons: mockPaypalButtons,
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: PaypalConfigService, useValue: paypalConfigServiceMock },
        { provide: PaypalDataTransferService, useFactory: () => instance(paypalDataTransferService) },
        TestablePaypalButtons,
      ],
    });

    paypalButtons = TestBed.inject(TestablePaypalButtons);
  });

  afterEach(() => {
    // Cleanup window mock
    delete (window as any).PPCP_ISH_PAYPAL;
    // Cleanup DOM elements
    document.body.innerHTML = '';
  });

  it('should be created', () => {
    expect(paypalButtons).toBeTruthy();
  });

  describe('createOrder()', () => {
    it('should call loadPaypalToken with payment instrument id', async () => {
      const orderId = await paypalButtons.testCreateOrder(mockPaymentMethod);

      verify(checkoutFacade.loadPaypalToken('test-instrument-id')).once();
      expect(orderId).toBe('ORDER123');
    });

    it('should call loadPaypalToken with serviceId when no payment instrument exists', async () => {
      const paymentMethodWithoutInstrument = {
        ...mockPaymentMethod,
        paymentInstruments: [],
      } as PaymentMethod;

      const orderId = await paypalButtons.testCreateOrder(paymentMethodWithoutInstrument);

      verify(checkoutFacade.loadPaypalToken('PayPal')).once();
      expect(orderId).toBe('ORDER123');
    });

    it('should get order ID from paypalDataTransferService', async () => {
      const orderId = await paypalButtons.testCreateOrder(mockPaymentMethod);

      expect(orderId).toBe('ORDER123');
    });

    it('should resolve with orderId from paypalOrder$ stream', async () => {
      when(paypalDataTransferService.paypalOrder$).thenReturn(
        of({ paypalOrderId: 'ORDER999', paymentInstrumentId: 'test-instrument-id' })
      );

      const orderId = await paypalButtons.testCreateOrder(mockPaymentMethod);

      expect(orderId).toBe('ORDER999');
    });

    it('should reject when paypalOrder$ emits error', async () => {
      when(paypalDataTransferService.paypalOrder$).thenReturn(throwError(() => new Error('PayPal order error')));

      await expect(paypalButtons.testCreateOrder(mockPaymentMethod)).rejects.toThrow('PayPal order error');
    });

    it('should reject when paypalOrder$ emits empty orderId', async () => {
      when(paypalDataTransferService.paypalOrder$).thenReturn(
        of({ paypalOrderId: '', paymentInstrumentId: 'test-instrument-id' })
      );

      await expect(paypalButtons.testCreateOrder(mockPaymentMethod)).rejects.toThrow('PayPal order ID is empty');
    });
  });

  describe('onApprove()', () => {
    const approvalData = {
      payerID: 'PAYER123',
      orderID: 'ORDER456',
    };

    let navigateSpy: jest.SpyInstance;

    beforeEach(() => {
      navigateSpy = jest.spyOn((paypalButtons as any).router, 'navigate');
      when(checkoutFacade.basket$).thenReturn(of(mockBasket));
    });

    it('should navigate to review page with correct parameters', () => {
      paypalButtons.testOnApproveCallback(approvalData);

      expect(navigateSpy).toHaveBeenCalledWith(['/checkout/review'], {
        queryParams: {
          redirect: 'success',
          token: 'ORDER456',
          PayerID: 'PAYER123',
          shippingAddressChanged: false,
        },
      });
    });

    it('should detect shipping address change when country differs', () => {
      paypalButtons.paypalShippingAddress = {
        city: 'Berlin',
        postalCode: '10115',
        countryCode: 'FR',
        state: '',
      };

      paypalButtons.testOnApproveCallback(approvalData);

      expect(navigateSpy).toHaveBeenCalledWith(['/checkout/review'], {
        queryParams: {
          redirect: 'success',
          token: 'ORDER456',
          PayerID: 'PAYER123',
          shippingAddressChanged: true,
        },
      });
    });

    it('should detect shipping address change when postalCode differs', () => {
      paypalButtons.paypalShippingAddress = {
        city: 'Berlin',
        postalCode: '20095',
        countryCode: 'DE',
        state: '',
      };

      paypalButtons.testOnApproveCallback(approvalData);

      expect(navigateSpy).toHaveBeenCalledWith(['/checkout/review'], {
        queryParams: {
          redirect: 'success',
          token: 'ORDER456',
          PayerID: 'PAYER123',
          shippingAddressChanged: true,
        },
      });
    });

    it('should detect shipping address change when city differs', () => {
      paypalButtons.paypalShippingAddress = {
        city: 'Hamburg',
        postalCode: '10115',
        countryCode: 'DE',
        state: '',
      };

      paypalButtons.testOnApproveCallback(approvalData);

      expect(navigateSpy).toHaveBeenCalledWith(['/checkout/review'], {
        queryParams: {
          redirect: 'success',
          token: 'ORDER456',
          PayerID: 'PAYER123',
          shippingAddressChanged: true,
        },
      });
    });

    it('should handle case-insensitive address comparison', () => {
      paypalButtons.paypalShippingAddress = {
        city: 'BERLIN',
        postalCode: '10115',
        countryCode: 'de',
        state: '',
      };

      paypalButtons.testOnApproveCallback(approvalData);

      expect(navigateSpy).toHaveBeenCalledWith(['/checkout/review'], {
        queryParams: {
          redirect: 'success',
          token: 'ORDER456',
          PayerID: 'PAYER123',
          shippingAddressChanged: false,
        },
      });
    });

    it('should handle whitespace in address comparison', () => {
      paypalButtons.paypalShippingAddress = {
        city: '  Berlin  ',
        postalCode: ' 10115 ',
        countryCode: ' DE ',
        state: '',
      };

      paypalButtons.testOnApproveCallback(approvalData);

      expect(navigateSpy).toHaveBeenCalledWith(['/checkout/review'], {
        queryParams: {
          redirect: 'success',
          token: 'ORDER456',
          PayerID: 'PAYER123',
          shippingAddressChanged: false,
        },
      });
    });

    it('should not detect address change when payPalShippingAddress is undefined', () => {
      paypalButtons.paypalShippingAddress = undefined;

      paypalButtons.testOnApproveCallback(approvalData);

      expect(navigateSpy).toHaveBeenCalledWith(['/checkout/review'], {
        queryParams: {
          redirect: 'success',
          token: 'ORDER456',
          PayerID: 'PAYER123',
          shippingAddressChanged: false,
        },
      });
    });

    it('should handle undefined basket address', () => {
      when(checkoutFacade.basket$).thenReturn(of({ ...mockBasket, commonShipToAddress: undefined } as Basket));
      paypalButtons.paypalShippingAddress = {
        city: 'Berlin',
        postalCode: '10115',
        countryCode: 'DE',
        state: '',
      };

      paypalButtons.testOnApproveCallback(approvalData);

      expect(navigateSpy).toHaveBeenCalledWith(['/checkout/review'], {
        queryParams: {
          redirect: 'success',
          token: 'ORDER456',
          PayerID: 'PAYER123',
          shippingAddressChanged: true,
        },
      });
    });
  });

  describe('onAbort()', () => {
    let navigateSpy: jest.SpyInstance;

    beforeEach(() => {
      navigateSpy = jest.spyOn((paypalButtons as any).router, 'navigate');
      when(checkoutFacade.basket$).thenReturn(of(mockBasketWithMatchingPayment, mockBasketWithoutPayment));
    });

    describe('onCancel', () => {
      it('should delete basket payment when payment instrument exists', () => {
        paypalButtons.testOnAbortCallback(mockConfig, 'cancel');

        verify(checkoutFacade.deleteBasketPayment(mockConfig.paypalPaymentMethod.paymentInstruments[0])).once();
      });

      it('should navigate to basket page for FastCheckout', () => {
        paypalButtons.testOnAbortCallback(mockConfig, 'cancel');

        expect(navigateSpy).toHaveBeenCalledWith(['/basket'], { queryParams: { redirect: 'cancel' } });
      });

      it('should navigate to payment page when not FastCheckout', () => {
        const configWithoutFastCheckout = {
          ...mockConfig,
          paypalPaymentMethod: {
            ...mockPaymentMethod,
            capabilities: ['PaypalCheckout'],
          } as PaymentMethod,
        };

        paypalButtons.testOnAbortCallback(configWithoutFastCheckout, 'cancel');

        expect(navigateSpy).toHaveBeenCalledWith(['/checkout/payment'], { queryParams: { redirect: 'cancel' } });
      });

      it('should not delete payment or navigate when no payment instruments exist', () => {
        const configWithoutInstrument = {
          ...mockConfig,
          paypalPaymentMethod: {
            ...mockPaymentMethod,
            paymentInstruments: [],
          } as PaymentMethod,
        };

        paypalButtons.testOnAbortCallback(configWithoutInstrument, 'cancel');

        verify(checkoutFacade.deleteBasketPayment(anything())).never();
        expect(navigateSpy).not.toHaveBeenCalled();
      });
    });

    describe('onError', () => {
      it('should navigate with failure reason when serviceAvailable is true', () => {
        paypalButtons.serviceAvailable = true;

        paypalButtons.testOnAbortCallback(mockConfig, 'failure');

        verify(checkoutFacade.deleteBasketPayment(mockConfig.paypalPaymentMethod.paymentInstruments[0])).once();
        expect(navigateSpy).toHaveBeenCalledWith(['/basket'], { queryParams: { redirect: 'failure' } });
      });

      it('should navigate with unavailable reason when serviceAvailable is false', () => {
        paypalButtons.serviceAvailable = false;

        paypalButtons.testOnAbortCallback(mockConfig, 'unavailable');

        verify(checkoutFacade.deleteBasketPayment(mockConfig.paypalPaymentMethod.paymentInstruments[0])).once();
        expect(navigateSpy).toHaveBeenCalledWith(['/basket'], { queryParams: { redirect: 'unavailable' } });
      });

      it('should navigate to payment page on error when not FastCheckout', () => {
        const configWithoutFastCheckout = {
          ...mockConfig,
          paypalPaymentMethod: {
            ...mockPaymentMethod,
            capabilities: ['PaypalCheckout'],
          } as PaymentMethod,
        };

        paypalButtons.testOnAbortCallback(configWithoutFastCheckout, 'failure');

        expect(navigateSpy).toHaveBeenCalledWith(['/checkout/payment'], { queryParams: { redirect: 'failure' } });
      });
    });
  });

  describe('renderButtons()', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="paypal-button-container"></div>';
      when(checkoutFacade.basket$).thenReturn(of(mockBasket));
    });

    it('should successfully render PayPal buttons', async () => {
      await paypalButtons.renderButtons(mockConfig);

      expect(mockPaypalButtons).toHaveBeenCalled();
      expect(mockPaypalButtons().render).toHaveBeenCalledWith('#paypal-button-container');
    });

    it('should pass correct configuration to PayPal Buttons', async () => {
      await paypalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];

      expect(buttonConfig).toHaveProperty('style');
      expect(buttonConfig).toHaveProperty('createOrder');
      expect(buttonConfig).toHaveProperty('onApprove');
      expect(buttonConfig).toHaveProperty('onShippingAddressChange');
      expect(buttonConfig).toHaveProperty('onCancel');
    });

    it('should use checkout style for checkout payment page', async () => {
      await paypalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];

      expect(buttonConfig.style).toBeObject();
    });

    it('should use cart style for non-checkout pages', async () => {
      const cartConfig: PaypalComponentsConfig = {
        ...mockConfig,
        pageType: 'cart',
      };

      await paypalButtons.renderButtons(cartConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];

      expect(buttonConfig.style).toBeObject();
    });

    it('should throw error when container element does not exist', async () => {
      document.body.innerHTML = '';

      try {
        await paypalButtons.renderButtons(mockConfig);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe("Container element 'paypal-button-container' does not exist in DOM");
      }
    });

    it('should throw error when PayPal Buttons is not available', async () => {
      delete (window as any).PPCP_ISH_PAYPAL.Buttons;

      try {
        await paypalButtons.renderButtons(mockConfig);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe(
          "PayPal Buttons not available in loaded paypal sdk script with namespace 'PPCP_ISH_PAYPAL'"
        );
      }
    });

    it('should throw error when PayPal namespace does not exist', async () => {
      // Delete the PayPal namespace to simulate it not being loaded
      delete (window as any).PPCP_ISH_PAYPAL;

      try {
        await paypalButtons.renderButtons(mockConfig);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe(
          "PayPal Buttons not available in loaded paypal sdk script with namespace 'PPCP_ISH_PAYPAL'"
        );
      }
    });

    it('should call createOrder callback', async () => {
      // createOrderCallback needs a token change: first emit without token, then with token
      const basketWithoutToken = {
        ...mockBasket,
        payment: { ...mockBasket.payment, redirectUrl: undefined },
      } as Basket;
      when(checkoutFacade.basket$).thenReturn(of(basketWithoutToken, mockBasket));

      await paypalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];
      const orderId = await buttonConfig.createOrder();

      expect(orderId).toBe('ORDER123');
    });

    it('should call onApprove callback', async () => {
      const navigateSpy = jest.spyOn((paypalButtons as any).router, 'navigate');

      await paypalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];
      buttonConfig.onApprove({ payerID: 'PAYER123', orderID: 'ORDER456' });

      expect(navigateSpy).toHaveBeenCalledWith(['/checkout/review'], {
        queryParams: {
          redirect: 'success',
          token: 'ORDER456',
          PayerID: 'PAYER123',
          shippingAddressChanged: false,
        },
      });
    });

    it('should update shipping address on onShippingAddressChange callback', async () => {
      await paypalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];
      const newShippingAddress = {
        city: 'Munich',
        postalCode: '80331',
        countryCode: 'DE',
        state: 'BY',
      };

      buttonConfig.onShippingAddressChange({ shippingAddress: newShippingAddress });

      expect(paypalButtons.paypalShippingAddress).toEqual(newShippingAddress);
    });

    it('should call onCancel callback', async () => {
      const navigateSpy = jest.spyOn((paypalButtons as any).router, 'navigate');
      when(checkoutFacade.basket$).thenReturn(of(mockBasketWithMatchingPayment, mockBasketWithoutPayment));

      await paypalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];
      buttonConfig.onCancel();

      verify(checkoutFacade.deleteBasketPayment(mockConfig.paypalPaymentMethod.paymentInstruments[0])).once();
      expect(navigateSpy).toHaveBeenCalledWith(['/basket'], { queryParams: { redirect: 'cancel' } });
    });

    it('should call onError callback with failure reason', async () => {
      const navigateSpy = jest.spyOn((paypalButtons as any).router, 'navigate');
      paypalButtons.serviceAvailable = true;
      when(checkoutFacade.basket$).thenReturn(of(mockBasketWithMatchingPayment, mockBasketWithoutPayment));

      await paypalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];
      buttonConfig.onError();

      verify(checkoutFacade.deleteBasketPayment(mockConfig.paypalPaymentMethod.paymentInstruments[0])).once();
      expect(navigateSpy).toHaveBeenCalledWith(['/basket'], { queryParams: { redirect: 'failure' } });
    });

    it('should call onError callback with unavailable reason when service is unavailable', async () => {
      const navigateSpy = jest.spyOn((paypalButtons as any).router, 'navigate');
      paypalButtons.serviceAvailable = false;
      when(checkoutFacade.basket$).thenReturn(of(mockBasketWithMatchingPayment, mockBasketWithoutPayment));

      await paypalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];
      buttonConfig.onError();

      verify(checkoutFacade.deleteBasketPayment(mockConfig.paypalPaymentMethod.paymentInstruments[0])).once();
      expect(navigateSpy).toHaveBeenCalledWith(['/basket'], { queryParams: { redirect: 'unavailable' } });
    });
  });

  describe('Edge cases', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="paypal-button-container"></div>';
      when(checkoutFacade.basket$).thenReturn(of(mockBasket));
    });

    it('should handle undefined shipping address in onShippingAddressChange', async () => {
      await paypalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];
      buttonConfig.onShippingAddressChange({ shippingAddress: undefined });

      expect(paypalButtons.paypalShippingAddress).toBeUndefined();
    });

    it('should handle render failure gracefully', async () => {
      mockPaypalButtons.mockReturnValue({
        render: jest.fn().mockRejectedValue(new Error('Render failed')),
      });

      try {
        await paypalButtons.renderButtons(mockConfig);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe('Render failed');
      }
    });

    it('should handle multiple render calls with different containers', async () => {
      document.body.innerHTML = `
        <div id="paypal-button-container"></div>
        <div id="paypal-button-container-2"></div>
      `;

      await paypalButtons.renderButtons(mockConfig);

      const secondConfig = {
        ...mockConfig,
        containerId: 'paypal-button-container-2',
      };

      await paypalButtons.renderButtons(secondConfig);

      expect(mockPaypalButtons().render).toHaveBeenCalledWith('#paypal-button-container');
      expect(mockPaypalButtons().render).toHaveBeenCalledWith('#paypal-button-container-2');
    });
  });
});
