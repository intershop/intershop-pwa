import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { User } from 'ish-core/models/user/user.model';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { CheckoutAddressAnonymousComponent } from './checkout-address-anonymous/checkout-address-anonymous.component';
import { CheckoutAddressPageComponent } from './checkout-address-page.component';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';

describe('Checkout Address Page Component', () => {
  let component: CheckoutAddressPageComponent;
  let fixture: ComponentFixture<CheckoutAddressPageComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    const checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.basket$).thenReturn(of({ lineItems: [BasketMockData.getBasketItem()] } as BasketView));

    accountFacade = mock(AccountFacade);

    await TestBed.configureTestingModule({
      declarations: [
        CheckoutAddressPageComponent,
        MockComponent(CheckoutAddressAnonymousComponent),
        MockComponent(CheckoutAddressComponent),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutAddressPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render checkout address component if user is logged in', () => {
    when(accountFacade.user$).thenReturn(of({} as User));

    fixture.detectChanges();
    expect(element.querySelector('ish-checkout-address')).toBeTruthy();
  });

  it('should render checkout address anonymous component if user is not logged in', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-checkout-address-anonymous')).toBeTruthy();
  });
});
