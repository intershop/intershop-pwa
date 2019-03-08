import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { LoginUserSuccess } from 'ish-core/store/user';
import { MockComponent } from 'ish-core/utils/dev/mock.component';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { CheckoutAddressPageContainerComponent } from './checkout-address-page.container';

describe('Checkout Address Page Container', () => {
  let component: CheckoutAddressPageContainerComponent;
  let fixture: ComponentFixture<CheckoutAddressPageContainerComponent>;
  let element: HTMLElement;
  let store$: TestStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutAddressPageContainerComponent,
        MockComponent({
          selector: 'ish-checkout-address',
          template: 'Checkout Address Component',
          inputs: ['currentUser', 'basket', 'addresses', 'error'],
        }),
        MockComponent({
          selector: 'ish-checkout-address-anonymous',
          template: 'Checkout Address Anonymous Component',
          inputs: ['basket', 'error'],
        }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
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
