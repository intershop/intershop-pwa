import { Region } from 'ish-core/models/region/region.model';

export interface Country {
  countryCode: string;
  name: string;
  regions?: Region[];
}
