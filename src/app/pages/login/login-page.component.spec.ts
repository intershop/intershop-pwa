import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { IdentityProviderLoginComponent } from 'ish-shared/components/login/identity-provider-login/identity-provider-login.component';

import { LoginPageComponent } from './login-page.component';

describe('Login Page Component', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let component: LoginPageComponent;
  let element: HTMLElement;
  let accountFacade: AccountFacade;
  let appFacade: AppFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    appFacade = mock(AppFacade);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [LoginPageComponent, MockComponent(IdentityProviderLoginComponent)],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    when(appFacade.routingInProgress$).thenReturn(of(false));
    when(accountFacade.isLoggedIn$).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render login form on Login page', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-identity-provider-login",
      ]
    `);
  });
});
