import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputComponent } from '../../../forms/shared/components/form-controls/input/input.component';
import { SelectSecurityQuestionComponent } from '../../../forms/shared/components/form-controls/select/select-security-question/select-security-question.component';
import { RegistrationCredentialsFormComponent } from './registration-credentials-form.component';

describe('Credentials Form Component', () => {
  let component: RegistrationCredentialsFormComponent;
  let fixture: ComponentFixture<RegistrationCredentialsFormComponent>;
  let element: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [RegistrationCredentialsFormComponent, InputComponent, SelectSecurityQuestionComponent],
        providers: [FormBuilder],
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
    })
  );

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw an error if input parameter parentForm is not set', () => {
    component.parentForm = null;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should display form input fields on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('input[data-testing-id=login]')).toBeTruthy('login is rendered');
    expect(element.querySelector('input[data-testing-id=loginConfirmation]')).toBeTruthy(
      'loginConfirmation is rendered'
    );
    expect(element.querySelector('input[data-testing-id=password]')).toBeTruthy('password is rendered');
    expect(element.querySelector('input[data-testing-id=passwordConfirmation]')).toBeTruthy(
      'passwordConfirmation is rendered'
    );
    expect(element.querySelector('select[data-testing-id=securityQuestion]')).toBeTruthy(
      'securityQuestion is rendered'
    );
    expect(element.querySelector('input[data-testing-id=securityQuestionAnswer]')).toBeTruthy('answer is rendered');
  });
});
