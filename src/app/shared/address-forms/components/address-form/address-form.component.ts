import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Country } from 'ish-core/models/country/country.model';
import { Region } from 'ish-core/models/region/region.model';

@Component({
  selector: 'ish-address-form',
  templateUrl: './address-form.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AddressFormComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() controlName = 'address';
  @Input() countryCode: string;
  @Input() countries: Country[];
  @Input() regions: Region[];
  @Input() titles: string[];

  ngOnInit() {
    if (!this.parentForm) {
      throw new Error('required input parameter <parentForm> is missing for AddressFormComponent');
    }
  }

  get addressForm(): FormGroup {
    return this.parentForm.get(this.controlName) as FormGroup;
  }
}
