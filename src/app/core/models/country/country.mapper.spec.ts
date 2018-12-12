import { CountryData } from 'ish-core/models/country/country.interface';
import { CountryMapper } from 'ish-core/models/country/country.mapper';

describe('Country Mapper', () => {
  describe('fromData', () => {
    it(`should return Country when getting CountryData with name and countrycode`, () => {
      const countryData = {
        id: 'countryId',
        name: 'countryName',
      } as CountryData;
      const country = CountryMapper.fromData(countryData);

      expect(country.name).toBe(countryData.name);
      expect(country.countryCode).toBe(countryData.id);
    });
  });
});
