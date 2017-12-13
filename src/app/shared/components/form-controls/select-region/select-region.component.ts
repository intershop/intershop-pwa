import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Region } from '../../../../models/region.model';
import { RegionService } from '../../../services/countries/region.service';
import { FormElement } from '../form-element';
import { SelectOption } from '../select/select-option.interface';

@Component({
  selector: 'is-select-region',
  templateUrl: './select-region.component.html',
  providers: [RegionService]
})
export class SelectRegionComponent extends FormElement implements OnChanges, OnInit {
  @Input() countryCode: string; // required: component will only be rendered if set

  states: SelectOption[];

  constructor(
    protected translate: TranslateService,
    private regionService: RegionService
  ) {
    super(translate);
  }

  /*
    onInit: set default values
  */
  ngOnInit() {
    this.setDefaultValues(); // call this method before parent init
    super.init();
  }

  /*
    refresh regions if country input changes
  */
  ngOnChanges(changes: SimpleChanges) {
    this.states = this.getStateOptions();
  }

  /*
    set default values for empty input parameters
  */
  private setDefaultValues() {
    this.controlName = this.controlName = 'state';
    this.label = this.label || 'State/Province';      // ToDo: Translation key
    this.errorMessages = this.errorMessages || { 'required': 'Please select a region' };  // ToDo: Translation key
  }

  /*
    get states for the given country
    returns: (SelectOption[]) States for the given country
  */
  private getStateOptions(): SelectOption[] {
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
