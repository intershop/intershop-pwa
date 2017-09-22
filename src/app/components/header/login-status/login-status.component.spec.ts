import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Rx';
import { anyFunction, anyString, anything, instance, mock, verify, when } from 'ts-mockito';
import { GlobalConfiguration } from '../../../configurations/global.configuration';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { UserDetail } from './../../../services/account-login/account-login.model';
import { AccountLoginService } from './../../../services/account-login/account-login.service';
import { LoginStatusComponent } from './login-status.component';

describe('Login Status Component', () => {
  let fixture: ComponentFixture<LoginStatusComponent>;
  let component: LoginStatusComponent;
  let element: HTMLElement;
  let routerMock: Router;
  let accountLoginServiceMock: AccountLoginService;
  let globalConfigurationMock: GlobalConfiguration;
  let localizeRouterServiceMock: LocalizeRouterService;
  const userData = {
    'firstName': 'Patricia',
    'lastName': 'Miller'
  };

  beforeEach(() => {
    routerMock = mock(Router);
    accountLoginServiceMock = mock(AccountLoginService);
    when(accountLoginServiceMock.isAuthorized()).thenReturn(true);
    when(accountLoginServiceMock.subscribe(anyFunction())).thenCall((callback: (d: UserDetail) => void) => callback(userData as UserDetail));
    localizeRouterServiceMock = mock(LocalizeRouterService);
    when(localizeRouterServiceMock.translateRoute(anyString())).thenCall((arg1: string) => {
      return arg1;
    });

    globalConfigurationMock = mock(GlobalConfiguration);
    when(globalConfigurationMock.getApplicationSettings()).thenReturn(Observable.of(false));

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [
        LoginStatusComponent
      ],
      providers: [
        { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) },
        { provide: GlobalConfiguration, useFactory: () => instance(globalConfigurationMock) },
        { provide: LocalizeRouterService, useFactory: () => instance(localizeRouterServiceMock) },
        { provide: Router, useFactory: () => instance(routerMock) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginStatusComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  }));

  it('should log in mocked user', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component.isLoggedIn).toBeTruthy();
    expect(component.userDetail).toBeTruthy();
  }));

  it('should navigate to "register" when register is clicked', () => {
    component.register();
    verify(routerMock.navigate(anything())).once();
  });

  it('should navigate to "home" and when logout is called', () => {
    component.logout();
    verify(routerMock.navigate(anything())).once();
  });

  it('should render full name on template when user is logged in', () => {
    fixture.detectChanges();
    const loggedInDetails = element.getElementsByClassName('login-name');
    expect(loggedInDetails).toBeTruthy();
    expect(loggedInDetails.length).toBeGreaterThan(0);
    expect(loggedInDetails[0].textContent).toEqual('Patricia Miller');
  });

  it('should verify that isLoggedIn returns false when user is not authorized', () => {
    when(accountLoginServiceMock.isAuthorized()).thenReturn(false);
    fixture.detectChanges();
    expect(component.isLoggedIn).toBe(false);
  });
});
