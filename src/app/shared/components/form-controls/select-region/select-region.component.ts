import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Region } from '../../../../models/region.model';
import { RegionService } from '../../../../services/countries/region.service';
import { FormElementComponent } from '../form-element/form-element.component';
import { SelectOption } from '../select/select.component';

@Component({
  selector: 'is-select-region',
  templateUrl: './select-region.component.html',
  providers: [RegionService]
})
export class SelectRegionComponent extends FormElementComponent implements OnInit {
  @Input() countryCode: string; // required: component will only be rendered if set

  constructor(
    protected translate: TranslateService,
    private regionService: RegionService
  ) { super(translate); }

  ngOnInit() {
    this.setDefaultValues(); // call this method before parent ngOnInit

    // tslint:disable-next-line:ban
    super.ngOnInit();
  }

  /*
    set default values for empty input parameters
  */
  protected setDefaultValues() {
    if (!this.controlName) { this.controlName = 'state'; }
    if (!this.label) { this.label = 'State/Province'; }     // ToDo: Translation key
    if (!this.errorMessages) {
      this.errorMessages = { 'required': 'Please select a region' };  // ToDo: Translation key
    }
  }

  // get states for the given country
  get states(): SelectOption[] {
    let options: SelectOption[] = [];
    const regions = this.regionService.getRegions(this.countryCode);
    if (regions && regions.length) {

      // Map region array to an array of type SelectOption
      options = regions.map((region: Region) => {
        return {
          'label': region.name,
          'value': region.regionCode
        };
      });
    } else {
      this.form.get('state').clearValidators();
      this.form.get('state').reset();
      this.form.get('state').setValue('');
    }
    return options;
  }
}
