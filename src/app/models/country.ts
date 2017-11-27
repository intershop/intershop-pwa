import { Region } from './region';

export class Country {
  countryCode: string;
  name: string;
  regions?: Region[];
}
