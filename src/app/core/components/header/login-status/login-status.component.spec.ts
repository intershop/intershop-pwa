import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { anyFunction, instance, mock, when } from 'ts-mockito';
import { Customer } from '../../../../models/customer/customer.model';
import { AccountLoginService } from '../../../services/account-login/account-login.service';
import { LoginStatusComponent } from './login-status.component';

describe('Login Status Component', () => {
  let fixture: ComponentFixture<LoginStatusComponent>;
  let component: LoginStatusComponent;
  let element: HTMLElement;
  let accountLoginServiceMock: AccountLoginService;
  let routerMock: Router;
  const userData = {
    'firstName': 'Patricia',
    'lastName': 'Miller'
  };

  beforeEach(() => {
    accountLoginServiceMock = mock(AccountLoginService);
    when(accountLoginServiceMock.isAuthorized()).thenReturn(true);
    when(accountLoginServiceMock.subscribe(anyFunction())).thenCall((callback: (d: Customer) => void) => callback(userData as Customer));


    routerMock = mock(Router);

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [
        LoginStatusComponent
      ],
      providers: [
        { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) },
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

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should set isLogged to true and set userDetail when user is authorized', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component.isLoggedIn).toBeTruthy();
    expect(component.userDetail).toBeTruthy();
  }));

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
