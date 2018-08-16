import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Country } from '../../../models/country/country.model';

@Injectable({ providedIn: 'root' })
export class CountryService {
  countries$: Observable<Country[]>;

  /*
    ToDo: get Countries via REST, result should be locale dependent
  */
  constructor() {
    this.countries$ = of([
      { countryCode: 'BG', name: 'Bulgaria' },
      { countryCode: 'DE', name: 'Germany' },
      { countryCode: 'FR', name: 'France' },
      { countryCode: 'IN', name: 'India' },
      { countryCode: 'GB', name: 'United Kingdom' },
      { countryCode: 'US', name: 'United States' },
    ]).pipe(delay(500));
  }

  /*
    gets the available countries
    @returns (Observable<Country[]>)
  */
  getCountries(): Observable<Country[]> {
    return this.countries$;
  }
}
