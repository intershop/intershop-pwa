import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'is-address-default',
  templateUrl: './address-default.component.html'
})
export class AddressDefaultComponent implements OnInit, OnDestroy {
  @Input() addressForm: FormGroup;

  constructor() { }

  ngOnInit() {
    // add additional form controls and validators
    this.addressForm.addControl('state', new FormControl(''));

    this.addressForm.get('postalCode').setValidators(Validators.required);

    // set state as required, if there is are regions for this country the region select component will remove the required validator
    this.addressForm.get('countryCode').valueChanges.subscribe(value => {
      this.addressForm.get('state').reset();
      this.addressForm.get('state').setValue('');
      this.addressForm.get('state').setValidators(Validators.required);
    });
  }

  ngOnDestroy() {
    // remove additional form controls and validators
    this.addressForm.removeControl('state');

    this.addressForm.get('postalCode').clearValidators();
  }

  // get countryCode value for regions display
  get countryCode(): string { return this.addressForm.get('countryCode').value; }
}
