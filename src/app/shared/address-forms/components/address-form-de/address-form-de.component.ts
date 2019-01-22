import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-address-form-de',
  templateUrl: './address-form-de.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AddressFormDEComponent implements OnInit {
  @Input() addressForm: FormGroup;
  @Input() titles: string[];

  ngOnInit() {
    if (!this.addressForm) {
      throw new Error('required input parameter <addressForm> is missing for AddressDEComponent');
    }
  }
}
