import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RegionFactory } from '../../../models/region/region.factory';
import { RegionData } from '../../../models/region/region.interface';
import { Region } from '../../../models/region/region.model';

@Injectable()
export class RegionService {

  regionDataUS$: Observable<RegionData>;
  regionDataBG$: Observable<RegionData>;
  /*
    ToDo: get Regions via REST, result should be locale dependent
  */
  constructor() {
    this.regionDataUS$ = Observable.of(
      { countryCode: 'US', regionCode: 'AL', name: 'Alabama' } as RegionData,
      { countryCode: 'US', regionCode: 'FL', name: 'Florida' } as RegionData,
      { countryCode: 'US', regionCode: 'IN', name: 'Indiana' } as RegionData,
      { countryCode: 'US', regionCode: 'MN', name: 'Michigan' } as RegionData,
      { countryCode: 'US', regionCode: 'NY', name: 'New York' } as RegionData,
      { countryCode: 'US', regionCode: 'TX', name: 'Texas' } as RegionData
    );
    this.regionDataBG$ = Observable.of(
      { countryCode: 'BG', regionCode: '02', name: 'Burgas' } as RegionData,
      { countryCode: 'BG', regionCode: '23', name: 'Sofia' } as RegionData,
      { countryCode: 'BG', regionCode: '03', name: 'Varna' } as RegionData
    );
  }

  /*
    gets all regions of country
    @params (String) country code
    @returns (Observable<Region>) Observable of regions
  */
  getRegions(countryCode: string): Observable<Region> {
    switch (countryCode) {
      case 'US': {
        return this.regionDataUS$.map(regionData => RegionFactory.fromData(regionData));
      }
      case 'BG': {
        return this.regionDataBG$.map(regionData => RegionFactory.fromData(regionData));
      }
      default: {
        return null;
      }
    }
  }
}

