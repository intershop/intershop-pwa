import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { PaypalConfigService } from 'ish-core/utils/paypal-config/paypal-config.service';

import { PaymentPaypalMessagesComponent } from './payment-paypal-messages.component';

describe('Payment Paypal Messages Component', () => {
  let component: PaymentPaypalMessagesComponent;
  let fixture: ComponentFixture<PaymentPaypalMessagesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));
    when(checkoutFacade.paypalPaymentMethod$()).thenReturn(
      of({
        id: 'paypal',
        displayName: 'PayPal',
        serviceId: 'paypal-service',
        hostedPaymentPageParameters: [{ name: 'client-id', value: 'test-client-id' }],
      } as PaymentMethod)
    );

    const productContextFacade = mock(ProductContextFacade);
    when(productContextFacade.select('prices')).thenReturn(
      of({ salePrice: { value: 100, type: 'Money', currency: 'USD' } })
    );

    const paypalConfigService = mock(PaypalConfigService);
    when(paypalConfigService.loadPayPalScript(anything(), anything())).thenReturn(
      of({ src: 'test-src', loaded: true })
    );

    await TestBed.configureTestingModule({
      declarations: [PaymentPaypalMessagesComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: PaypalConfigService, useFactory: () => instance(paypalConfigService) },
        { provide: ShoppingFacade, useFactory: () => instance(productContextFacade) },
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
});
