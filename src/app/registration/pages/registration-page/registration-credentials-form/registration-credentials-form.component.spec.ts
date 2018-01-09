import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, when } from 'ts-mockito';
import { USER_REGISTRATION_SUBSCRIBE_TO_NEWSLETTER } from '../../../../core/configurations/injection-keys';
import { InputComponent } from '../../../../shared/components/form-controls/input/input.component';
import { SelectSecurityQuestionComponent } from '../../../../shared/components/form-controls/select-security-question/select-security-question.component';
import { RegistrationCredentialsFormComponent } from './registration-credentials-form.component';

describe('Credentials Form Component', () => {
  let component: RegistrationCredentialsFormComponent;
  let fixture: ComponentFixture<RegistrationCredentialsFormComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const translateServiceMock = mock(TranslateService);
    when(translateServiceMock.get(anything())).thenCall((data) => {
      if (data === 'labelKey') {
        return Observable.of('LabelName');
      } else {
        return Observable.of(null);
      }
    });

    TestBed.configureTestingModule({
      declarations: [RegistrationCredentialsFormComponent, InputComponent, SelectSecurityQuestionComponent],
      providers: [
        { provide: USER_REGISTRATION_SUBSCRIBE_TO_NEWSLETTER, useValue: true },
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) },
        FormBuilder

      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(RegistrationCredentialsFormComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const parentForm = new FormGroup({});
        component.parentForm = parentForm;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should throw an error if input parameter parentForm is not set', () => {
    component.parentForm = null;
    expect(function() { fixture.detectChanges(); }).toThrow();
  });

  it('should create credentials form on creation', () => {
    expect(component.credentialsForm).toBeUndefined('credentials form has not been created before init');
    fixture.detectChanges();
    expect(component.credentialsForm.get('login')).toBeTruthy('credentials form contains a login control');
    expect(component.credentialsForm.get('loginConfirmation')).toBeTruthy('credentials form contains a loginConfirmation control');
    expect(component.credentialsForm.get('password')).toBeTruthy('credentials form contains a password control');
    expect(component.credentialsForm.get('passwordConfirmation')).toBeTruthy('credentials form contains a passwordConfirmation control');
    expect(component.credentialsForm.get('securityQuestion')).toBeTruthy('credentials form contains a securityQuestion control');
    expect(component.credentialsForm.get('securityQuestionAnswer')).toBeTruthy('credentials form contains a securityQuestionAnswer control');
    expect(component.credentialsForm.get('newsletter')).toBeTruthy('credentials form contains a newsletter control');
  });

  it('should display form input fields on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('input[data-testing-id=login]')).toBeTruthy('login is rendered');
    expect(element.querySelector('input[data-testing-id=loginConfirmation]')).toBeTruthy('loginConfirmation is rendered');
    expect(element.querySelector('input[data-testing-id=password]')).toBeTruthy('password is rendered');
    expect(element.querySelector('input[data-testing-id=passwordConfirmation]')).toBeTruthy('passwordConfirmation is rendered');
    expect(element.querySelector('select[data-testing-id=securityQuestion]')).toBeTruthy('securityQuestion is rendered');
    expect(element.querySelector('input[data-testing-id=securityQuestionAnswer]')).toBeTruthy('securityQuestionAnswer is rendered');
  });
});
