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
  }

  ngOnDestroy() {
    // remove additional form controls and validators
    this.addressForm.removeControl('state');

    this.addressForm.get('postalCode').clearValidators();
  }

  /*
    get countryCode value for regions display
    set required validator, state if country changes; will be removed by select-regions component if there is no state for this country
  */
  get countryCode(): string {
    if (this.addressForm.get('state')) {
      this.addressForm.get('state').setValidators(Validators.required);
    }
    return this.addressForm.get('countryCode').value;
  }
}
