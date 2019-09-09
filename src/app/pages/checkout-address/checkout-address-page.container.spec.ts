import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { Basket } from 'ish-core/models/basket/basket.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { LoadBasketSuccess } from 'ish-core/store/checkout/basket';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { LoginUserSuccess } from 'ish-core/store/user';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { LoadingComponent } from '../../shared/common/components/loading/loading.component';

import { CheckoutAddressPageContainerComponent } from './checkout-address-page.container';
import { CheckoutAddressAnonymousComponent } from './components/checkout-address-anonymous/checkout-address-anonymous.component';
import { CheckoutAddressComponent } from './components/checkout-address/checkout-address.component';

describe('Checkout Address Page Container', () => {
  let component: CheckoutAddressPageContainerComponent;
  let fixture: ComponentFixture<CheckoutAddressPageContainerComponent>;
  let element: HTMLElement;
  let store$: TestStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutAddressPageContainerComponent,
        MockComponent(CheckoutAddressAnonymousComponent),
        MockComponent(CheckoutAddressComponent),
        MockComponent(LoadingComponent),
      ],

      imports: [
        TranslateModule.forRoot(),
        ngrxTesting({
          ...coreReducers,
          checkout: combineReducers(checkoutReducers),
          shopping: combineReducers(shoppingReducers),
        }),
      ],
    }).compileComponents();
    store$ = TestBed.get(TestStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutAddressPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$.dispatch(new LoadBasketSuccess({ basket: { lineItems: [] } as Basket }));
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
