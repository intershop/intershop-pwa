import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Region } from '../../../models/region/region.model';

@Injectable({ providedIn: 'root' })
export class RegionService {
  regionDataUS$: Observable<Region[]>;
  regionDataBG$: Observable<Region[]>;
  /*
    ToDo: get Regions via REST, result should be locale dependent
  */
  constructor() {
    this.regionDataUS$ = of([
      { countryCode: 'US', regionCode: 'AL', name: 'Alabama' },
      { countryCode: 'US', regionCode: 'FL', name: 'Florida' },
      { countryCode: 'US', regionCode: 'IN', name: 'Indiana' },
      { countryCode: 'US', regionCode: 'MN', name: 'Michigan' },
      { countryCode: 'US', regionCode: 'NY', name: 'New York' },
      { countryCode: 'US', regionCode: 'TX', name: 'Texas' },
    ]);
    this.regionDataBG$ = of([
      { countryCode: 'BG', regionCode: '02', name: 'Burgas' },
      { countryCode: 'BG', regionCode: '23', name: 'Sofia' },
      { countryCode: 'BG', regionCode: '03', name: 'Varna' },
    ]);
  }

  /*
    gets all regions of country
    @params (String) country code
    @returns (Observable<Region>) Observable of regions
  */
  getRegions(countryCode: string): Observable<Region[]> {
    switch (countryCode) {
      case 'US': {
        return this.regionDataUS$;
      }
      case 'BG': {
        return this.regionDataBG$;
      }
      default: {
        return;
      }
    }
  }
}
