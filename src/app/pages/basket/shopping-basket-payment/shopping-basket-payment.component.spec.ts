import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { BasketPaymentCostInfoComponent } from 'ish-shared/components/basket/basket-payment-cost-info/basket-payment-cost-info.component';

import { ShoppingBasketPaymentComponent } from './shopping-basket-payment.component';

describe('Shopping Basket Payment Component', () => {
  let component: ShoppingBasketPaymentComponent;
  let fixture: ComponentFixture<ShoppingBasketPaymentComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;
  let activatedRoute: ActivatedRoute;
  const featureToggleService = mock(FeatureToggleService);

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    activatedRoute = mock(ActivatedRoute);

    await TestBed.configureTestingModule({
      declarations: [BasketPaymentCostInfoComponent, ShoppingBasketPaymentComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useFactory: () => instance(activatedRoute) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: FeatureToggleService, useValue: instance(featureToggleService) },
      ],
    }).compileComponents();

    when(checkoutFacade.eligibleFastCheckoutPaymentMethods$()).thenReturn(of([BasketMockData.getPaymentMethod()]));
    when(featureToggleService.enabled('guestCheckout')).thenReturn(false);
    when(activatedRoute.queryParamMap).thenReturn(of());
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
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.querySelector('ish-basket-payment-cost-info')).toBeTruthy();
  });

  it('should render component if user is logged in', () => {
    component.basket.user = BasketMockData.getUser();
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element.querySelector('ish-basket-payment-cost-info')).toBeTruthy();
  });
});
