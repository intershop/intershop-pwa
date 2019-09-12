import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Country } from 'ish-core/models/country/country.model';
import { SelectComponent, SelectOption } from 'ish-shared/forms/components/select/select.component';

@Component({
  selector: 'ish-select-country',
  templateUrl: '../select/select.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectCountryComponent extends SelectComponent implements OnChanges {
  @Input() countries: Country[];
  @Input() controlName = 'countryCode';
  @Input() label = 'account.address.country.label';
  @Input() errorMessages = { required: 'account.address.country.error.default' };

  ngOnChanges(c: SimpleChanges) {
    if (c.countries) {
      this.options = this.mapToOptions(this.countries);
    }
  }

  private mapToOptions(countries: Country[]): SelectOption[] {
    if (!countries) {
      return;
    }
    return countries.map(c => ({
      label: c.name,
      value: c.countryCode,
    }));
  }
}
