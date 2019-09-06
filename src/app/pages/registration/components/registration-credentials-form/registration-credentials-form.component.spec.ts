import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { InputComponent } from '../../../../shared/forms/components/input/input.component';
import { SelectSecurityQuestionComponent } from '../../../../shared/forms/components/select-security-question/select-security-question.component';

import { RegistrationCredentialsFormComponent } from './registration-credentials-form.component';

describe('Registration Credentials Form Component', () => {
  let component: RegistrationCredentialsFormComponent;
  let fixture: ComponentFixture<RegistrationCredentialsFormComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputComponent, RegistrationCredentialsFormComponent, SelectSecurityQuestionComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(RegistrationCredentialsFormComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const parentForm = new FormGroup({});
        const credentialsForm = new FormGroup({
          login: new FormControl(''),
          loginConfirmation: new FormControl(''),
          password: new FormControl(''),
          passwordConfirmation: new FormControl(''),
          securityQuestion: new FormControl(''),
          securityQuestionAnswer: new FormControl(''),
          newsletter: new FormControl(''),
        });
        parentForm.addControl('credentials', credentialsForm);
        component.parentForm = parentForm;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw an error if input parameter parentForm is not set', () => {
    component.parentForm = undefined;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should display form input fields on creation', () => {
    component.securityQuestionEnabled = true;
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=login]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=loginConfirmation]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=password]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=passwordConfirmation]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=securityQuestion]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=securityQuestionAnswer]')).toBeTruthy();
  });
});
