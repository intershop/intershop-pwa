import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SelectOption } from '../select/select-option.interface';
import { SelectComponent } from '../select/select.component';


@Component({
  selector: 'ish-select-security-question',
  templateUrl: '../select/select.component.html'
})
export class SelectSecurityQuestionComponent extends SelectComponent implements OnInit {

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
    super.componentInit();
    this.options = this.options || this.getSecurityQuestionOptions();
  }

  /*
    set default values for empty input parameters
  */
  private setDefaultValues() {
    this.controlName = this.controlName || 'securityQuestion';
    this.label = this.label || 'account.security_question.label';
    this.errorMessages = this.errorMessages || { 'required': 'account.security_question.error.required' };

  }

  /*
    get security questions
    returns (SelectOption[]) - security question options
  */
  private getSecurityQuestionOptions(): SelectOption[] {
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
  private getSecurityQuestions() {
    return [
      'account.security_question.maiden_name.text',
      'account.security_question.pet_name.text',
      'account.security_question.street_name.text',
      'account.security_question.elementary_school.text',
      'account.security_question.first_employer.text'
    ];
  }
}
