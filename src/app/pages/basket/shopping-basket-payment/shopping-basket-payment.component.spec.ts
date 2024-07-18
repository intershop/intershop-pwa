import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

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
      declarations: [ShoppingBasketPaymentComponent],
      imports: [RouterTestingModule.withRoutes([{ path: 'basket', children: [] }])],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: FeatureToggleService, useValue: instance(featureToggleService) },
      ],
    }).compileComponents();

    when(checkoutFacade.eligiblePaymentMethods$({ checkoutStep: 'basket' })).thenReturn(
      of([BasketMockData.getPaymentMethod()])
    );
    when(featureToggleService.enabled('businessCustomerRegistration')).thenReturn(false);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingBasketPaymentComponent);
    component = fixture.componentInstance;
    component.basket = BasketMockData.getBasket();
    component.basket.user = BasketMockData.getUser();
    component.priceType = of('gross');
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
