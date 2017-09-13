import { LoginStatusComponent } from './login-status.component';
import { inject, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { userData } from '../../../services/account-login/account-login.mock';
import { AccountLoginService } from '../../../services/account-login';
import { GlobalState } from '../../../services';
import { mock, instance, when, anything, anyString } from 'ts-mockito';
import { GlobalConfiguration } from '../../../global-configuration/global-configuration';
import { Observable } from 'rxjs/Rx';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('Login Status Component', () => {

  let fixture: ComponentFixture<LoginStatusComponent>;
  let component: LoginStatusComponent;
  let element: HTMLElement;
  let accountLoginServiceMock: AccountLoginService;
  let globalStateMock: GlobalState;
  let globalConfigurationMock: GlobalConfiguration;
  let localizeRouterServiceMock: LocalizeRouterService;

  beforeEach(() => {
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
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        LoginStatusComponent
      ],
      providers: [
        { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) },
        { provide: GlobalState, useFactory: () => instance(globalStateMock) },
        { provide: GlobalConfiguration, useFactory: () => instance(globalConfigurationMock) },
        { provide: LocalizeRouterService, useFactory: () => instance(localizeRouterServiceMock) }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginStatusComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const router = TestBed.get(Router);
    this.navSpy = spyOn(router, 'navigate');
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

  it('should navigate to "register" when register is clicked', fakeAsync(() => {
    component.register();
    tick();
    expect(this.navSpy).toHaveBeenCalledWith(['/register']);
  }));

  it('should navigate to "home" and unset userDetails when logout is called', () => {
    component.logout();

    expect(this.navSpy).toHaveBeenCalledWith(['/home']);
    expect(component.userDetail).toBeNull();
    // expect(component.isLoggedIn).toBe(false);
  });

  it('should navigate to "login" when signIn is called', inject([Router], (router: Router) => {
    component.signIn();

    expect(this.navSpy).toHaveBeenCalledWith(['/login']);
  }));

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

  it('should call accountOverview and verify if router.navigate is called with "accountOverview"', () => {
    component.accountOverview();
    expect(this.navSpy).toHaveBeenCalledWith(['/accountOverview']);
  });
});
