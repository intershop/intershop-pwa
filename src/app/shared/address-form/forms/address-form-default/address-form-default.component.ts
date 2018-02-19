import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Region } from '../../../../models/region/region.model';

@Component({
  selector: 'ish-address-form-default',
  templateUrl: './address-form-default.component.html'
})
export class AddressFormDefaultComponent implements OnInit {

  @Input() addressForm: FormGroup;
  @Input() regions: Region[];

  constructor() { }

  ngOnInit() {
    if (!this.addressForm) {
      throw new Error('required input parameter <addressForm> is missing for AddressDefaultComponent');
    }
  }

  get hasRegions(): boolean {
    return this.regions && !!this.regions.length;
  }

  // set required validator, state if country changes; will be removed by select-regions component if there is no state for this country
  // TODO
  /*this.addressForm.get('countryCode').valueChanges.subscribe(value => {
    if (this.addressForm.get('state') && this.addressForm.get('countryCode')) {
      this.addressForm.get('state').setValidators(Validators.required);
    }
  });*/


}
