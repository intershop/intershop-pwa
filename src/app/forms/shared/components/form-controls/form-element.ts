import { Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UUID } from 'angular2-uuid';

export class FormElement {
  @Input() form: FormGroup;             // required
  @Input() controlName: string;         // required
  @Input() errorMessages: { [key: string]: string };
  @Input() label: string;               // localization key or a string
  @Input() labelClass = 'col-sm-4';
  @Input() inputClass = 'col-sm-8';
  @Input() markRequiredLabel = 'auto';  /* values: 'auto' (default) - label is marked, if an required validator is set
                                                  'on' (label is always marked as required),
                                                  'off' (label is never marked as required) */
  uuid: string;

  constructor(
    protected translate: TranslateService
  ) { }

  init() {
    if (!this.form) {
      throw new Error('required input parameter <form> is missing for FormElementComponent');
    }
    if (!this.controlName) {
      throw new Error('required input parameter <controlName> is missing for FormElementComponent');
    }
    if (!this.formControl) {
      throw new Error(`input parameter <controlName> with value '${this.controlName}' does not exist in the given form for FormElementComponent`);
    }
    this.uuid = UUID.UUID(); // uuid to make the id of the control unique
  }

  get formControl(): AbstractControl {
    return this.form.get(this.controlName);
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
