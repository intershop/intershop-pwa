import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ShowFormFeedbackDirective } from '../../directives/show-form-feedback.directive';
import { FormControlFeedbackComponent } from '../form-control-feedback/form-control-feedback.component';
import { InputComponent } from '../input/input.component';

import { LoginFormComponent } from './login-form.component';

describe('Login Form Component', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormControlFeedbackComponent, InputComponent, LoginFormComponent, ShowFormFeedbackDirective],
      imports: [IconModule, ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
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
    expect(element.querySelector('[data-testing-id=login]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=password]')).toBeTruthy();
    expect(element.querySelector('[name="login"]')).toBeTruthy();
  });

  describe('error display', () => {
    it('should not have any error when initialized', () => {
      fixture.detectChanges();
      expect(component.error).toBeFalsy();
      expect(element.querySelector('.alert-danger')).toBeFalsy();
    });

    describe('depending on loginType', () => {
      beforeEach(() => {
        component.error = { status: 401 } as HttpError;
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
