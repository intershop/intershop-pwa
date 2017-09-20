import { mock, instance, anything, verify, when } from 'ts-mockito';
import { SimpleRegistrationComponent } from './simple-registration.component';
import { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobalConfiguration } from '../../../configurations/global.configuration';
import { Observable } from 'rxjs/Observable';
import { SimpleRegistrationService } from './simple-registration.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserDetail } from '../../../services/account-login/account-login.model';

describe('Simple Registration Component', () => {
  let fixture: ComponentFixture<SimpleRegistrationComponent>;
  let component: SimpleRegistrationComponent;
  let element: HTMLElement;
  let routerMock: Router;
  let globalConfigurationMock: GlobalConfiguration;
  let simpleRegistrationServiceMock: SimpleRegistrationService;
  const accountSettings = {
    useSimpleAccount: true,
    userRegistrationLoginType: 'email'
  };

  beforeEach(async(() => {
    routerMock = mock(Router);
    globalConfigurationMock = mock(GlobalConfiguration);
    simpleRegistrationServiceMock = mock(SimpleRegistrationService);
    when(globalConfigurationMock.getApplicationSettings()).thenReturn(Observable.of(accountSettings));
    when(simpleRegistrationServiceMock.createUser(anything())).thenReturn(Observable.of(new UserDetail()));

    TestBed.configureTestingModule({
      declarations: [SimpleRegistrationComponent],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{
        provide: Router,
        useFactory: () => instance(routerMock)
      },
      {
        provide: LocalizeRouterService,
        useFactory: () => instance(mock(LocalizeRouterService))
      },
      {
        provide: GlobalConfiguration,
        useFactory: () => instance(globalConfigurationMock)
      }]
    }).overrideComponent(SimpleRegistrationComponent, {
      set: {
        providers: [
          {
            provide: SimpleRegistrationService,
            useFactory: () => instance(simpleRegistrationServiceMock)
          }
        ]
      }
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleRegistrationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call createAccount when the form is Invalid and verify if controls are made dirty', () => {
    fixture.detectChanges();
    const userDetails = { userName: 'intershop@123.com', password: '123456' };
    component.simpleRegistrationForm.controls['userName'].setValue('invalid@email');
    component.simpleRegistrationForm.controls['password'].setValue('13123');
    component.createAccount(userDetails);
    expect(component.simpleRegistrationForm.controls['password'].dirty).toBe(true);
  });

  it('should call createAccount when the form is valid and verify if router.navigate is being called', () => {
    fixture.detectChanges();
    const userDetails = { userName: 'intershop@123.com', password: '123456' };
    component.simpleRegistrationForm.controls['userName'].setValue('valid@email.com');
    component.simpleRegistrationForm.controls['password'].setValue('aaaaaa1');
    component.simpleRegistrationForm.controls['confirmPassword'].setValue('aaaaaa1');
    component.createAccount(userDetails);
    verify(simpleRegistrationServiceMock.createUser(anything())).once();
    verify(routerMock.navigate(anything())).once();
  });
});
