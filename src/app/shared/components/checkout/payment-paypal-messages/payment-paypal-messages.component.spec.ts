import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalConfigHelper } from 'ish-core/models/paypal-config/paypal-config.helper';
import { PaypalConfig } from 'ish-core/models/paypal-config/paypal-config.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { PaymentPaypalMessagesComponent } from './payment-paypal-messages.component';

describe('Payment Paypal Messages Component', () => {
  let component: PaymentPaypalMessagesComponent;
  let fixture: ComponentFixture<PaymentPaypalMessagesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const appFacade = mock(AppFacade);
    when(appFacade.currentLocale$).thenReturn(of('en_US'));
    when(appFacade.currentCurrency$).thenReturn(of('USD'));
    when(appFacade.payPalConfig$).thenReturn(
      of({
        payLaterMessagingProductDetails: true,
        payLaterMessagingCategory: true,
        payLaterMessagingCart: true,
      } as PaypalConfig)
    );

    const checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));
    when(checkoutFacade.paypalPaymentMethod$(anything())).thenReturn(
      of({
        id: 'paypal',
        displayName: 'PayPal',
        serviceId: 'paypal-service',
        hostedPaymentPageParameters: [{ name: 'client-id', value: 'test-client-id' }],
      } as PaymentMethod)
    );

    const shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.productPrices$(anything())).thenReturn(
      of({ salePrice: { value: 100, type: 'Money', currency: 'USD' } })
    );

    const paypalConfigHelper = mock(PaypalConfigHelper);
    when(paypalConfigHelper.isFundingEnabled(anything(), anything())).thenReturn(true);
    when(paypalConfigHelper.loadPayPalScript(anything())).thenReturn(of('https://www.paypal.com/sdk/js'));

    await TestBed.configureTestingModule({
      declarations: [PaymentPaypalMessagesComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: PaypalConfigHelper, useFactory: () => instance(paypalConfigHelper) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPaypalMessagesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should have default pageType as cart', () => {
    expect(component.pageType).toBe('cart');
  });

  it('should initialize scriptLoaded$ as BehaviorSubject', () => {
    expect(component.scriptLoaded$).toBeInstanceOf(BehaviorSubject);
  });

  describe('pageType input', () => {
    it('should accept product-details pageType', () => {
      component.pageType = 'product-details';
      expect(component.pageType).toBe('product-details');
    });

    it('should accept product-listing pageType', () => {
      component.pageType = 'product-listing';
      expect(component.pageType).toBe('product-listing');
    });

    it('should accept checkout pageType', () => {
      component.pageType = 'checkout';
      expect(component.pageType).toBe('checkout');
    });
  });

  describe('productSKU input', () => {
    it('should accept productSKU for product-details pages', () => {
      const testSKU = 'TEST-SKU-123';
      component.productSKU = testSKU;
      expect(component.productSKU).toBe(testSKU);
    });
  });
});
