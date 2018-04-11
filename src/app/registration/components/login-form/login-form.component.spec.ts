import { HttpErrorResponse } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CustomFormsModule } from 'ng2-validation';
import { FormsSharedModule } from '../../../forms/forms-shared.module';
import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let element: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [LoginFormComponent],
        imports: [FormsSharedModule, TranslateModule.forRoot(), CustomFormsModule, RouterTestingModule],
      }).compileComponents();
    })
  );

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
    expect(element.querySelector('input[data-testing-id=userName]')).toBeTruthy();
    expect(element.querySelector('input[data-testing-id=password]')).toBeTruthy();
    expect(element.getElementsByClassName('btn btn-primary')).toBeTruthy();
  });

  describe('error display', () => {
    it('should not have any error when initialized', () => {
      fixture.detectChanges();
      expect(component.error).toBeFalsy();
      expect(element.querySelector('.alert-danger')).toBeFalsy();
    });

    it('should display error when error is set', () => {
      component.error = new HttpErrorResponse({ status: 401 });
      fixture.detectChanges();
      expect(component.error).toBeTruthy();
      expect(element.querySelector('.alert-danger')).toBeTruthy();
    });
  });

  describe('email format', () => {
    beforeEach(() => {
      component.loginType = 'email';
      fixture.detectChanges();
    });

    it('should not detect error if email is well formed', () => {
      component.form.controls['userName'].setValue('test@test.com');
      expect(component.form.controls['userName'].valid).toBeTruthy();
    });

    it('should detect error if email is malformed', () => {
      component.form.controls['userName'].setValue('testtest.com');
      expect(component.form.controls['userName'].valid).toBeFalsy();
    });
  });
});
