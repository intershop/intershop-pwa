import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CheckoutPaymentPageComponent } from './checkout-payment-page.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';

describe('Checkout Payment Page Component', () => {
  let component: CheckoutPaymentPageComponent;
  let fixture: ComponentFixture<CheckoutPaymentPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([]));
    when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));

    await TestBed.configureTestingModule({
      declarations: [
        CheckoutPaymentPageComponent,
        MockComponent(CheckoutPaymentComponent),
        MockComponent(LoadingComponent),
      ],

      imports: [TranslateModule.forRoot()],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPaymentPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render payment component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-checkout-payment')).toBeTruthy();
  });
});
