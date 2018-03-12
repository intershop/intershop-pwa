import { Region } from '../region/region.model';

export class Country {
  countryCode: string;
  name: string;
  regions?: Region[];
}
