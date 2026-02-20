/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Address } from 'ish-core/models/address/address.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalComponentsConfig } from 'ish-core/utils/paypal/adapters/paypal-adapters.builder';

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

  testOnCancelCallback(config: PaypalComponentsConfig): void {
    (this as any).onCancelCallback(config);
  }

  testOnErrorCallback(config: PaypalComponentsConfig): void {
    (this as any).onErrorCallback(config);
  }
}

describe('Paypal Buttons Adapter', () => {
  let paypalButtons: TestablePaypalButtons;
  let checkoutFacade: CheckoutFacade;

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

  const mockConfig: PaypalComponentsConfig = {
    containerId: 'paypal-button-container',
    scriptNamespace: 'testPaypal',
    paypalPaymentMethod: mockPaymentMethod,
    pageType: 'checkout',
    adapterType: 'Buttons',
  };

  let mockPaypalButtons: any;

  beforeEach(() => {
    checkoutFacade = mock(CheckoutFacade);

    // Create mock PayPal Buttons component
    mockPaypalButtons = jest.fn().mockReturnValue({
      render: jest.fn().mockResolvedValue(undefined),
    });

    // Setup mock PayPal SDK on window
    (window as any).testPaypal = {
      Buttons: mockPaypalButtons,
    };

    TestBed.configureTestingModule({
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }, TestablePaypalButtons],
    });

    paypalButtons = TestBed.inject(TestablePaypalButtons);
  });

  afterEach(() => {
    // Cleanup window mock
    delete (window as any).testPaypal;
    // Cleanup DOM elements
    document.body.innerHTML = '';
  });

  it('should be created', () => {
    expect(paypalButtons).toBeTruthy();
  });

  describe('createOrder()', () => {
    beforeEach(() => {
      when(checkoutFacade.basket$).thenReturn(of(mockBasket));
    });

    it('should set basket payment with payment instrument id', async () => {
      const orderId = await paypalButtons.testCreateOrder(mockPaymentMethod);

      verify(checkoutFacade.setBasketPayment('test-instrument-id')).once();
      expect(orderId).toBe('ORDER123');
    });

    it('should set basket payment with serviceId when no payment instrument exists', async () => {
      const paymentMethodWithoutInstrument = {
        ...mockPaymentMethod,
        paymentInstruments: [],
      } as PaymentMethod;

      const orderId = await paypalButtons.testCreateOrder(paymentMethodWithoutInstrument);

      verify(checkoutFacade.setBasketPayment('PayPal')).once();
      expect(orderId).toBe('ORDER123');
    });

    it('should extract order ID from redirectUrl', async () => {
      const orderId = await paypalButtons.testCreateOrder(mockPaymentMethod);

      expect(orderId).toBe('ORDER123');
    });

    it('should handle basket with different token format', async () => {
      const basketWithDifferentToken = {
        ...mockBasket,
        payment: {
          ...mockBasket.payment,
          redirectUrl: 'https://paypal.com/checkout?foo=bar&token=ORDER999',
        },
      } as Basket;

      when(checkoutFacade.basket$).thenReturn(of(basketWithDifferentToken));

      const orderId = await paypalButtons.testCreateOrder(mockPaymentMethod);

      expect(orderId).toBe('ORDER999');
    });

    it('should wait for basket with valid payment capabilities', async () => {
      // Basket emits first without payment, then with valid payment
      when(checkoutFacade.basket$).thenReturn(of({ ...mockBasket, payment: undefined } as Basket, mockBasket));

      const orderId = await paypalButtons.testCreateOrder(mockPaymentMethod);

      expect(orderId).toBe('ORDER123');
    });

    it('should reject when basket$ emits error', async () => {
      when(checkoutFacade.basket$).thenReturn(throwError(() => new Error('Basket error')));

      await expect(paypalButtons.testCreateOrder(mockPaymentMethod)).rejects.toThrow('Basket error');
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

  describe('onCancel()', () => {
    let navigateSpy: jest.SpyInstance;

    beforeEach(() => {
      navigateSpy = jest.spyOn((paypalButtons as any).router, 'navigate');
    });

    it('should delete basket payment when payment instrument exists', () => {
      paypalButtons.testOnCancelCallback(mockConfig);

      verify(checkoutFacade.deleteBasketPayment(mockConfig.paypalPaymentMethod.paymentInstruments[0])).once();
    });

    it('should navigate to basket page for FastCheckout', () => {
      paypalButtons.testOnCancelCallback(mockConfig);

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

      paypalButtons.testOnCancelCallback(configWithoutFastCheckout);

      expect(navigateSpy).toHaveBeenCalledWith(['/checkout/payment'], { queryParams: { redirect: 'cancel' } });
    });

    it('should not delete payment when no payment instrument exists', () => {
      const deletePaymentSpy = jest.spyOn(checkoutFacade, 'deleteBasketPayment');
      const configWithoutInstrument = {
        ...mockConfig,
        paypalPaymentMethod: {
          ...mockPaymentMethod,
          paymentInstruments: [],
        } as PaymentMethod,
      };

      paypalButtons.testOnCancelCallback(configWithoutInstrument);

      expect(deletePaymentSpy).not.toHaveBeenCalled();
    });
  });

  describe('onError()', () => {
    let navigateSpy: jest.SpyInstance;

    beforeEach(() => {
      navigateSpy = jest.spyOn((paypalButtons as any).router, 'navigate');
    });

    it('should navigate to basket page for FastCheckout on error', () => {
      paypalButtons.testOnErrorCallback(mockConfig);

      expect(navigateSpy).toHaveBeenCalledWith(['/basket'], { queryParams: { redirect: 'failure' } });
    });

    it('should navigate to payment page when not FastCheckout on error', () => {
      const configWithoutFastCheckout = {
        ...mockConfig,
        paypalPaymentMethod: {
          ...mockPaymentMethod,
          capabilities: ['PaypalCheckout'],
        } as PaymentMethod,
      };

      paypalButtons.testOnErrorCallback(configWithoutFastCheckout);

      expect(navigateSpy).toHaveBeenCalledWith(['/checkout/payment'], { queryParams: { redirect: 'failure' } });
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
      expect(buttonConfig).toHaveProperty('onError');
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
      delete (window as any).testPaypal.Buttons;

      try {
        await paypalButtons.renderButtons(mockConfig);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe(
          "PayPal Buttons not available in loaded paypal sdk script with namespace 'testPaypal'"
        );
      }
    });

    it('should throw error when PayPal namespace does not exist', async () => {
      const invalidConfig = {
        ...mockConfig,
        scriptNamespace: 'nonExistentNamespace',
      };

      try {
        await paypalButtons.renderButtons(invalidConfig);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe(
          "PayPal Buttons not available in loaded paypal sdk script with namespace 'nonExistentNamespace'"
        );
      }
    });

    it('should call createOrder callback', async () => {
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

      await paypalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];
      buttonConfig.onCancel();

      verify(checkoutFacade.deleteBasketPayment(mockConfig.paypalPaymentMethod.paymentInstruments[0])).once();
      expect(navigateSpy).toHaveBeenCalledWith(['/basket'], { queryParams: { redirect: 'cancel' } });
    });

    it('should call onError callback', async () => {
      const navigateSpy = jest.spyOn((paypalButtons as any).router, 'navigate');

      await paypalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];
      buttonConfig.onError();

      expect(navigateSpy).toHaveBeenCalledWith(['/basket'], { queryParams: { redirect: 'failure' } });
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
