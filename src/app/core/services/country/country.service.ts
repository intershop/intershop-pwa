import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CountryMapper } from '../../models/country/country.mapper';
import { Country } from '../../models/country/country.model';
import { ApiService, unpackEnvelope } from '../api/api.service';

@Injectable({ providedIn: 'root' })
export class CountryService {
  constructor(private apiService: ApiService) {}

  // declare http header for Country API v1
  private countryHeadersV1 = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Accept', 'application/vnd.intershop.country.v1+json');

  /*
    gets the available countries
    @returns (Observable<Country[]>)
  */
  getCountries(): Observable<Country[]> {
    return this.apiService.get(`countries`, { headers: this.countryHeadersV1 }).pipe(
      unpackEnvelope('data'),
      map(countryItemsData => countryItemsData.map(CountryMapper.fromData))
    );
  }
}
