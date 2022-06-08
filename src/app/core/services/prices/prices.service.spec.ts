import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ProductPriceDetailsData } from 'ish-core/models/product-prices/product-prices.interface';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

import { PricesService } from './prices.service';

describe('Prices Service', () => {
  let apiServiceMock: ApiService;
  let pricesService: PricesService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore({
          selectors: [
            { selector: getLoggedInCustomer, value: { customerNo: 'customer', isBusinessCustomer: true } as Customer },
          ],
        }),
      ],
    });
    pricesService = TestBed.inject(PricesService);
  });

  it('should be created', () => {
    expect(pricesService).toBeTruthy();
  });

  describe('getProductPrices', () => {
    beforeEach(() => {
      when(apiServiceMock.get<{ data: ProductPriceDetailsData[] }>('productprices', anything())).thenReturn(
        of({ data: [{ sku: 'abc' }, { sku: '123' }] as ProductPriceDetailsData[] })
      );
    });

    it('should get product price data when "getProductPrices" is called', done => {
      pricesService.getProductPrices(['abc', '123']).subscribe(priceDetails => {
        expect(priceDetails).toHaveLength(2);
        verify(apiServiceMock.get(`productprices`, anything())).once();
        expect(
          capture<string, AvailableOptions>(apiServiceMock.get).last()?.[1]?.params?.toString()
        ).toMatchInlineSnapshot(`"sku=abc&sku=123&customerID=customer"`);
        done();
      });
    });
  });
});
