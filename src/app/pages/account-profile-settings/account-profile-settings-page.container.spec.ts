import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { LoginUserSuccess } from 'ish-core/store/user';

import { AccountProfileSettingsPageContainerComponent } from './account-profile-settings-page.container';
import { AccountProfileSettingsPageComponent } from './components/account-profile-settings-page/account-profile-settings-page.component';

describe('Account Profile Settings Page Container', () => {
  let component: AccountProfileSettingsPageContainerComponent;
  let fixture: ComponentFixture<AccountProfileSettingsPageContainerComponent>;
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
      declarations: [AccountProfileSettingsPageContainerComponent, MockComponent(AccountProfileSettingsPageComponent)],
      imports: [StoreModule.forRoot(coreReducers), TranslateModule.forRoot()],
    })
      .compileComponents()
      .then(() => {
        TestBed.get(Store).dispatch(new LoginUserSuccess({ customer, user }));
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileSettingsPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
