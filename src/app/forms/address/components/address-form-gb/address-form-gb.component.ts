import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-address-form-gb',
  templateUrl: './address-form-gb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormGBComponent implements OnInit {

  @Input() addressForm: FormGroup;
  @Input() titles: string[];

  ngOnInit() {
    if (!this.addressForm) {
      throw new Error('required input parameter <addressForm> is missing for AddressDEComponent');
    }
  }
}
