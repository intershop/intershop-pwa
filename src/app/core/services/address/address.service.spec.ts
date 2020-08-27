import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ApiService } from 'ish-core/services/api/api.service';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { AddressService } from './address.service';

describe('Address Service', () => {
  let addressService: AddressService;
  let apiService: ApiService;
  let appFacade: AppFacade;

  beforeEach(() => {
    apiService = mock(ApiService);
    appFacade = mock(AppFacade);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
    });
    when(appFacade.customerRestResource$).thenReturn(of('customers'));

    addressService = TestBed.inject(AddressService);
  });

  it("should get addresses data when 'getCustomerAddresses' is called for b2c/b2x applications", done => {
    when(apiService.get(`customers/-/addresses`)).thenReturn(of([]));
    when(apiService.resolveLinks()).thenReturn(() => of([]));

    addressService.getCustomerAddresses().subscribe(() => {
      verify(apiService.get(`customers/-/addresses`)).once();
      done();
    });
  });

  it("should get addresses data when 'getCustomerAddresses' is called for rest applications", done => {
    when(apiService.get(`privatecustomers/-/addresses`)).thenReturn(of([]));
    when(apiService.resolveLinks()).thenReturn(() => of([]));
    when(appFacade.customerRestResource$).thenReturn(of('privatecustomers'));

    addressService.getCustomerAddresses().subscribe(() => {
      verify(apiService.get(`privatecustomers/-/addresses`)).once();
      done();
    });
  });

  it("should create an address when 'createCustomerAddress' is called", done => {
    when(apiService.post(`customers/-/addresses`, anything())).thenReturn(
      of({ type: 'Link', uri: 'site/-/customers/-/addresses/addressid' })
    );
    when(apiService.resolveLink()).thenReturn(() => of(BasketMockData.getAddress()));

    addressService.createCustomerAddress('-', BasketMockData.getAddress()).subscribe(data => {
      verify(apiService.post(`customers/-/addresses`, anything())).once();
      verify(apiService.resolveLink()).once();
      expect(data).toHaveProperty('firstName', 'Patricia');
      done();
    });
  });

  it("should update an address when 'updateCustomerAddress' is called", done => {
    const newAddress = BasketMockData.getAddress();
    newAddress.firstName = 'John';

    when(apiService.put(`customers/-/addresses/${newAddress.id}`, anything())).thenReturn(of(newAddress));

    addressService.updateCustomerAddress('-', newAddress).subscribe(data => {
      verify(apiService.put(`customers/-/addresses/${newAddress.id}`, anything())).once();
      expect(data).toHaveProperty('firstName', 'John');
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
