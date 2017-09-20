import { LoginStatusComponent } from './login-status.component';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AccountLoginService } from '../../../services/account-login';
import { GlobalState } from '../../../services';
import { mock, instance, when, anything, anyString, verify } from 'ts-mockito';
import { GlobalConfiguration } from '../../../configurations/global.configuration';
import { Observable } from 'rxjs/Rx';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Login Status Component', () => {
  let fixture: ComponentFixture<LoginStatusComponent>;
  let component: LoginStatusComponent;
  let element: HTMLElement;
  let routerMock: Router;
  let accountLoginServiceMock: AccountLoginService;
  let globalStateMock: GlobalState;
  let globalConfigurationMock: GlobalConfiguration;
  let localizeRouterServiceMock: LocalizeRouterService;
  const userData = {
    'firstName': 'Patricia',
    'lastName': 'Miller'
  };

  beforeEach(() => {
    routerMock = mock(Router);
    accountLoginServiceMock = mock(AccountLoginService);
    localizeRouterServiceMock = mock(LocalizeRouterService);
    when(localizeRouterServiceMock.translateRoute(anyString())).thenCall((arg1: string) => {
      return arg1;
    });

    globalStateMock = mock(GlobalState);
    const callBackMock = (key, callBack: Function) => callBack(userData);
    when(globalStateMock.subscribe(anything(), anything())).thenCall(callBackMock);
    when(globalStateMock.subscribeCachedData(anything(), anything())).thenCall(callBackMock);

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
        { provide: GlobalState, useFactory: () => instance(globalStateMock) },
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
    expect(component.isLoggedIn).toBe(true);
    expect(component.userDetail).toBeTruthy();
  }));

  it('should navigate to "register" when register is clicked', () => {
    component.register();
    verify(routerMock.navigate(anything())).once();
  });

  it('should navigate to "home" and unset userDetails when logout is called', () => {
    component.logout();

    expect(component.userDetail).toBeNull();
    verify(routerMock.navigate(anything())).once();
  });

  it('should render full name on template when user is logged in', () => {
    fixture.detectChanges();
    const loggedInDetails = element.getElementsByClassName('login-name');
    expect(loggedInDetails[0].textContent).toEqual('Patricia Miller');
  });

  xit('should verify that isLoggedIn is set to false when globalState returns null', () => {
    fixture.detectChanges();
    when(globalStateMock.subscribe(anything(), anything())).thenReturn(null);
    when(globalStateMock.subscribeCachedData(anything(), anything())).thenReturn(null);
    expect(component.isLoggedIn).toBe(false);
  });
});
