import { FactoryHelper } from '../factory-helper';
import { RegionFactory } from '../region/region.factory';
import { CountryData } from './country.interface';
import { Country } from './country.model';

export class CountryFactory {

  static fromData(data: CountryData): Country {
    const country: Country = new Country();
    FactoryHelper.primitiveMapping<CountryData, Country>(data, country);
    if (data.regions) {
      country.regions = data.regions.map(region => RegionFactory.fromData(region));
    }
    return country;
  }
}
