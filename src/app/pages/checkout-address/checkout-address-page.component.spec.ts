import { Component } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { Basket } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { User } from 'ish-core/models/user/user.model';
import { LoadBasketSuccess } from 'ish-core/store/checkout/basket';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { LoginUserSuccess } from 'ish-core/store/user';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CheckoutAddressAnonymousComponent } from './checkout-address-anonymous/checkout-address-anonymous.component';
import { CheckoutAddressPageComponent } from './checkout-address-page.component';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';

describe('Checkout Address Page Component', () => {
  let component: CheckoutAddressPageComponent;
  let fixture: ComponentFixture<CheckoutAddressPageComponent>;
  let element: HTMLElement;
  let store$: TestStore;

  beforeEach(async(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [
        CheckoutAddressPageComponent,
        DummyComponent,
        MockComponent(CheckoutAddressAnonymousComponent),
        MockComponent(CheckoutAddressComponent),
        MockComponent(LoadingComponent),
      ],

      imports: [
        RouterTestingModule.withRoutes([{ path: 'basket', component: DummyComponent }]),
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            ...coreReducers,
            checkout: combineReducers(checkoutReducers),
            shopping: combineReducers(shoppingReducers),
          },
        }),
      ],
    }).compileComponents();
    store$ = TestBed.get(TestStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutAddressPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$.dispatch(
      new LoadBasketSuccess({ basket: { lineItems: [BasketMockData.getBasketItem() as LineItem] } as Basket })
    );
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render checkout address component if user is logged in', () => {
    store$.dispatch(new LoginUserSuccess({ customer: { customerNo: '4711' } as Customer, user: {} as User }));
    fixture.detectChanges();
    expect(element.querySelector('ish-checkout-address')).toBeTruthy();
  });

  it('should render checkout address anonymous component if user is not logged in', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-checkout-address-anonymous')).toBeTruthy();
  });
});
