import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from '../../../core/services/api/api.service';
import { BasketMockData } from '../../../utils/dev/basket-mock-data';

import { AddressService } from './address.service';

describe('Address Service', () => {
  let addressService: AddressService;
  let apiService: ApiService;

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.icmServerURL).thenReturn('http://server');
    addressService = new AddressService(instance(apiService));
  });

  it("should get addresses data when 'getCustomerAddresses' is called", done => {
    when(apiService.get(`customers/-/addresses`)).thenReturn(of([]));

    addressService.getCustomerAddresses().subscribe(() => {
      verify(apiService.get(`customers/-/addresses`)).once();
      done();
    });
  });

  it("should create an address when 'createCustomerAddress' is called", done => {
    when(apiService.post(`customers/-/addresses`, anything())).thenReturn(
      of({ type: 'Link', uri: 'site/-/customers/-/addresses/addressid' })
    );
    when(apiService.get(anything())).thenReturn(of(BasketMockData.getAddress()));

    addressService.createCustomerAddress('-', BasketMockData.getAddress()).subscribe(data => {
      verify(apiService.post(`customers/-/addresses`, anything())).once();
      verify(apiService.get('http://server/site/-/customers/-/addresses/addressid')).once();
      expect(data).toHaveProperty('firstName', 'Patricia');
      done();
    });
  });

  it("should delete an address when 'deleteCustomerAddress' is called", done => {
    when(apiService.delete(`customers/-/addresses/addressid`)).thenReturn(of({}));

    addressService.deleteCustomerAddress('-', 'addressid').subscribe(() => {
      verify(apiService.delete(`customers/-/addresses/addressid`)).once();
      done();
    });
  });
});
