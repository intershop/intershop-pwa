import { Injectable } from '@angular/core';

import { Region } from '../../models/region.model';

@Injectable()
export class RegionService {
  REGIONS_US: Region[];
  REGIONS_BG: Region[];

  /*
    ToDo: get Regions via REST, result should be locale dependent
  */
  constructor() {
    this.REGIONS_US = [
      { countryCode: 'US', regionCode: 'AL', name: 'Alabama' },
      { countryCode: 'US', regionCode: 'FL', name: 'Florida' },
      { countryCode: 'US', regionCode: 'IN', name: 'Indiana' },
      { countryCode: 'US', regionCode: 'MN', name: 'Michigan' },
      { countryCode: 'US', regionCode: 'NY', name: 'New York' },
      { countryCode: 'US', regionCode: 'TX', name: 'Texas' }
    ];
    this.REGIONS_BG = [
      { countryCode: 'BG', regionCode: '02', name: 'Burgas' },
      { countryCode: 'BG', regionCode: '23', name: 'Sofia' },
      { countryCode: 'BG', regionCode: '03', name: 'Varna' }
    ];
  }

  /*
    gets all regions of country
    @params (String) country code
    @returns (Region[]) Array of regions, ToDo: should be an observable
  */
  getRegions(countryCode: string): Region[] {
    switch (countryCode) {
      case 'US': {
        return this.REGIONS_US;
      }
      case 'BG': {
        return this.REGIONS_BG;
      }
      default: {
        return null;
      }
    }
  }
}

