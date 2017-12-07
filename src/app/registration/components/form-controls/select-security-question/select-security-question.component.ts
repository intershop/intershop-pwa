import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormElement } from '../../../../shared/components/form-controls/form-element';
import { SelectOption } from '../../../../shared/components/form-controls/select/select.component';


@Component({
  selector: 'is-select-security-question',
  templateUrl: './select-security-question.component.html'
})
export class SelectSecurityQuestionComponent extends FormElement implements OnInit {

  /*
    constructor
  */
  constructor(
    protected translate: TranslateService
  ) { super(translate); }

  /*
    on Init
  */
  ngOnInit() {
    this.setDefaultValues(); // call this method before parent init
    super.init();
  }

  /*
    set default values for empty input parameters
  */
  private setDefaultValues() {
    this.controlName = this.controlName || 'securityQuestion';
    this.label = this.label || 'Security Question';      // ToDo: Translation key
    this.errorMessages = this.errorMessages || { 'required': 'Please select a security question' };  // ToDo: Translation key
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
