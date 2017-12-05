import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Country } from '../../../../models/country.model';
import { CountryService } from '../../../services/countries/country.service';
import { FormElement } from '../form-element';
import { SelectOption } from '../select/select.component';

@Component({
  selector: 'is-select-country',
  templateUrl: './select-country.component.html',
  providers: [CountryService]
})
export class SelectCountryComponent extends FormElement implements OnInit {

  constructor(
    protected translate: TranslateService,
    private countryService: CountryService
  ) {
    super(translate);
  }

  ngOnInit() {
    this.setDefaultValues(); // call this method before parent init
    super.init();
  }

  /*
    set default values for empty input parameters
  */
  private setDefaultValues() {
    this.controlName = this.controlName || 'country';
    this.label = this.label || 'Country';      // ToDo: Translation key
    this.errorMessages = this.errorMessages || { 'required': 'Please select a country' };  // ToDo: Translation key
  }

  // get countries
  get countries(): SelectOption[] {
    let options: SelectOption[] = [];
    const countries = this.countryService.getCountries();
    if (countries && countries.length) {

      // Map region array to an array of type SelectOption
      options = countries.map((country: Country) => {
        return {
          'label': country.name,
          'value': country.countryCode
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
