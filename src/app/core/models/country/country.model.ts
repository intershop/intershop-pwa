import { Region } from '../region/region.model';

export interface Country {
  countryCode: string;
  name: string;
  regions?: Region[];
}
