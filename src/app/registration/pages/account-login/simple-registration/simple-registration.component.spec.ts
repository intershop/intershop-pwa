import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CustomFormsModule } from 'ng2-validation';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { GlobalConfiguration } from '../../../../core/configurations/global.configuration';
import { AccountLoginService } from '../../../../core/services/account-login/account-login.service';
import { Customer } from '../../../../models/customer.model';
import { SimpleRegistrationComponent } from './simple-registration.component';

describe('Simple Registration Component', () => {
  let fixture: ComponentFixture<SimpleRegistrationComponent>;
  let component: SimpleRegistrationComponent;
  let element: HTMLElement;
  let globalConfigurationMock: GlobalConfiguration;
  let accountLoginServiceMock: AccountLoginService;
  let location: Location;

  const accountSettings = {
    useSimpleAccount: true,
    userRegistrationLoginType: 'email'
  };

  beforeEach(async(() => {
    globalConfigurationMock = mock(GlobalConfiguration);
    accountLoginServiceMock = mock(AccountLoginService);

    when(globalConfigurationMock.getApplicationSettings()).thenReturn(Observable.of(accountSettings));
    when(accountLoginServiceMock.createUser(anything())).thenReturn(Observable.of(new Customer()));

    TestBed.configureTestingModule({
      declarations: [SimpleRegistrationComponent],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        CustomFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: SimpleRegistrationComponent }
        ])
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: GlobalConfiguration, useFactory: () => instance(globalConfigurationMock) }
      ]
    }).overrideComponent(SimpleRegistrationComponent, {
      set: {
        providers: [
          { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) }
        ]
      }
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleRegistrationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    location = TestBed.get(Location);
    fixture.autoDetectChanges(true);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set isDirty to true when form is invalid', async(() => {
    expect(location.path()).toBe('');

    component.simpleRegistrationForm.controls['email'].setValue('invalid@email');
    component.simpleRegistrationForm.controls['password'].setValue('12121');

    expect(component.simpleRegistrationForm.valid).toBeFalsy();
    expect(component.simpleRegistrationForm.controls['email'].errors.email).toBeTruthy();
    expect(component.simpleRegistrationForm.controls['password'].errors.minlength).toBeTruthy();

    component.createAccount();

    fixture.whenStable().then(() => {
      verify(accountLoginServiceMock.createUser(anything())).never();
      expect(location.path()).toBe('');
    });
  }));

  it('should navigate to homepage when user is created', async(() => {
    expect(location.path()).toBe('');

    component.simpleRegistrationForm.controls['email'].setValue('valid@email.com');
    component.simpleRegistrationForm.controls['password'].setValue('aaaaaa1');
    component.simpleRegistrationForm.controls['confirmPassword'].setValue('aaaaaa1');

    expect(component.simpleRegistrationForm.valid).toBeTruthy();

    component.createAccount();

    fixture.whenStable().then(() => {
      verify(accountLoginServiceMock.createUser(anything())).once();
      expect(location.path()).toBe('/home');
    });
  }));
});
