import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-address-form-fr',
  templateUrl: './address-form-fr.component.html'
})
export class AddressFormFRComponent implements OnInit {

  @Input() addressForm: FormGroup;
  @Input() titles: any[];

  ngOnInit() {
    if (!this.addressForm) {
      throw new Error('required input parameter <addressForm> is missing for AddressFRComponent');
    }
  }
}
