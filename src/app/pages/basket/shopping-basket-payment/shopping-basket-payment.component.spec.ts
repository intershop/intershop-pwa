import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { ShoppingBasketPaymentComponent } from './shopping-basket-payment.component';

describe('Shopping Basket Payment Component', () => {
  let component: ShoppingBasketPaymentComponent;
  let fixture: ComponentFixture<ShoppingBasketPaymentComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    await TestBed.configureTestingModule({
      declarations: [ShoppingBasketPaymentComponent],
      imports: [RouterTestingModule.withRoutes([{ path: 'basket', children: [] }]), TranslateModule.forRoot()],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();

    when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));
    when(checkoutFacade.priceType$).thenReturn(of('gross'));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingBasketPaymentComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
