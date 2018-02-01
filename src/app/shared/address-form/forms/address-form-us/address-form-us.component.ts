import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Region } from '../../../../models/region/region.model';

@Component({
  selector: 'ish-address-form-us',
  templateUrl: './address-form-us.component.html'
})
export class AddressFormUSComponent implements OnInit {

  @Input() addressForm: FormGroup;
  @Input() countryCode: string;
  @Input() regions: Region[];

  ngOnInit() {
    if (!this.addressForm) {
      throw new Error('required input parameter <addressForm> is missing for AddressUSComponent');
    }
  }
}
