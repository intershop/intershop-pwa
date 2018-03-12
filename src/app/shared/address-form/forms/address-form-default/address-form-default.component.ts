import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Region } from '../../../../models/region/region.model';

@Component({
  selector: 'ish-address-form-default',
  templateUrl: './address-form-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
}
