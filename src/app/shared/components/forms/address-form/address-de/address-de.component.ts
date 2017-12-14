import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ish-address-de',
  templateUrl: './address-de.component.html'
})
export class AddressDEComponent implements OnInit, OnDestroy {

  @Input() addressForm: FormGroup;

  constructor() { }

  // add additional form controls and validators
  ngOnInit() {
    this.addressForm.addControl('title', new FormControl(''));
    this.addressForm.addControl('addressLine3', new FormControl(''));

    this.addressForm.get('postalCode').setValidators([Validators.required, Validators.pattern('[0-9]{5}')]);
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
