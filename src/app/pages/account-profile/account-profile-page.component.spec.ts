import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { LoginUserSuccess } from 'ish-core/store/user';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { AccountProfilePageComponent } from './account-profile-page.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';

describe('Account Profile Page Component', () => {
  let component: AccountProfilePageComponent;
  let fixture: ComponentFixture<AccountProfilePageComponent>;
  let element: HTMLElement;
  const customer = {
    type: 'PrivateCustomer',
  } as Customer;

  const user = {
    firstName: 'Patricia',
    lastName: 'Miller',
    title: '',
  } as User;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountProfilePageComponent, MockComponent(AccountProfileComponent)],
      imports: [TranslateModule.forRoot(), ngrxTesting({ reducers: coreReducers })],
    })
      .compileComponents()
      .then(() => {
        TestBed.get(Store).dispatch(new LoginUserSuccess({ customer, user }));
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfilePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
