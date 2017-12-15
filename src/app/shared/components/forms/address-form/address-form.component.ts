import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpecialValidators } from '../../../../shared/validators/special-validators';

@Component({
  selector: 'ish-address-form',
  templateUrl: './address-form.component.html'
})
export class AddressFormComponent implements OnInit {
  @Input() parentForm: FormGroup;
  addressForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }

  /*
    create address form group with all controls which are needed on all country specific sub address forms
  */
  private createForm() {
    this.addressForm = this.fb.group({
      countryCode: ['', [Validators.required]],
      firstName: ['', [Validators.required, SpecialValidators.noSpecialChars]],
      lastName: ['', [Validators.required, SpecialValidators.noSpecialChars]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      postalCode: [''],
      city: ['', [Validators.required]],
      phoneHome: ['']
    });

    // add address form group to the given parent form
    this.parentForm.addControl('address', this.addressForm);
  }

  // get countryCode for showing a country dependent sub address form component
  get countryCode() { return this.addressForm.get('countryCode'); }
}
