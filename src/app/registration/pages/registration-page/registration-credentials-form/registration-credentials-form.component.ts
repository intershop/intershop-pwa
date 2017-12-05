import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { SelectOption } from '../../../../shared/components/form-controls/select/select.component';
// import { GlobalConfiguration } from '../../../../core/configurations/global.configuration';
import { SpecialValidators } from '../../../../shared/validators/special-validators';

@Component({
  selector: 'is-registration-credentials-form',
  templateUrl: './registration-credentials-form.component.html'
})

export class RegistrationCredentialsFormComponent implements OnInit {
  @Input() parentForm: FormGroup;
  credentialsForm: FormGroup;
  emailOptIn = false;

  constructor(
    private fb: FormBuilder,                    // <--- inject FormBuilder
    // private globalConfig: GlobalConfiguration
  ) {
  }

  ngOnInit() {
    // this.emailOptIn = this.globalConfig.getAccountSettings().emailOptIn;

    this.emailOptIn = true;
    this.createForm();
  }

  // create the credentials form and add it to the parent form
  createForm() {
    const formGroup = {
      login: ['', [Validators.required, Validators.email]],
      loginConfirmation: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, SpecialValidators.password]],
      passwordConfirmation: ['', [Validators.required, SpecialValidators.password]],
      securityQuestion: ['', [Validators.required]],
      securityQuestionAnswer: ['', [Validators.required]]
    };
    if (this.emailOptIn) {
      formGroup['newsletter'] = [true];
    }
    this.credentialsForm = this.fb.group(formGroup);

    this.credentialsForm.get('loginConfirmation').setValidators(CustomValidators.equalTo(this.credentialsForm.get('login')));
    this.credentialsForm.get('passwordConfirmation').setValidators(CustomValidators.equalTo(this.credentialsForm.get('password')));

    // add newsletter check only if emailOptin = true
    this.parentForm.addControl('credentials', this.credentialsForm);
  }

  // get security questions
  get securityQuestionOptions(): SelectOption[] {
    let options: SelectOption[] = [];
    const securityQuestions = this.getSecurityQuestions();

    if (securityQuestions) {
      // Map title array to an array of type SelectOption
      options = securityQuestions.map(question => {
        return {
          'label': question,
          'value': question
        };
      });
    }
    return options;
  }

  // define which security questions are shown - ToDo: should be done in a service
  getSecurityQuestions() {
    return [
      'account.security_question.maiden_name.text',
      'account.security_question.pet_name.text',
      'account.security_question.street_name.text',
      'account.security_question.elementary_school.text',
      'account.security_question.first_employer.text'
    ];
  }
}
