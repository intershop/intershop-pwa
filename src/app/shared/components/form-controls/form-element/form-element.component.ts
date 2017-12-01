import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  template: ``
})
export class FormElementComponent implements OnInit {
  @Input() form: FormGroup;     // required
  @Input() controlName: string;  // required
  @Input() errorMessages: any;
  @Input() label: string;       // localization key or a string
  @Input() labelClass: string;  // default: 'col-sm-4'
  @Input() inputClass: string;  // default: 'col-sm-8'
  @Input() formName: string;    // should be set, if the same form exists twice on one page in order to have unique ids, ToDo: is there any other possibility to get an id
  @Input() markRequiredLabel: string; /* values: 'auto' (default) - label is marked, if an required validator is set
                                                  'on' (label is always marked as required),
                                                  'off' (label is never marked as required) */

  constructor(
    protected translate: TranslateService
  ) { }

  ngOnInit() {
    if (!this.form) {
      throw new Error('required input parameter <form> is missing for FormElementComponent');
    }
    if (!this.controlName) {
      throw new Error('required input parameter <controlName> is missing for FormElementComponent');
    }
  }

  /*
   set default values for empty input parameters
 */
  protected setDefaultValues() {
    if (!this.formName) { this.formName = 'form'; }
    if (!this.labelClass) { this.labelClass = 'col-sm-4'; }
    if (!this.inputClass) { this.inputClass = 'col-sm-8'; }
    if (!this.markRequiredLabel) { this.markRequiredLabel = 'auto'; }
  }

  /*
    determine label:
     label input = empty: label = control name
     label input = localization key: label = translation for this key
     else: label = unchanged input string
  */
  protected determineLabel() {
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
