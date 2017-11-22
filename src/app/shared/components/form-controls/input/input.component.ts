import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'is-input',
  templateUrl: './input.component.html'
})
export class InputComponent implements OnInit {
  @Input() form: FormGroup;     // required
  @Input() controlName: string;  // required
  @Input() type: string;        // values: 'text' (default), 'password', 'email'
  @Input() errorMessages: any;
  @Input() formName: string;    // should be set, if the same form exists twice on one page in order to have unique ids, ToDo: is there any other possibility to get an id
  @Input() label: string;       // localization key or a string
  @Input() labelClass: string;  // default: 'col-sm-4'
  @Input() inputClass: string;  // default: 'col-sm-8'
  @Input() maxlength: string;   // default: 60
  @Input() autocomplete: string; /* values: 'on' (default for input type 'text' and 'email'),
                                           'off' (default for input type 'password') */
  @Input() markRequiredLabel: string; /* values: 'auto' (default) - label is marked, if an required validator is set
                                                 'on' (label is always marked as required),
                                                 'off' (label is never marked as required) */

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    if (!this.form) {
      throw new Error('required input parameter <form> is missing for InputComponent');
    }
    if (!this.controlName) {
      throw new Error('required input parameter <controlName> is missing for InputComponent');
    }
    // set default values for empty input parameters
    this.setDefaultValues();

    // determine / translate label
    this.determineLabel();

    // check type is valid
    const types = 'text|password|email';
    if (!types.includes(this.type)) {
      throw new Error('input parameter <type> is not valid for InputComponent, only text, email and password are possible types');
    }
  }

  /*
    set default values for empty input parameters
  */
  private setDefaultValues() {
    if (!this.type) { this.type = 'text'; }
    if (!this.formName) { this.formName = 'form'; }
    if (!this.labelClass) { this.labelClass = 'col-sm-4'; }
    if (!this.inputClass) { this.inputClass = 'col-sm-8'; }
    if (!this.maxlength) { this.maxlength = '60'; }
    if (!this.autocomplete) { this.autocomplete = (this.type === 'password' ? 'off' : ''); }
    if (!this.markRequiredLabel) { this.markRequiredLabel = 'auto'; }
  }

  /*
    determine label:
     label input = empty: label = control name
     label input = localization key: label = translation for this key
     else: label = unchanged input string
  */
  private determineLabel() {
    if (this.label) {
      this.translate.get(this.label).subscribe(data => {
        if (data) {
          this.label = data;
        }
      }).unsubscribe();
    } else {
      this.label = this.controlName;
    }
  }

  /*
    decides whether to show a required sign after the label in dependence of the markRequiredLabel
      returns true, if markRequiredLabel= 'on'
      returns false, if markRequiredLabel= 'off',
      returns whether the control is a required field and markRequiredLabel = 'auto'
  */
  get required(): boolean {
    switch (this.markRequiredLabel) {
      case 'on': {
        return true;
      }
      case 'off': {
        return false;
      }
      default: {
        // determine, if the control has the required attribute
        let required = false;
        const formControl = new FormControl();
        if (this.form.get(this.controlName).validator) {
          const validationResult = this.form.get(this.controlName).validator(formControl);
          required = (validationResult !== null && validationResult.required === true);
        }
        return required;
      }
    }
  }
}
