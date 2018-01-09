import { RegionData } from '../region/region.interface';

export interface CountryData {
  countryCode: string;
  name: string;
  regions?: RegionData[];
}
