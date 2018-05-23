import { of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';
import { ApiService } from '../../../core/services/api/api.service';
import { AddressService } from './address.service';

describe('Address Service', () => {
  let addressService: AddressService;
  let apiService: ApiService;

  beforeEach(() => {
    apiService = mock(ApiService);
    addressService = new AddressService(instance(apiService));
  });

  it("should get addresses data when 'getCustomerAddresses' is called", done => {
    when(apiService.get(`customers/-/addresses`)).thenReturn(of([]));

    addressService.getCustomerAddresses().subscribe(() => {
      verify(apiService.get(`customers/-/addresses`)).once();
      done();
    });
  });
});
