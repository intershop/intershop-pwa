import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { LoginFormComponent } from './login-form.component';

describe('Login Form Component', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);

    await TestBed.configureTestingModule({
      declarations: [LoginFormComponent, MockComponent(ErrorMessageComponent), MockComponent(InputComponent)],
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: AccountFacade,
          useFactory: () => instance(accountFacade),
        },
      ],
    }).compileComponents();
  });

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
