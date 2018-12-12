import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from '../api/api.service';

import { CountryService } from './country.service';

describe('Country Service', () => {
  let countryService: CountryService;
  let apiService: ApiService;

  const country = {
    id: 'countryCode',
    name: 'countryName',
  };

  const countryData = { data: [country] };

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
});
