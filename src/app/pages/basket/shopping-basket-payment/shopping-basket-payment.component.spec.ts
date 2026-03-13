import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { Payment } from 'ish-core/models/payment/payment.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { BasketPaymentCostInfoComponent } from 'ish-shared/components/basket/basket-payment-cost-info/basket-payment-cost-info.component';

import { ShoppingBasketPaymentComponent } from './shopping-basket-payment.component';

describe('Shopping Basket Payment Component', () => {
  let component: ShoppingBasketPaymentComponent;
  let fixture: ComponentFixture<ShoppingBasketPaymentComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;
  const featureToggleService = mock(FeatureToggleService);

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);

    await TestBed.configureTestingModule({
      declarations: [BasketPaymentCostInfoComponent, MockPipe(ServerSettingPipe), ShoppingBasketPaymentComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: FeatureToggleService, useValue: instance(featureToggleService) },
        provideRouter([]),
      ],
    }).compileComponents();

    when(checkoutFacade.eligibleFastCheckoutPaymentMethods$).thenReturn(of([BasketMockData.getPaymentMethod()]));
    when(featureToggleService.enabled('guestCheckout')).thenReturn(false);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingBasketPaymentComponent);
    component = fixture.componentInstance;
    component.basket = BasketMockData.getBasket();
    component.priceType$ = of('gross');
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render component if user is anonyous and guest checkout is disabled', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-basket-payment-cost-info')).toBeFalsy();
  });

  it('should render component if user is anonyous and guest checkout is enabled', () => {
    when(featureToggleService.enabled('guestCheckout')).thenReturn(true);
    fixture.detectChanges();
    expect(element.querySelector('ish-basket-payment-cost-info')).toBeTruthy();
  });

  it('should render component if user is logged in', () => {
    component.basket.user = BasketMockData.getBasketUser();
    fixture.detectChanges();
    expect(element.querySelector('ish-basket-payment-cost-info')).toBeTruthy();
  });

  describe('getPayPalPaymentMethod', () => {
    const paypalPaymentMethod: PaymentMethod = {
      id: 'ISH_PAYPAL',
      displayName: 'PayPal',
      capabilities: ['PaypalCheckout'],
    } as PaymentMethod;

    beforeEach(() => {
      when(checkoutFacade.eligibleFastCheckoutPaymentMethods$).thenReturn(of([paypalPaymentMethod]));
    });

    it('should return PayPal payment method if basket has no payment', done => {
      const basketWithoutPayment = { ...BasketMockData.getBasket(), payment: undefined } as BasketView;
      when(checkoutFacade.basket$).thenReturn(of(basketWithoutPayment));

      fixture.detectChanges();

      component.getPayPalPaymentMethod().subscribe(result => {
        expect(result).toEqual(paypalPaymentMethod);
        done();
      });
    });

    it('should return PayPal payment method if payment instrument matches and redirect is required', done => {
      const basketWithPaypalPayment = {
        ...BasketMockData.getBasket(),
        payment: {
          paymentInstrument: { id: 'ISH_PAYPAL' },
          redirectRequired: true,
        } as Payment,
      } as BasketView;
      when(checkoutFacade.basket$).thenReturn(of(basketWithPaypalPayment));

      fixture.detectChanges();

      component.getPayPalPaymentMethod().subscribe(result => {
        expect(result).toEqual(paypalPaymentMethod);
        done();
      });
    });

    it('should return undefined if payment instrument matches but redirect is not required', done => {
      const basketWithPaypalPaymentNoRedirect = {
        ...BasketMockData.getBasket(),
        payment: {
          paymentInstrument: { id: 'ISH_PAYPAL' },
          redirectRequired: false,
        } as Payment,
      } as BasketView;
      when(checkoutFacade.basket$).thenReturn(of(basketWithPaypalPaymentNoRedirect));

      fixture.detectChanges();

      component.getPayPalPaymentMethod().subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should return PayPal payment method if payment instrument does not match PayPal', done => {
      const basketWithOtherPayment = {
        ...BasketMockData.getBasket(),
        payment: {
          paymentInstrument: { id: 'OTHER_PAYMENT' },
          redirectRequired: true,
        } as Payment,
      } as BasketView;
      when(checkoutFacade.basket$).thenReturn(of(basketWithOtherPayment));

      fixture.detectChanges();

      component.getPayPalPaymentMethod().subscribe(result => {
        expect(result).toEqual(paypalPaymentMethod);
        done();
      });
    });

    it('should return undefined if no PayPal payment method is available', done => {
      const nonPaypalMethod: PaymentMethod = {
        id: 'ISH_CREDIT_CARD',
        displayName: 'Credit Card',
        capabilities: [],
      } as PaymentMethod;
      when(checkoutFacade.eligibleFastCheckoutPaymentMethods$).thenReturn(of([nonPaypalMethod]));

      const basketWithoutPayment = { ...BasketMockData.getBasket(), payment: undefined } as BasketView;
      when(checkoutFacade.basket$).thenReturn(of(basketWithoutPayment));

      fixture.detectChanges();

      component.getPayPalPaymentMethod().subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });
  });
});
