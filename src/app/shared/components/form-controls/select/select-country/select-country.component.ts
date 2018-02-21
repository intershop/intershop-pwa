import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Country } from '../../../../../models/country/country.model';
import { SelectOption } from '../../select/select-option.interface';
import { SelectComponent } from '../select.component';

@Component({
  selector: 'ish-select-country',
  templateUrl: '../select.component.html'
})
export class SelectCountryComponent extends SelectComponent implements OnChanges {

  @Input() countries: Country[];
  @Input() controlName = 'countryCode';
  @Input() label = 'Country';
  @Input() errorMessages = { required: 'account.address.country.error.default' };

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
