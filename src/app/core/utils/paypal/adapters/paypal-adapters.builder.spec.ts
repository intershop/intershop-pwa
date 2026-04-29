import { TestBed } from '@angular/core/testing';
import { Observable, firstValueFrom, of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { Price } from 'ish-core/models/price/price.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { PaypalAdapterTypes } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';

import { PaypalAdaptersBuilder, PaypalComponentsConfig } from './paypal-adapters.builder';
import { PaypalApplePayAdapter } from './paypal-apple-pay/paypal-apple-pay.adapter';
import { PaypalButtonsAdapter } from './paypal-buttons/paypal-buttons.adapter';
import { PaypalCardFieldsAdapter } from './paypal-card-fields/paypal-card-fields.adapter';
import { PaypalGooglePayAdapter } from './paypal-google-pay/paypal-google-pay.adapter';
import { PaypalMessagesAdapter } from './paypal-messages/paypal-messages.adapter';

describe('Paypal Adapters Builder', () => {
  let builder: PaypalAdaptersBuilder;
  let checkoutFacade: CheckoutFacade;
  let shoppingFacade: ShoppingFacade;
  let paypalButtons: PaypalButtonsAdapter;
  let paypalMessages: PaypalMessagesAdapter;
  let paypalCardFields: PaypalCardFieldsAdapter;
  let paypalGooglePay: PaypalGooglePayAdapter;
  let paypalApplePay: PaypalApplePayAdapter;

  const mockBasket = BasketMockData.getBasket();
  const mockPaymentMethod = {
    id: 'ISH_PAYPAL',
    serviceId: 'PayPal',
    displayName: 'PayPal',
  } as PaymentMethod;

  beforeEach(() => {
    checkoutFacade = mock(CheckoutFacade);
    shoppingFacade = mock(ShoppingFacade);
    paypalButtons = mock(PaypalButtonsAdapter);
    paypalMessages = mock(PaypalMessagesAdapter);
    paypalCardFields = mock(PaypalCardFieldsAdapter);
    paypalGooglePay = mock(PaypalGooglePayAdapter);
    paypalApplePay = mock(PaypalApplePayAdapter);

    when(checkoutFacade.basket$).thenReturn(of(mockBasket));
    when(shoppingFacade.selectedProductId$).thenReturn(of('test-product-sku'));
    when(shoppingFacade.productPrices$('test-product-sku')).thenReturn(of({ salePrice: { value: 49.99 } as Price }));
    when(paypalButtons.renderButtons(anything())).thenReturn(Promise.resolve());
    when(paypalMessages.renderMessages(anything())).thenReturn(Promise.resolve());
    when(paypalCardFields.renderCardFields(anything())).thenReturn(Promise.resolve());
    when(paypalGooglePay.renderGooglePayButton(anything())).thenReturn(Promise.resolve());
    when(paypalApplePay.renderApplePayButton(anything())).thenReturn(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: PaypalApplePayAdapter, useFactory: () => instance(paypalApplePay) },
        { provide: PaypalButtonsAdapter, useFactory: () => instance(paypalButtons) },
        { provide: PaypalCardFieldsAdapter, useFactory: () => instance(paypalCardFields) },
        { provide: PaypalGooglePayAdapter, useFactory: () => instance(paypalGooglePay) },
        { provide: PaypalMessagesAdapter, useFactory: () => instance(paypalMessages) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        PaypalAdaptersBuilder,
      ],
    });

    builder = TestBed.inject(PaypalAdaptersBuilder);
  });

  it('should be created', () => {
    expect(builder).toBeTruthy();
  });

  describe('build()', () => {
    describe('PayPal Buttons', () => {
      const defaultConfig: PaypalComponentsConfig = {
        pageType: 'checkout',
        scriptNamespace: 'test-namespace',
        adapterType: 'Buttons',
        paypalPaymentMethod: mockPaymentMethod,
        containerId: 'paypal-buttons-container',
      };

      it('should render buttons component with basket', async () => {
        await builder.build(defaultConfig);

        verify(paypalButtons.renderButtons(anything())).once();
      });
    });

    describe('PayPal Messages', () => {
      const defaultConfig: PaypalComponentsConfig = {
        pageType: 'checkout',
        scriptNamespace: 'test-namespace',
        adapterType: 'Messages',
        containerId: 'paypal-messages-container',
      };

      it('should render messages component on product details page', async () => {
        await builder.build({ ...defaultConfig, pageType: 'product-details' });

        verify(paypalMessages.renderMessages(anything())).once();
      });

      it('should calculate amount from product price on product details page', async () => {
        when(shoppingFacade.selectedProductId$).thenReturn(of('product-123'));
        when(shoppingFacade.productPrices$('product-123')).thenReturn(of({ salePrice: { value: 149.99 } as Price }));

        await builder.build({ ...defaultConfig, pageType: 'product-details' });

        const [passedConfig] = capture(paypalMessages.renderMessages).last();
        const amount = await firstValueFrom(passedConfig.amount$);
        expect(amount).toBe(149.99);
      });

      it('should calculate amount from basket total on cart page', async () => {
        await builder.build({ ...defaultConfig, pageType: 'cart' });

        const [passedConfig] = capture(paypalMessages.renderMessages).last();
        const amount = await firstValueFrom(passedConfig.amount$);
        expect(amount).toBe(mockBasket.totals.total.gross);
      });

      it('should calculate amount from basket total on checkout payment page', async () => {
        await builder.build(defaultConfig);

        const [passedConfig] = capture(paypalMessages.renderMessages).last();
        const amount = await firstValueFrom(passedConfig.amount$);
        expect(amount).toBe(mockBasket.totals.total.gross);
      });

      it('should return 0 amount on home page', async () => {
        await builder.build({ ...defaultConfig, pageType: 'home' });

        const [passedConfig] = capture(paypalMessages.renderMessages).last();
        const amount = await firstValueFrom(passedConfig.amount$);
        expect(amount).toBe(0);
      });

      it('should return 0 amount on product listing page', async () => {
        await builder.build({ ...defaultConfig, pageType: 'product-listing' });

        const [passedConfig] = capture(paypalMessages.renderMessages).last();
        const amount = await firstValueFrom(passedConfig.amount$);
        expect(amount).toBe(0);
      });

      it('should handle missing product sale price gracefully', async () => {
        when(shoppingFacade.productPrices$('test-product-sku')).thenReturn(of({ salePrice: undefined }));

        await builder.build({ ...defaultConfig, pageType: 'product-details' });

        const [passedConfig] = capture(paypalMessages.renderMessages).last();
        const amount = await firstValueFrom(passedConfig.amount$);
        expect(amount).toBe(0);
      });

      it('should handle missing basket gracefully', async () => {
        when(checkoutFacade.basket$).thenReturn(of({} as Basket));

        await builder.build({ ...defaultConfig, pageType: 'cart' });

        verify(paypalMessages.renderMessages(anything())).once();
      });
    });

    describe('PayPal CardFields', () => {
      const defaultConfig: PaypalComponentsConfig = {
        pageType: 'checkout',
        scriptNamespace: 'test-namespace',
        adapterType: 'CardFields',
        paypalPaymentMethod: mockPaymentMethod,
        containerId: 'paypal-cardfields-container',
      };

      it('should render card fields component', async () => {
        await builder.build(defaultConfig);

        verify(paypalCardFields.renderCardFields(mockPaymentMethod)).once();
      });
    });

    describe('PayPal Google Pay', () => {
      const mockGooglePayPaymentMethod = {
        id: 'ISH_PAYPAL_GOOGLEPAY',
        serviceId: 'PayPalGooglePay',
        displayName: 'Google Pay',
      } as PaymentMethod;

      const defaultConfig: PaypalComponentsConfig = {
        pageType: 'checkout',
        scriptNamespace: 'PPCP_ISH_PAYPAL_GOOGLEPAY',
        adapterType: 'GooglePay',
        paypalPaymentMethod: mockGooglePayPaymentMethod,
        containerId: 'googlepay-button-container',
      };

      it('should render Google Pay button component', async () => {
        await builder.build({ ...defaultConfig, merchantId: 'Test Merchant' });

        verify(paypalGooglePay.renderGooglePayButton(anything())).once();
      });

      it('should pass correct config to Google Pay adapter', async () => {
        await builder.build({ ...defaultConfig, merchantId: 'My Shop' });

        const [passedConfig] = capture(paypalGooglePay.renderGooglePayButton).last();
        expect(passedConfig.containerId).toBe('googlepay-button-container');
        expect(passedConfig.merchantId).toBe('My Shop');
        expect(passedConfig.paypalPaymentMethod).toEqual(mockGooglePayPaymentMethod);
      });

      it('should handle Google Pay render error gracefully', async () => {
        when(paypalGooglePay.renderGooglePayButton(anything())).thenReturn(
          Promise.reject(new Error('Google Pay not available'))
        );

        await expect(firstValueFrom(builder.build(defaultConfig) as Observable<void>)).rejects.toThrow(
          'Google Pay not available'
        );
      });
    });

    describe('PayPal Apple Pay', () => {
      const mockApplePayPaymentMethod = {
        id: 'ISH_PAYPAL_APPLEPAY',
        serviceId: 'PayPalApplePay',
        displayName: 'Apple Pay',
      } as PaymentMethod;

      const defaultConfig: PaypalComponentsConfig = {
        pageType: 'checkout',
        scriptNamespace: 'PPCP_ISH_PAYPAL_APPLEPAY',
        adapterType: 'ApplePay',
        paypalPaymentMethod: mockApplePayPaymentMethod,
        containerId: 'applepay-button-container',
      };

      it('should render Apple Pay button component', async () => {
        await builder.build({ ...defaultConfig, merchantId: 'Test Merchant' });

        verify(paypalApplePay.renderApplePayButton(anything())).once();
      });

      it('should pass correct config to Apple Pay adapter', async () => {
        await builder.build({ ...defaultConfig, merchantId: 'My Apple Shop' });

        const [passedConfig] = capture(paypalApplePay.renderApplePayButton).last();
        expect(passedConfig.containerId).toBe('applepay-button-container');
        expect(passedConfig.merchantId).toBe('My Apple Shop');
        expect(passedConfig.paypalPaymentMethod).toEqual(mockApplePayPaymentMethod);
      });

      it('should handle Apple Pay render error gracefully', async () => {
        when(paypalApplePay.renderApplePayButton(anything())).thenReturn(
          Promise.reject(new Error('Apple Pay not available'))
        );

        await expect(firstValueFrom(builder.build(defaultConfig) as Observable<void>)).rejects.toThrow(
          'Apple Pay not available'
        );
      });

      it('should handle Apple Pay not eligible error', async () => {
        when(paypalApplePay.renderApplePayButton(anything())).thenReturn(
          Promise.reject(new Error('Apple Pay is not eligible for this merchant'))
        );

        await expect(firstValueFrom(builder.build(defaultConfig) as Observable<void>)).rejects.toThrow(
          'Apple Pay is not eligible for this merchant'
        );
      });
    });

    describe('Unsupported adapter type', () => {
      it('should reject with error for unsupported adapter type', async () => {
        const config: PaypalComponentsConfig = {
          pageType: 'checkout',
          scriptNamespace: 'test-namespace',
          adapterType: 'UnsupportedType' as PaypalAdapterTypes,
          containerId: 'container',
        };

        await expect(firstValueFrom(builder.build(config) as Observable<void>)).rejects.toThrow(
          'Unsupported PayPal component type: UnsupportedType'
        );
      });
    });
  });
});
