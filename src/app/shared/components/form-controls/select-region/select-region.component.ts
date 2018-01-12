import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Region } from '../../../../models/region/region.model';
import { RegionService } from '../../../services/countries/region.service';
import { SelectOption } from '../select/select-option.interface';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'ish-select-region',
  templateUrl: '../select/select.component.html'
})
export class SelectRegionComponent extends SelectComponent implements OnChanges, OnInit {
  @Input() countryCode: string;                     // required: component will only be rendered if set

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
    if (!this.countryCode) {
      throw new Error('required input parameter <countryCode> is missing for SelectRegionComponent');
    }
    this.setDefaultValues(); // call this method before parent init
    super.componentInit();
    this.options = this.getStateOptions();
  }

  /*
    refresh regions if country input changes
  */
  ngOnChanges(changes: SimpleChanges) {
    this.options = this.getStateOptions();
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
  public getStateOptions(): SelectOption[] {
    const options: SelectOption[] = [];
    const regions$ = this.regionService.getRegions(this.countryCode);
    if (regions$) {
      // Map region array to an array of type SelectOption
      regions$.map((region: Region) => {
        return {
          'label': region.name,
          'value': region.regionCode
        } as SelectOption;
      }).subscribe(option => options.push(option));
      if (options.length === 0) {
        this.form.get('state').clearValidators();
        this.form.get('state').reset();
        this.form.get('state').setValue('');
      }
    } else {
      this.form.get('state').clearValidators();
      this.form.get('state').reset();
      this.form.get('state').setValue('');
    }
    return options;
  }
}
