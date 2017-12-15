import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ish-address-gb',
  templateUrl: './address-gb.component.html'
})
export class AddressGBComponent implements OnInit, OnDestroy {
  @Input() addressForm: FormGroup;

  constructor() { }

  // add additional form controls and validators
  ngOnInit() {
    this.addressForm.addControl('title', new FormControl(''));
    this.addressForm.addControl('addressLine3', new FormControl(''));

    this.addressForm.get('postalCode').setValidators([Validators.required, Validators.pattern('^(GIR ?0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]([0-9ABEHMNPRV-Y])?)|[0-9][A-HJKPS-UW]) ?[0-9][ABD-HJLNP-UW-Z]{2})$')]);
  }

  // remove additional form controls and validators
  ngOnDestroy() {
    this.addressForm.removeControl('title');
    this.addressForm.removeControl('addressLine3');

    this.addressForm.get('postalCode').clearValidators();
  }

  // get countryCode value for title display
  get countryCode(): string { return this.addressForm.get('countryCode').value; }
}
