import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'is-registration-personal-form',
  templateUrl: './registration-personal-form.component.html'
})
export class RegistrationPersonalFormComponent implements OnInit {
  @Input() parentForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
