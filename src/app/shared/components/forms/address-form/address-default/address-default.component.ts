import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ish-address-default',
  templateUrl: './address-default.component.html'
})
export class AddressDefaultComponent implements OnInit, OnDestroy {
  @Input() addressForm: FormGroup;

  constructor() { }

  ngOnInit() {
    if (!this.addressForm) {
      throw new Error('required input parameter <addressForm> is missing for AddressDefaultComponent');
    }
    if (!this.addressForm.get('postalCode')) {
      throw new Error('required form control <postalCode> is missing for addressForm of AddressDefaultComponent');
    }
    // add additional form controls and validators
    this.addressForm.addControl('state', new FormControl('', Validators.required));

    this.addressForm.get('postalCode').setValidators(Validators.required);

    // set required validator, state if country changes; will be removed by select-regions component if there is no state for this country
    this.addressForm.get('countryCode').valueChanges.subscribe(value => {
      if (this.addressForm.get('state') && this.addressForm.get('countryCode')) {
        this.addressForm.get('state').setValidators(Validators.required);
      }
    });
  }

  ngOnDestroy() {
    if (this.addressForm) {
      // remove additional form controls and validators
      this.addressForm.removeControl('state');

      this.addressForm.get('postalCode').clearValidators();
    }
  }

  /*
    get countryCode value for regions display
  */
  get countryCode(): string {
    return this.addressForm.get('countryCode').value;
  }
}
