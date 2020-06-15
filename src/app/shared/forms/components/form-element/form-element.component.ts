import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UUID } from 'angular2-uuid';

// tslint:disable-next-line: use-component-change-detection
@Component({ template: '' })
// tslint:disable-next-line: component-creation-test
export abstract class FormElementComponent {
  /**
   * Name of the corresponding form group (required)
   */
  @Input() form: FormGroup;
  /**
   * control name or an array of control names, corresponding controls with this name(s) should exist in the form group (required)
   */
  @Input() controlName: string | string[];
  /**
   * error messages for each validator of the control(s)
   */
  @Input() errorMessages: { [key: string]: string } | { [key: string]: string }[];
  /**
   * Label for the input/select field(s)
   */
  @Input() label: string;
  /**
    css-class for the label (default: 'col-md-4')
  */
  @Input() labelClass = 'col-md-4';
  /**
    css-class for the input/select field (default: 'col-md-8')
  */
  @Input() inputClass = 'col-md-8';
  /**
   * decides whether to show a required sign after the label
   * values: 'auto' (default) - label is marked, if an required validator is set
  /*         'on' (label is always marked as required),
  /*         'off' (label is never marked as required)
   */
  @Input() markRequiredLabel = 'auto';

  uuid: string;

  constructor(protected translate: TranslateService) {}

  init() {
    if (!this.form) {
      throw new Error('required input parameter <form> is missing for FormElementComponent');
    }
    if (!this.controlName) {
      throw new Error('required input parameter <controlName> is missing for FormElementComponent');
    }
    if (!this.formControl) {
      throw new Error(
        `input parameter <controlName> with value '${this.getControlName()}' does not exist in the given form for FormElementComponent`
      );
    }

    if (Array.isArray(this.controlName) && this.formControlArray.some(el => !el)) {
      throw new Error(
        `one of the input parameter <controlName> do not exist in the given form for FormElementComponent`
      );
    }

    this.uuid = UUID.UUID(); // uuid to make the id of the control unique
  }

  /**
   * get the form control according to the controlName or first element of the controlName array
   */
  get formControl(): AbstractControl {
    return this.form.get(this.getControlName());
  }

  /**
   * get an array of form controls if a controlName array is given
   */
  get formControlArray(): AbstractControl[] {
    const formControls: AbstractControl[] = [];
    Array.isArray(this.controlName)
      ? this.controlName.forEach(controlName => formControls.push(this.form.get(controlName)))
      : formControls.push(this.formControl);

    return formControls;
  }

  /** decides whether to show a required sign after the label in dependence of the markRequiredLabel
   * @returns true, if markRequiredLabel= 'on'
   * @returns false, if markRequiredLabel= 'off',
   * @returns whether the control is a required field and markRequiredLabel = 'auto'
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
        if (this.form.get(this.getControlName()).validator) {
          const validationResult = this.form.get(this.getControlName()).validator(formControl);
          required = !!validationResult && validationResult.required;
        }
        return required;
      }
    }
  }

  /**
   * get the form control according to the controlName or first element of the controlName array
   */
  getControlName(): string {
    return Array.isArray(this.controlName)
      ? this.controlName.length
        ? this.controlName[0]
        : undefined
      : this.controlName;
  }
}
