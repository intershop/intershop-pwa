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

import { PayPalButtonsAdapter } from './paypal-buttons.adapter';

/**
 * Testable subclass that exposes private methods for testing
 */
@Injectable()
class TestablePayPalButtons extends PayPalButtonsAdapter {
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
  let payPalButtons: TestablePayPalButtons;
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
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }, TestablePayPalButtons],
    });

    payPalButtons = TestBed.inject(TestablePayPalButtons);
  });

  afterEach(() => {
    // Cleanup window mock
    delete (window as any).testPaypal;
    // Cleanup DOM elements
    document.body.innerHTML = '';
  });

  it('should be created', () => {
    expect(payPalButtons).toBeTruthy();
  });

  describe('createOrder()', () => {
    beforeEach(() => {
      when(checkoutFacade.basket$).thenReturn(of(mockBasket));
    });

    it('should set basket payment with payment instrument id', async () => {
      const orderId = await payPalButtons.testCreateOrder(mockPaymentMethod);

      verify(checkoutFacade.setBasketPayment('test-instrument-id')).once();
      expect(orderId).toBe('ORDER123');
    });

    it('should set basket payment with serviceId when no payment instrument exists', async () => {
      const paymentMethodWithoutInstrument = {
        ...mockPaymentMethod,
        paymentInstruments: [],
      } as PaymentMethod;

      const orderId = await payPalButtons.testCreateOrder(paymentMethodWithoutInstrument);

      verify(checkoutFacade.setBasketPayment('PayPal')).once();
      expect(orderId).toBe('ORDER123');
    });

    it('should extract order ID from redirectUrl', async () => {
      const orderId = await payPalButtons.testCreateOrder(mockPaymentMethod);

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

      const orderId = await payPalButtons.testCreateOrder(mockPaymentMethod);

      expect(orderId).toBe('ORDER999');
    });

    it('should wait for basket with valid payment capabilities', async () => {
      // Basket emits first without payment, then with valid payment
      when(checkoutFacade.basket$).thenReturn(of({ ...mockBasket, payment: undefined } as Basket, mockBasket));

      const orderId = await payPalButtons.testCreateOrder(mockPaymentMethod);

      expect(orderId).toBe('ORDER123');
    });

    it('should reject when basket$ emits error', async () => {
      when(checkoutFacade.basket$).thenReturn(throwError(() => new Error('Basket error')));

      await expect(payPalButtons.testCreateOrder(mockPaymentMethod)).rejects.toThrow('Basket error');
    });
  });

  describe('onApprove()', () => {
    const approvalData = {
      payerID: 'PAYER123',
      orderID: 'ORDER456',
    };

    let navigateSpy: jest.SpyInstance;

    beforeEach(() => {
      navigateSpy = jest.spyOn((payPalButtons as any).router, 'navigate');
      when(checkoutFacade.basket$).thenReturn(of(mockBasket));
    });

    it('should navigate to review page with correct parameters', () => {
      payPalButtons.testOnApproveCallback(approvalData);

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
      payPalButtons.payPalShippingAddress = {
        city: 'Berlin',
        postalCode: '10115',
        countryCode: 'FR',
        state: '',
      };

      payPalButtons.testOnApproveCallback(approvalData);

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
      payPalButtons.payPalShippingAddress = {
        city: 'Berlin',
        postalCode: '20095',
        countryCode: 'DE',
        state: '',
      };

      payPalButtons.testOnApproveCallback(approvalData);

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
      payPalButtons.payPalShippingAddress = {
        city: 'Hamburg',
        postalCode: '10115',
        countryCode: 'DE',
        state: '',
      };

      payPalButtons.testOnApproveCallback(approvalData);

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
      payPalButtons.payPalShippingAddress = {
        city: 'BERLIN',
        postalCode: '10115',
        countryCode: 'de',
        state: '',
      };

      payPalButtons.testOnApproveCallback(approvalData);

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
      payPalButtons.payPalShippingAddress = {
        city: '  Berlin  ',
        postalCode: ' 10115 ',
        countryCode: ' DE ',
        state: '',
      };

      payPalButtons.testOnApproveCallback(approvalData);

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
      payPalButtons.payPalShippingAddress = undefined;

      payPalButtons.testOnApproveCallback(approvalData);

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
      payPalButtons.payPalShippingAddress = {
        city: 'Berlin',
        postalCode: '10115',
        countryCode: 'DE',
        state: '',
      };

      payPalButtons.testOnApproveCallback(approvalData);

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
      navigateSpy = jest.spyOn((payPalButtons as any).router, 'navigate');
    });

    it('should delete basket payment when payment instrument exists', () => {
      payPalButtons.testOnCancelCallback(mockConfig);

      verify(checkoutFacade.deleteBasketPayment(mockConfig.paypalPaymentMethod.paymentInstruments[0])).once();
    });

    it('should navigate to basket page for FastCheckout', () => {
      payPalButtons.testOnCancelCallback(mockConfig);

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

      payPalButtons.testOnCancelCallback(configWithoutFastCheckout);

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

      payPalButtons.testOnCancelCallback(configWithoutInstrument);

      expect(deletePaymentSpy).not.toHaveBeenCalled();
    });
  });

  describe('onError()', () => {
    let navigateSpy: jest.SpyInstance;

    beforeEach(() => {
      navigateSpy = jest.spyOn((payPalButtons as any).router, 'navigate');
    });

    it('should navigate to basket page for FastCheckout on error', () => {
      payPalButtons.testOnErrorCallback(mockConfig);

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

      payPalButtons.testOnErrorCallback(configWithoutFastCheckout);

      expect(navigateSpy).toHaveBeenCalledWith(['/checkout/payment'], { queryParams: { redirect: 'failure' } });
    });
  });

  describe('renderButtons()', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div id="paypal-button-container"></div>';
      when(checkoutFacade.basket$).thenReturn(of(mockBasket));
    });

    it('should successfully render PayPal buttons', async () => {
      await payPalButtons.renderButtons(mockConfig);

      expect(mockPaypalButtons).toHaveBeenCalled();
      expect(mockPaypalButtons().render).toHaveBeenCalledWith('#paypal-button-container');
    });

    it('should pass correct configuration to PayPal Buttons', async () => {
      await payPalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];

      expect(buttonConfig).toHaveProperty('style');
      expect(buttonConfig).toHaveProperty('createOrder');
      expect(buttonConfig).toHaveProperty('onApprove');
      expect(buttonConfig).toHaveProperty('onShippingAddressChange');
      expect(buttonConfig).toHaveProperty('onCancel');
      expect(buttonConfig).toHaveProperty('onError');
    });

    it('should use checkout style for checkout payment page', async () => {
      await payPalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];

      expect(buttonConfig.style).toBeObject();
    });

    it('should use cart style for non-checkout pages', async () => {
      const cartConfig: PaypalComponentsConfig = {
        ...mockConfig,
        pageType: 'cart',
      };

      await payPalButtons.renderButtons(cartConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];

      expect(buttonConfig.style).toBeObject();
    });

    it('should throw error when container element does not exist', async () => {
      document.body.innerHTML = '';

      try {
        await payPalButtons.renderButtons(mockConfig);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe("Container element 'paypal-button-container' does not exist in DOM");
      }
    });

    it('should throw error when PayPal Buttons is not available', async () => {
      delete (window as any).testPaypal.Buttons;

      try {
        await payPalButtons.renderButtons(mockConfig);
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
        await payPalButtons.renderButtons(invalidConfig);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toBe(
          "PayPal Buttons not available in loaded paypal sdk script with namespace 'nonExistentNamespace'"
        );
      }
    });

    it('should call createOrder callback', async () => {
      await payPalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];
      const orderId = await buttonConfig.createOrder();

      expect(orderId).toBe('ORDER123');
    });

    it('should call onApprove callback', async () => {
      const navigateSpy = jest.spyOn((payPalButtons as any).router, 'navigate');

      await payPalButtons.renderButtons(mockConfig);

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
      await payPalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];
      const newShippingAddress = {
        city: 'Munich',
        postalCode: '80331',
        countryCode: 'DE',
        state: 'BY',
      };

      buttonConfig.onShippingAddressChange({ shippingAddress: newShippingAddress });

      expect(payPalButtons.payPalShippingAddress).toEqual(newShippingAddress);
    });

    it('should call onCancel callback', async () => {
      const navigateSpy = jest.spyOn((payPalButtons as any).router, 'navigate');

      await payPalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];
      buttonConfig.onCancel();

      verify(checkoutFacade.deleteBasketPayment(mockConfig.paypalPaymentMethod.paymentInstruments[0])).once();
      expect(navigateSpy).toHaveBeenCalledWith(['/basket'], { queryParams: { redirect: 'cancel' } });
    });

    it('should call onError callback', async () => {
      const navigateSpy = jest.spyOn((payPalButtons as any).router, 'navigate');

      await payPalButtons.renderButtons(mockConfig);

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
      await payPalButtons.renderButtons(mockConfig);

      const buttonConfig = mockPaypalButtons.mock.calls[0][0];
      buttonConfig.onShippingAddressChange({ shippingAddress: undefined });

      expect(payPalButtons.payPalShippingAddress).toBeUndefined();
    });

    it('should handle render failure gracefully', async () => {
      mockPaypalButtons.mockReturnValue({
        render: jest.fn().mockRejectedValue(new Error('Render failed')),
      });

      try {
        await payPalButtons.renderButtons(mockConfig);
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

      await payPalButtons.renderButtons(mockConfig);

      const secondConfig = {
        ...mockConfig,
        containerId: 'paypal-button-container-2',
      };

      await payPalButtons.renderButtons(secondConfig);

      expect(mockPaypalButtons().render).toHaveBeenCalledWith('#paypal-button-container');
      expect(mockPaypalButtons().render).toHaveBeenCalledWith('#paypal-button-container-2');
    });
  });
});
