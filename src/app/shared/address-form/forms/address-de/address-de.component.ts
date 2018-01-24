import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-address-de',
  templateUrl: './address-de.component.html'
})
export class AddressDEComponent implements OnInit {

  @Input() addressForm: FormGroup;
  @Input() countryCode: string;

  ngOnInit() {
    if (!this.addressForm) {
      throw new Error('required input parameter <addressForm> is missing for AddressDEComponent');
    }
  }
}
