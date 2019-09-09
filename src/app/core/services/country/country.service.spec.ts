import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { CountryService } from './country.service';

describe('Country Service', () => {
  let countryService: CountryService;
  let apiService: ApiService;

  const country = {
    id: 'countryCode',
    name: 'countryName',
  };

  const region = {
    id: 'regionID',
    name: 'regionName',
  };

  const countryData = { data: [country] };
  const regionData = { data: [region] };

  beforeEach(() => {
    apiService = mock(ApiService);
    countryService = new CountryService(instance(apiService));
  });

  it("should get all available countries when 'getCountries' is called", done => {
    when(apiService.get(`countries`, anything())).thenReturn(of(countryData));

    countryService.getCountries().subscribe(() => {
      verify(apiService.get(`countries`, anything())).once();
      done();
    });
  });

  it("should get all available regions when 'getRegionByCountry' is called", done => {
    when(apiService.get(`countries/countryCode/main-divisions`, anything())).thenReturn(of(regionData));

    countryService.getRegionsByCountry('countryCode').subscribe(regions => {
      verify(apiService.get(`countries/countryCode/main-divisions`, anything())).once();
      expect(regions).toHaveLength(1);
      expect(regions[0]).toHaveProperty('id', 'countryCode_regionID');
      done();
    });
  });
});
