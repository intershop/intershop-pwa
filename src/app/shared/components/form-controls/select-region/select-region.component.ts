import { Component, Input, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { Region } from '../../../../models/region';
import { RegionService } from '../../../../services/countries/region.service';
import { SelectOption } from '../select/select.component';

@Component({
  selector: 'is-select-region',
  templateUrl: './select-region.component.html',
  providers: [RegionService]
})
export class SelectRegionComponent implements OnInit {
  @Input() form: FormGroup;   // required
  @Input() countryCode: string; // required: component will only be rendered if set
  @Input() controlName: string;
  @Input() formName: string;
  @Input() label: string;
  @Input() labelClass: string;  // default: 'col-sm-4'
  @Input() inputClass: string;  // default: 'col-sm-8'
  @Input() markRequiredLabel: string; /* values: 'auto' (default) - label is marked, if an required validator is set
                                                 'on' (label is always marked as required),
                                                 'off' (label is never marked as required) */

  constructor(private regionService: RegionService) { }

  ngOnInit() {
    if (!this.form) {
      throw new Error('required input parameter <form> is missing for SelectRegionComponent');
    }

    this.setDefaultValues();
  }

  /*
    set default values for empty input parameters
  */
  private setDefaultValues() {
    if (!this.controlName) { this.controlName = 'state'; }
    if (!this.label) { this.label = 'State/Province'; }     // ToDo: Translation key
  }

  // get states for the country of the address form
  get states(): SelectOption[] {
    let options: SelectOption[] = [];
    const regions = this.regionService.getRegions(this.countryCode);
    if (regions) {

      // Map region array to an array of type SelectOption
      options = regions.map((region: Region) => {
        return {
          'label': region.name,
          'value': region.regionCode
        };
      });
    } else {
      this.form.get('state').clearValidators();
    }
    return options;
  }
}
