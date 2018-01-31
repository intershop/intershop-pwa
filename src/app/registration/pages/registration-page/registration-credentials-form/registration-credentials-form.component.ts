import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-registration-credentials-form',
  templateUrl: './registration-credentials-form.component.html'
})

export class RegistrationCredentialsFormComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() controlName: string;
  @Input() emailOptIn = false;

  ngOnInit() {
    if (!this.parentForm) {
      throw new Error('required input parameter <parentForm> is missing for CredentialsFormComponent');
    }
  }

  get credentialsForm(): FormGroup {
    return this.parentForm.get(this.controlName) as FormGroup;
  }

}
