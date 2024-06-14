import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { PaymentCostInfoComponent } from 'ish-shared/components/payment/payment-cost-info/payment-cost-info.component';

import { ShoppingBasketPaymentComponent } from './shopping-basket-payment.component';

describe('Shopping Basket Payment Component', () => {
  let component: ShoppingBasketPaymentComponent;
  let fixture: ComponentFixture<ShoppingBasketPaymentComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    await TestBed.configureTestingModule({
      declarations: [MockComponent(PaymentCostInfoComponent), ShoppingBasketPaymentComponent],
      imports: [RouterTestingModule.withRoutes([{ path: 'basket', children: [] }]), TranslateModule.forRoot()],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();

    when(checkoutFacade.eligiblePaymentMethods$('basket')).thenReturn(of([BasketMockData.getPaymentMethod()]));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingBasketPaymentComponent);
    component = fixture.componentInstance;
    component.basket = BasketMockData.getBasket();
    component.priceType = of('gross');
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
