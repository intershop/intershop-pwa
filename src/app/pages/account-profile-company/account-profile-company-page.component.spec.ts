import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { LoginUserSuccess } from 'ish-core/store/user';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountProfileCompanyPageComponent } from './account-profile-company-page.component';
import { AccountProfileCompanyComponent } from './account-profile-company/account-profile-company.component';

describe('Account Profile Company Page Component', () => {
  let component: AccountProfileCompanyPageComponent;
  let fixture: ComponentFixture<AccountProfileCompanyPageComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ngrxTesting({ reducers: coreReducers })],
      declarations: [
        AccountProfileCompanyPageComponent,
        MockComponent(AccountProfileCompanyComponent),
        MockComponent(LoadingComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileCompanyPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render account-profile-company component for a business customer', () => {
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
    expect(element.querySelector('ish-account-profile-company')).toBeTruthy();
  });

  it('should not render account-profile-company component for a private customer', () => {
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
    expect(element.querySelector('ish-account-profile-company')).toBeFalsy();
  });
});
