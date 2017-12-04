import { Injectable } from '@angular/core';
import { Country } from '../../../models/country.model';

@Injectable()
export class CountryService {
  COUNTRIES: Country[];

  /*
    ToDo: get Countries via REST, result should be locale dependent
  */
  constructor() {
    this.COUNTRIES = [
      { countryCode: 'BG', name: 'Bulgaria' },
      { countryCode: 'DE', name: 'Germany' },
      { countryCode: 'FR', name: 'France' },
      { countryCode: 'IN', name: 'India' },
      { countryCode: 'GB', name: 'United Kingdom' },
      { countryCode: 'US', name: 'United States' },
    ];
  }

  /*
    gets the available countries
    @returns (Country []), ToDo: should be an observable
  */
  getCountries(): Country[] {
    return this.COUNTRIES;
  }
}
