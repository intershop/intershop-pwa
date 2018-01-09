import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ish-address-fr',
  templateUrl: './address-fr.component.html'
})
export class AddressFRComponent implements OnInit, OnDestroy {
  @Input() addressForm: FormGroup;

  constructor() { }

  // add additional form controls and validators
  ngOnInit() {
    if (!this.addressForm) {
      throw new Error('required input parameter <addressForm> is missing for AddressFRComponent');
    }
    if (!this.addressForm.get('postalCode')) {
      throw new Error('required form control <postalCode> is missing for addressForm of AddressFRComponent');
    }
    this.addressForm.addControl('title', new FormControl(''));

    this.addressForm.get('postalCode').setValidators([Validators.required, Validators.pattern('[0-9]{5}')]);
  }

  // remove additional form controls and validators
  ngOnDestroy() {
    if (this.addressForm) {
      this.addressForm.removeControl('title');

      this.addressForm.get('postalCode').clearValidators();
    }
  }

  // get countryCode value for title display
  get countryCode(): string { return this.addressForm.get('countryCode').value; }
}
