import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-registration-personal-form',
  templateUrl: './registration-personal-form.component.html'
})
export class RegistrationPersonalFormComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() languages: any[]; // TODO: insert type

  constructor() { }

  ngOnInit() {
    if (!this.parentForm) {
      throw new Error('required input parameter <parentForm> is missing for RegistrationPersonalFormComponent');
    }
    if (!this.parentForm.get('preferredLanguage')) {
      throw new Error('required form control <preferredLanguage> is missing for parentForm of RegistrationPersonalFormComponent');
    }
    if (!this.parentForm.get('birthday')) {
      throw new Error('required form control <birthday> is missing for parentForm of RegistrationPersonalFormComponent');
    }
  }

}
