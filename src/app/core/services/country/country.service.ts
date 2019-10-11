import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CountryMapper } from 'ish-core/models/country/country.mapper';
import { Country } from 'ish-core/models/country/country.model';
import { RegionData } from 'ish-core/models/region/region.interface';
import { RegionMapper } from 'ish-core/models/region/region.mapper';
import { Region } from 'ish-core/models/region/region.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

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

  /*
    gets the available regions for requested country by countrycode
    @returns (Observable<Region[]>)
  */
  getRegionsByCountry(countryCode: string): Observable<Region[]> {
    return this.apiService
      .get<RegionData>(`countries/${countryCode}/main-divisions`, { headers: this.countryHeadersV1 })
      .pipe(
        unpackEnvelope<RegionData>('data'),
        map(regionData => regionData.map(regionItemData => RegionMapper.fromData(regionItemData, countryCode)))
      );
  }
}
