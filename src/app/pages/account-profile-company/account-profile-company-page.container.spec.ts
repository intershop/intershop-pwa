import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { LoginUserSuccess } from 'ish-core/store/user';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { AccountProfileCompanyPageContainerComponent } from './account-profile-company-page.container';
import { AccountProfileCompanyPageComponent } from './components/account-profile-company-page/account-profile-company-page.component';

describe('Account Profile Company Page Container', () => {
  let component: AccountProfileCompanyPageContainerComponent;
  let fixture: ComponentFixture<AccountProfileCompanyPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ngrxTesting({ reducers: coreReducers })],
      declarations: [
        AccountProfileCompanyPageContainerComponent,
        MockComponent(AccountProfileCompanyPageComponent),
        MockComponent(LoadingComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileCompanyPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render account-profile-company-page component for a business customer', () => {
    const businessCustomer = {
      customerNo: '4711',
      isBusinessCustomer: true,
      type: 'SMBCustomer',
    } as Customer;
    store$.dispatch(
      new LoginUserSuccess({
        customer: businessCustomer,
        user: {} as User,
      })
    );
    fixture.detectChanges();
    expect(element.querySelector('ish-account-profile-company-page')).toBeTruthy();
  });

  it('should not render account-profile-company-page component for a private customer', () => {
    const privateCustomer = {
      customerNo: '4712',
      isBusinessCustomer: false,
      type: 'PrivateCustomer',
    } as Customer;
    store$.dispatch(
      new LoginUserSuccess({
        customer: privateCustomer,
        user: {} as User,
      })
    );
    fixture.detectChanges();
    expect(element.querySelector('ish-account-profile-company-page')).toBeFalsy();
  });
});
