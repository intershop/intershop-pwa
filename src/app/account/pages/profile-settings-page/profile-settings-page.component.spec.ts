import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';
import { reducers } from '../../../core/store/core.system';
import { LoginUserSuccess } from '../../../core/store/user';
import { MockComponent } from '../../../dev-utils/mock.component';
import { CustomerFactory } from '../../../models/customer/customer.factory';
import { CustomerData } from '../../../models/customer/customer.interface';
import { ProfileSettingsPageComponent } from './profile-settings-page.component';

describe('Profile Settings Page Component', () => {
  let component: ProfileSettingsPageComponent;
  let fixture: ComponentFixture<ProfileSettingsPageComponent>;
  const accountLoginServiceMock = mock(AccountLoginService);
  const userData = {
    'firstName': 'Patricia',
    'lastName': 'Miller',
    'title': '',
    'credentials': {
      'login': ''
    }
  } as CustomerData;
  const customer = CustomerFactory.fromData(userData);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileSettingsPageComponent,
        MockComponent({ selector: 'ish-breadcrumb', template: 'Breadcrumb Component', inputs: ['account', 'trailText'] }),
        MockComponent({ selector: 'ish-account-navigation', template: 'Account Navigation Component' })
      ],
      providers: [
        { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) },
      ],
      imports: [
        TranslateModule.forRoot(),
        StoreModule.forRoot(reducers)
      ]
    }).compileComponents().then(() => {
      TestBed.get(Store).dispatch(new LoginUserSuccess(customer));
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingsPageComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(function() { fixture.detectChanges(); }).not.toThrow();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
