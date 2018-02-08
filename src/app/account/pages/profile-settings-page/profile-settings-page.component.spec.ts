import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { anyFunction, instance, mock, when } from 'ts-mockito';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';
import { MockComponent } from '../../../mocking/components/mock.component';
import { CustomerFactory } from '../../../models/customer/customer.factory';
import { CustomerData } from '../../../models/customer/customer.interface';
import { Customer } from '../../../models/customer/customer.model';
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
  };

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
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingsPageComponent);
    component = fixture.componentInstance;
    when(accountLoginServiceMock.subscribe(anyFunction())).thenCall((callback: (d: Customer) => void) => callback(CustomerFactory.fromData(userData as CustomerData)));
  });

  it('should be created', () => {
    expect(function() { fixture.detectChanges(); }).not.toThrow();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
