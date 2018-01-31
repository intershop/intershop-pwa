import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Country } from '../../../../models/country/country.model';
import { SelectOption } from '../select/select-option.interface';

@Component({
  selector: 'ish-select-country',
  templateUrl: './select-country.component.html'
})
export class SelectCountryComponent implements OnChanges {

  @Input() form: FormGroup;
  @Input() countries: Country[];
  @Input() controlName = 'countryCode';
  @Input() label = 'Country';
  @Input() errorMessages = { required: 'Please select a country' };  // ToDo: Translation key

  options: SelectOption[] = [];

  ngOnChanges(c: SimpleChanges) {
    if (c.countries) {
      this.options = this.mapToOptions(this.countries);
    }
  }

  private mapToOptions(countries: Country[]): SelectOption[] {
    if (!countries) { return; }
    return countries.map(c => ({
      label: c.name,
      value: c.countryCode
    } as SelectOption));
  }
}
