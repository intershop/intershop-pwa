import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { Customer } from 'ish-core/models/customer/customer.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { LoginUserSuccess } from 'ish-core/store/user';
import { MockComponent } from '../../utils/dev/mock.component';

import { AccountProfileSettingsPageContainerComponent } from './account-profile-settings-page.container';

describe('Account Profile Settings Page Container', () => {
  let component: AccountProfileSettingsPageContainerComponent;
  let fixture: ComponentFixture<AccountProfileSettingsPageContainerComponent>;
  let element: HTMLElement;
  const customer = {
    type: 'PrivateCustomer',
    firstName: 'Patricia',
    lastName: 'Miller',
    title: '',
    credentials: {
      login: '',
    },
  } as Customer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountProfileSettingsPageContainerComponent,
        MockComponent({
          selector: 'ish-account-profile-settings-page',
          template: 'Profile Settings Component',
          inputs: ['user'],
        }),
      ],
      imports: [StoreModule.forRoot(coreReducers), TranslateModule.forRoot()],
    })
      .compileComponents()
      .then(() => {
        TestBed.get(Store).dispatch(new LoginUserSuccess(customer));
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
