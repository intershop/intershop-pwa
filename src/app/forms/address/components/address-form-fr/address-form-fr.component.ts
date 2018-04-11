import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ish-address-form-fr',
  templateUrl: './address-form-fr.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormFRComponent implements OnInit {
  @Input() addressForm: FormGroup;
  @Input() titles: string[];

  ngOnInit() {
    if (!this.addressForm) {
      throw new Error('required input parameter <addressForm> is missing for AddressFRComponent');
    }
  }
}
