import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { USER_REGISTRATION_LOGIN_TYPE } from 'ish-core/configurations/injection-keys';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { LoginFormComponent } from './login-form.component';

describe('Login Form Component', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async(() => {
    accountFacade = mock(AccountFacade);

    TestBed.configureTestingModule({
      declarations: [LoginFormComponent, MockComponent(InputComponent)],
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: USER_REGISTRATION_LOGIN_TYPE, useValue: 'email' },
        {
          provide: AccountFacade,
          useFactory: () => instance(accountFacade),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render login form on Login page', () => {
    fixture.detectChanges();
    expect(element.querySelector('[controlname=login]')).toBeTruthy();
    expect(element.querySelector('[controlname=password]')).toBeTruthy();
    expect(element.querySelector('[name="login"]')).toBeTruthy();
  });

  describe('error display', () => {
    it('should not have any error when initialized', () => {
      fixture.detectChanges();
      expect(element.querySelector('.alert-danger')).toBeFalsy();
    });

    describe('depending on loginType', () => {
      beforeEach(() => {
        when(accountFacade.userError$).thenReturn(of(makeHttpError({ status: 401 })));
      });

      it('should display username error when error is set', () => {
        component.loginType = 'default';
        fixture.detectChanges();
        expect(element.querySelector('.alert-danger').textContent).toContain('user');
      });

      it('should display email error when error is set', () => {
        component.loginType = 'email';
        fixture.detectChanges();
        expect(element.querySelector('.alert-danger').textContent).toContain('email');
      });
    });
  });

  describe('email format', () => {
    beforeEach(() => {
      component.loginType = 'email';
      fixture.detectChanges();
    });

    it('should not detect error if email is well formed', () => {
      component.form.controls.login.setValue('test@test.com');
      expect(component.form.controls.login.valid).toBeTruthy();
    });

    it('should detect error if email is malformed', () => {
      component.form.controls.login.setValue('testtest.com');
      expect(component.form.controls.login.valid).toBeFalsy();
    });
  });
});
