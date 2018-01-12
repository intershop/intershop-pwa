import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ish-address-us',
  templateUrl: './address-us.component.html'
})
export class AddressUSComponent implements OnInit, OnDestroy {
  @Input() addressForm: FormGroup;

  constructor() { }

  // add additional form controls and validators
  ngOnInit() {
    if (!this.addressForm) {
      throw new Error('required input parameter <addressForm> is missing for AddressUSComponent');
    }
    if (!this.addressForm.get('postalCode')) {
      throw new Error('required form control <postalCode> is missing for addressForm of AddressUSComponent');
    }
    this.addressForm.addControl('state', new FormControl('', [Validators.required]));

    this.addressForm.get('postalCode').setValidators([Validators.required, Validators.pattern('^[0-9]{5}$|^[0-9]{5}-[0-9]{4}$')]);
  }

  // remove additional form controls and validators
  ngOnDestroy() {
    if (this.addressForm) {
      this.addressForm.removeControl('state');

      this.addressForm.get('postalCode').clearValidators();
    }
  }

  // get countryCode value for regions display
  get countryCode(): string { return this.addressForm.get('countryCode').value; }
}
