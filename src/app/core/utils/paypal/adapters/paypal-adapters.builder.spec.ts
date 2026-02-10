import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { Price } from 'ish-core/models/price/price.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { PaypalAdapterTypes, PaypalPageType } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';

import { PaypalAdaptersBuilder } from './paypal-adapters.builder';
import { PayPalButtonsAdapter } from './paypal-buttons/paypal-buttons.adapter';
import { PayPalCardFieldsAdapter } from './paypal-card-fields/paypal-card-fields.adapter';
import { PayPalMessagesAdapter } from './paypal-messages/paypal-messages.adapter';

describe('Paypal Adapters Builder', () => {
  let builder: PaypalAdaptersBuilder;
  let checkoutFacade: CheckoutFacade;
  let shoppingFacade: ShoppingFacade;
  let payPalButtons: PayPalButtonsAdapter;
  let payPalMessages: PayPalMessagesAdapter;
  let payPalCardFields: PayPalCardFieldsAdapter;

  const mockBasket = BasketMockData.getBasket();
  const mockPaymentMethod = {
    id: 'ISH_PAYPAL',
    serviceId: 'PayPal',
    displayName: 'PayPal',
  } as PaymentMethod;

  beforeEach(() => {
    checkoutFacade = mock(CheckoutFacade);
    shoppingFacade = mock(ShoppingFacade);
    payPalButtons = mock(PayPalButtonsAdapter);
    payPalMessages = mock(PayPalMessagesAdapter);
    payPalCardFields = mock(PayPalCardFieldsAdapter);

    when(checkoutFacade.basket$).thenReturn(of(mockBasket));
    when(shoppingFacade.selectedProductId$).thenReturn(of('test-product-sku'));
    when(shoppingFacade.productPrices$('test-product-sku')).thenReturn(of({ salePrice: { value: 49.99 } as Price }));
    when(payPalButtons.renderButtons(anything())).thenReturn(Promise.resolve());
    when(payPalMessages.renderMessages(anything())).thenReturn(Promise.resolve());
    when(payPalCardFields.renderCardFields(anything(), anything())).thenReturn(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: PayPalButtonsAdapter, useFactory: () => instance(payPalButtons) },
        { provide: PayPalCardFieldsAdapter, useFactory: () => instance(payPalCardFields) },
        { provide: PayPalMessagesAdapter, useFactory: () => instance(payPalMessages) },
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
      it('should render buttons component with basket', async () => {
        const config = {
          pageType: 'checkout' as PaypalPageType,
          scriptNamespace: 'test-namespace',
          adapterType: 'Buttons' as PaypalAdapterTypes,
          paypalPaymentMethod: mockPaymentMethod,
          containerId: 'paypal-buttons-container',
        };

        await builder.build(config);

        verify(payPalButtons.renderButtons(anything())).once();
      });
    });

    describe('PayPal Messages', () => {
      it('should render messages component on product details page', async () => {
        const config = {
          pageType: 'product-details' as PaypalPageType,
          scriptNamespace: 'test-namespace',
          adapterType: 'Messages' as PaypalAdapterTypes,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        verify(payPalMessages.renderMessages(anything())).once();
      });

      it('should calculate amount from product price on product details page', async () => {
        when(shoppingFacade.selectedProductId$).thenReturn(of('product-123'));
        when(shoppingFacade.productPrices$('product-123')).thenReturn(of({ salePrice: { value: 149.99 } as Price }));

        const config = {
          pageType: 'product-details' as PaypalPageType,
          scriptNamespace: 'test-namespace',
          adapterType: 'Messages' as PaypalAdapterTypes,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        const [passedConfig] = capture(payPalMessages.renderMessages).last();
        const amount = await firstValueFrom(passedConfig.amount$);
        expect(amount).toBe(149.99);
      });

      it('should calculate amount from basket total on cart page', async () => {
        const config = {
          pageType: 'cart' as PaypalPageType,
          scriptNamespace: 'test-namespace',
          adapterType: 'Messages' as PaypalAdapterTypes,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        const [passedConfig] = capture(payPalMessages.renderMessages).last();
        const amount = await firstValueFrom(passedConfig.amount$);
        expect(amount).toBe(mockBasket.totals.total.gross);
      });

      it('should calculate amount from basket total on checkout payment page', async () => {
        const config = {
          pageType: 'checkout' as PaypalPageType,
          scriptNamespace: 'test-namespace',
          adapterType: 'Messages' as PaypalAdapterTypes,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        const [passedConfig] = capture(payPalMessages.renderMessages).last();
        const amount = await firstValueFrom(passedConfig.amount$);
        expect(amount).toBe(mockBasket.totals.total.gross);
      });

      it('should return 0 amount on home page', async () => {
        const config = {
          pageType: 'home' as PaypalPageType,
          scriptNamespace: 'test-namespace',
          adapterType: 'Messages' as PaypalAdapterTypes,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        const [passedConfig] = capture(payPalMessages.renderMessages).last();
        const amount = await firstValueFrom(passedConfig.amount$);
        expect(amount).toBe(0);
      });

      it('should return 0 amount on product listing page', async () => {
        const config = {
          pageType: 'product-listing' as PaypalPageType,
          scriptNamespace: 'test-namespace',
          adapterType: 'Messages' as PaypalAdapterTypes,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        const [passedConfig] = capture(payPalMessages.renderMessages).last();
        const amount = await firstValueFrom(passedConfig.amount$);
        expect(amount).toBe(0);
      });

      it('should handle missing product sale price gracefully', async () => {
        when(shoppingFacade.productPrices$('test-product-sku')).thenReturn(of({ salePrice: undefined }));

        const config = {
          pageType: 'product-details' as PaypalPageType,
          scriptNamespace: 'test-namespace',
          adapterType: 'Messages' as PaypalAdapterTypes,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        const [passedConfig] = capture(payPalMessages.renderMessages).last();
        const amount = await firstValueFrom(passedConfig.amount$);
        expect(amount).toBe(0);
      });

      it('should handle missing basket gracefully', async () => {
        when(checkoutFacade.basket$).thenReturn(of({} as Basket));

        const config = {
          pageType: 'cart' as PaypalPageType,
          scriptNamespace: 'test-namespace',
          adapterType: 'Messages' as PaypalAdapterTypes,
          containerId: 'paypal-messages-container',
        };

        await builder.build(config);

        verify(payPalMessages.renderMessages(anything())).once();
      });
    });

    describe('PayPal CardFields', () => {
      it('should render card fields component', async () => {
        const config = {
          pageType: 'checkout' as PaypalPageType,
          scriptNamespace: 'test-namespace',
          adapterType: 'CardFields' as PaypalAdapterTypes,
          paypalPaymentMethod: mockPaymentMethod,
          containerId: 'paypal-cardfields-container',
        };

        await builder.build(config);

        verify(payPalCardFields.renderCardFields('test-namespace', mockPaymentMethod)).once();
      });
    });
  });
});
