import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ScriptLoaderService } from 'ish-core/utils/script-loader/script-loader.service';

import { PaymentPaypalMessagesComponent } from './payment-paypal-messages.component';

describe('Payment Paypal Messages Component', () => {
  let component: PaymentPaypalMessagesComponent;
  let fixture: ComponentFixture<PaymentPaypalMessagesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const appFacade = mock(AppFacade);
    when(appFacade.currentLocale$).thenReturn(of('en_US'));
    when(appFacade.currentCurrency$).thenReturn(of('USD'));

    const checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));
    when(checkoutFacade.paypalPaymentMethod$(anything())).thenReturn(of(undefined));

    const shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.productPrices$(anything())).thenReturn(
      of({ salePrice: { value: 100, type: 'Money', currency: 'USD' } })
    );

    const scriptLoaderService = mock(ScriptLoaderService);
    when(scriptLoaderService.load(anything())).thenReturn(of(undefined));

    await TestBed.configureTestingModule({
      declarations: [PaymentPaypalMessagesComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        { provide: ScriptLoaderService, useFactory: () => instance(scriptLoaderService) },
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
});
