import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { Price } from 'ish-core/models/price/price.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { PaypalComponentTypes, PaypalPageTypes } from 'ish-core/utils/sdk/paypal/paypal-config/paypal-config.service';

import { PayPalButtons } from './buttons/paypal-buttons';
import { PayPalCardFields } from './card-fields/paypal-card-fields';
import { PayPalMessages } from './messages/paypal-messages';
import { PaypalComponentBuilder } from './paypal-component.builder';

describe('Paypal Component Builder', () => {
  let builder: PaypalComponentBuilder;
  let checkoutFacade: CheckoutFacade;
  let shoppingFacade: ShoppingFacade;
  let payPalButtons: PayPalButtons;
  let payPalMessages: PayPalMessages;
  let payPalCardFields: PayPalCardFields;

  const mockBasket = BasketMockData.getBasket();
  const mockPaymentMethod = {
    id: 'ISH_PAYPAL',
    serviceId: 'PayPal',
    displayName: 'PayPal',
  } as PaymentMethod;

  beforeEach(() => {
    checkoutFacade = mock(CheckoutFacade);
    shoppingFacade = mock(ShoppingFacade);
    payPalButtons = mock(PayPalButtons);
    payPalMessages = mock(PayPalMessages);
    payPalCardFields = mock(PayPalCardFields);

    when(checkoutFacade.basket$).thenReturn(of(mockBasket));
    when(shoppingFacade.selectedProductId$).thenReturn(of('test-product-sku'));
    when(shoppingFacade.productPrices$('test-product-sku')).thenReturn(of({ salePrice: { value: 49.99 } as Price }));
    when(payPalButtons.renderButtons(anything())).thenReturn(Promise.resolve());
    when(payPalMessages.renderMessages(anything())).thenReturn(Promise.resolve());
    when(payPalCardFields.renderCardFields(anything(), anything())).thenReturn(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: PayPalButtons, useFactory: () => instance(payPalButtons) },
        { provide: PayPalCardFields, useFactory: () => instance(payPalCardFields) },
        { provide: PayPalMessages, useFactory: () => instance(payPalMessages) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        PaypalComponentBuilder,
      ],
    });

    builder = TestBed.inject(PaypalComponentBuilder);
  });

  it('should be created', () => {
    expect(builder).toBeTruthy();
  });

  describe('build()', () => {
    describe('PayPal Buttons', () => {
      it('should render buttons component with basket', async () => {
        const config = {
          pageType: PaypalPageTypes.CheckoutPayment,
          scriptNamespace: 'test-namespace',
          componentType: PaypalComponentTypes.Buttons,
          paypalPaymentMethod: mockPaymentMethod,
          containerId: 'paypal-buttons-container',
        };

        await builder.build(config);

        verify(payPalButtons.renderButtons(anything())).once();
        const [passedConfig] = capture(payPalButtons.renderButtons).last();
        expect(passedConfig.basket).toEqual(mockBasket);
      });
    });

    describe('PayPal Messages', () => {
      it('should render messages component on product details page', async () => {
        const config = {
          pageType: PaypalPageTypes.ProductDetails,
          scriptNamespace: 'test-namespace',
          componentType: PaypalComponentTypes.Messages,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        verify(payPalMessages.renderMessages(anything())).once();
      });

      it('should calculate amount from product price on product details page', async () => {
        when(shoppingFacade.selectedProductId$).thenReturn(of('product-123'));
        when(shoppingFacade.productPrices$('product-123')).thenReturn(of({ salePrice: { value: 149.99 } as Price }));

        const config = {
          pageType: PaypalPageTypes.ProductDetails,
          scriptNamespace: 'test-namespace',
          componentType: PaypalComponentTypes.Messages,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        const [passedConfig] = capture(payPalMessages.renderMessages).last();
        expect(passedConfig.amount).toBe(149.99);
      });

      it('should calculate amount from basket total on cart page', async () => {
        const config = {
          pageType: PaypalPageTypes.Cart,
          scriptNamespace: 'test-namespace',
          componentType: PaypalComponentTypes.Messages,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        const [passedConfig] = capture(payPalMessages.renderMessages).last();
        expect(passedConfig.amount).toBe(mockBasket.totals.total.gross);
      });

      it('should calculate amount from basket total on checkout payment page', async () => {
        const config = {
          pageType: PaypalPageTypes.CheckoutPayment,
          scriptNamespace: 'test-namespace',
          componentType: PaypalComponentTypes.Messages,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        const [passedConfig] = capture(payPalMessages.renderMessages).last();
        expect(passedConfig.amount).toBe(mockBasket.totals.total.gross);
      });

      it('should return 0 amount on home page', async () => {
        const config = {
          pageType: PaypalPageTypes.Home,
          scriptNamespace: 'test-namespace',
          componentType: PaypalComponentTypes.Messages,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        const [passedConfig] = capture(payPalMessages.renderMessages).last();
        expect(passedConfig.amount).toBe(0);
      });

      it('should return 0 amount on product listing page', async () => {
        const config = {
          pageType: PaypalPageTypes.ProductListing,
          scriptNamespace: 'test-namespace',
          componentType: PaypalComponentTypes.Messages,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        const [passedConfig] = capture(payPalMessages.renderMessages).last();
        expect(passedConfig.amount).toBe(0);
      });

      it('should handle missing product sale price gracefully', async () => {
        when(shoppingFacade.productPrices$('test-product-sku')).thenReturn(of({ salePrice: undefined }));

        const config = {
          pageType: PaypalPageTypes.ProductDetails,
          scriptNamespace: 'test-namespace',
          componentType: PaypalComponentTypes.Messages,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        const [passedConfig] = capture(payPalMessages.renderMessages).last();
        expect(passedConfig.amount).toBe(0);
      });

      it('should handle missing basket gracefully', async () => {
        when(checkoutFacade.basket$).thenReturn(of({} as Basket));

        const config = {
          pageType: PaypalPageTypes.Cart,
          scriptNamespace: 'test-namespace',
          componentType: PaypalComponentTypes.Messages,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        verify(payPalMessages.renderMessages(anything())).once();
      });
    });

    describe('PayPal CardFields', () => {
      it('should render card fields component', async () => {
        const config = {
          pageType: PaypalPageTypes.CheckoutPayment,
          scriptNamespace: 'test-namespace',
          componentType: PaypalComponentTypes.CardFields,
          paypalPaymentMethod: mockPaymentMethod,
          containerId: 'paypal-cardfields-container',
        };

        await builder.build(config);

        verify(payPalCardFields.renderCardFields('test-namespace', mockPaymentMethod)).once();
      });
    });
  });
});
