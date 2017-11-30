import { Region } from './region.model';

export class Country {
  countryCode: string;
  name: string;
  regions?: Region[];
}
