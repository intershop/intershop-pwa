import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { GlobalConfiguration } from '../../../configurations/global.configuration';
import { UserDetail } from '../../../services/account-login/account-login.model';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { SimpleRegistrationComponent } from './simple-registration.component';
import { SimpleRegistrationService } from './simple-registration.service';

@Pipe({ name: 'localize' })
class MockPipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

describe('Simple Registration Component', () => {
  let fixture: ComponentFixture<SimpleRegistrationComponent>;
  let component: SimpleRegistrationComponent;
  let element: HTMLElement;
  // let routerMock: Router;
  let globalConfigurationMock: GlobalConfiguration;
  let simpleRegistrationServiceMock: SimpleRegistrationService;
  let localizeRouterServiceMock: LocalizeRouterService;

  const accountSettings = {
    useSimpleAccount: true,
    userRegistrationLoginType: 'email'
  };

  beforeEach(async(() => {
    globalConfigurationMock = mock(GlobalConfiguration);
    simpleRegistrationServiceMock = mock(SimpleRegistrationService);
    localizeRouterServiceMock = mock(LocalizeRouterService);

    when(globalConfigurationMock.getApplicationSettings()).thenReturn(Observable.of(accountSettings));
    when(simpleRegistrationServiceMock.createUser(anything())).thenReturn(Observable.of(new UserDetail()));

    TestBed.configureTestingModule({
      declarations: [SimpleRegistrationComponent, MockPipe],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: LocalizeRouterService, useFactory: () => instance(localizeRouterServiceMock) },
        { provide: GlobalConfiguration, useFactory: () => instance(globalConfigurationMock) }
      ]
    }).overrideComponent(SimpleRegistrationComponent, {
      set: {
        providers: [
          { provide: SimpleRegistrationService, useFactory: () => instance(simpleRegistrationServiceMock) }
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

  it('should call createAccount when the form is Invalid and verify if controls are made dirty', () => {
    const userDetails = { userName: 'intershop@123.com', password: '123456' };
    component.simpleRegistrationForm.controls['userName'].setValue('invalid@email');
    component.simpleRegistrationForm.controls['password'].setValue('13123');
    component.createAccount(userDetails);
    expect(component.simpleRegistrationForm.controls['password'].dirty).toBe(true);
  });

  it('should call createAccount when the form is valid and verify if router.navigate is being called', () => {
    const userDetails = { userName: 'intershop@123.com', password: '123456' };
    component.simpleRegistrationForm.controls['userName'].setValue('valid@email.com');
    component.simpleRegistrationForm.controls['password'].setValue('aaaaaa1');
    component.simpleRegistrationForm.controls['confirmPassword'].setValue('aaaaaa1');
    component.createAccount(userDetails);
    verify(simpleRegistrationServiceMock.createUser(anything())).once();
    // check if it was called
    verify(localizeRouterServiceMock.navigateToRoute(anything())).once();
  });
});
