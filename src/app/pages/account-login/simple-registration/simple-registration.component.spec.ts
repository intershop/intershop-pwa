import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CustomFormsModule } from 'ng2-validation';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { GlobalConfiguration } from '../../../configurations/global.configuration';
import { UserDetail } from '../../../services/account-login/account-login.model';
import { AccountLoginService } from '../../../services/account-login/account-login.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { SimpleRegistrationComponent } from './simple-registration.component';

describe('Simple Registration Component', () => {
  let fixture: ComponentFixture<SimpleRegistrationComponent>;
  let component: SimpleRegistrationComponent;
  let element: HTMLElement;
  let globalConfigurationMock: GlobalConfiguration;
  let accountLoginServiceMock: AccountLoginService;
  let localizeRouterServiceMock: LocalizeRouterService;

  const accountSettings = {
    useSimpleAccount: true,
    userRegistrationLoginType: 'email'
  };

  beforeEach(async(() => {
    globalConfigurationMock = mock(GlobalConfiguration);
    accountLoginServiceMock = mock(AccountLoginService);
    localizeRouterServiceMock = mock(LocalizeRouterService);

    when(globalConfigurationMock.getApplicationSettings()).thenReturn(Observable.of(accountSettings));
    when(accountLoginServiceMock.createUser(anything())).thenReturn(Observable.of(new UserDetail()));

    TestBed.configureTestingModule({
      declarations: [SimpleRegistrationComponent],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        CustomFormsModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: LocalizeRouterService, useFactory: () => instance(localizeRouterServiceMock) },
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
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call createAccount when the form is Invalid and verify if router.navigate is not being called', () => {
    fixture.detectChanges();
    component.simpleRegistrationForm.controls['userName'].setValue('invalid@email');
    component.simpleRegistrationForm.controls['password'].setValue('12121');
    component.createAccount();
    verify(accountLoginServiceMock.createUser(anything())).never();
    verify(localizeRouterServiceMock.navigateToRoute(anything())).never();
  });

  xit('should call createAccount when the form is valid and verify if router.navigate is being called', () => {
    component.simpleRegistrationForm.controls['userName'].setValue('valid@email.com');
    component.simpleRegistrationForm.controls['password'].setValue('aaaaaa1');
    component.simpleRegistrationForm.controls['confirmPassword'].setValue('aaaaaa1');
    component.createAccount();
    verify(accountLoginServiceMock.createUser(anything())).once();
    // check if it was called
    verify(localizeRouterServiceMock.navigateToRoute(anything())).once();
  });
});
