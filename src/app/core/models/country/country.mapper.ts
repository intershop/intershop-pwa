import { CountryData } from './country.interface';
import { Country } from './country.model';

export class CountryMapper {
  static fromData(data: CountryData): Country {
    if (data) {
      return {
        countryCode: data.id,
        name: data.name,
      };
    } else {
      throw new Error(`'CountryData' is required for the mapping`);
    }
  }
}
