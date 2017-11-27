import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'is-address-us',
  templateUrl: './address-us.component.html'
})
export class AddressUsComponent implements OnInit, OnDestroy {
  @Input() addressForm: FormGroup;

  constructor() { }

  // add additional form controls and validators
  ngOnInit() {
    this.addressForm.addControl('state', new FormControl('', [Validators.required]));

    this.addressForm.get('postalCode').setValidators([Validators.required, Validators.pattern('^[0-9]{5}$|^[0-9]{5}-[0-9]{4}$')]);
  }

  // remove additional form controls and validators
  ngOnDestroy() {
    this.addressForm.removeControl('state');

    this.addressForm.get('postalCode').clearValidators();
  }

  // get countryCode value for regions display
  get countryCode(): string { return this.addressForm.get('countryCode').value; }
}
