import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import {
  ProductInventoryData,
  ProductInventoryDetailsData,
} from 'ish-core/models/product-inventories/product-inventories.interface';
import { ProductInventoriesMapper } from 'ish-core/models/product-inventories/product-inventories.mapper';
import { ProductInventoryDetails } from 'ish-core/models/product-inventories/product-inventories.model';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';

import { InventoriesService } from './inventories.service';

describe('Inventories Service', () => {
  let service: InventoriesService;
  let apiServiceMock: ApiService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);

    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }, InventoriesService],
    });

    service = TestBed.inject(InventoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProductInventory', () => {
    it('should throw error when called without skus', done => {
      service.getProductInventory([]).subscribe({
        error: error => {
          expect(error.message).toBe('getProductInventory() called without skus');
          done();
        },
      });
    });

    it('should throw error when called with null skus', done => {
      service.getProductInventory(undefined).subscribe({
        error: error => {
          expect(error.message).toBe('getProductInventory() called without skus');
          done();
        },
      });
    });

    it('should get inventory data when "getProductInventory" is called', done => {
      const mockResponse = {
        data: [
          { sku: '123', inStock: true },
          { sku: '456', inStock: false },
        ],
      };
      when(apiServiceMock.get(anything(), anything())).thenReturn(of(mockResponse));

      service.getProductInventory(['123', '456']).subscribe(inventoryDetails => {
        expect(inventoryDetails).toHaveLength(2);
        verify(apiServiceMock.get('inventories', anything())).once();
        expect(capture<string, AvailableOptions>(apiServiceMock.get).last()[1].params.toString()).toEqual(
          'sku=123&sku=456'
        );
        done();
      });
    });

    it('should map response data correctly', done => {
      const mockInventoryDetailsData: ProductInventoryDetailsData = {
        sku: 'test-sku',
        inStock: true,
        availableStock: 10,
      };
      const mockResponse: ProductInventoryData = { data: [mockInventoryDetailsData] };
      const mappedInventory: ProductInventoryDetails = { sku: 'test-sku', inStock: true };

      when(apiServiceMock.get(anything(), anything())).thenReturn(of(mockResponse));

      const originalFromData = ProductInventoriesMapper.fromData;
      let capturedArg: ProductInventoryDetailsData | undefined = undefined;
      (ProductInventoriesMapper as { fromData(data: ProductInventoryDetailsData): ProductInventoryDetails }).fromData =
        (data: ProductInventoryDetailsData) => {
          capturedArg = data;
          return mappedInventory;
        };

      service.getProductInventory(['test-sku']).subscribe(result => {
        expect(result).toEqual([mappedInventory]);
        expect(capturedArg).toEqual(mockInventoryDetailsData);
        ProductInventoriesMapper.fromData = originalFromData;
        done();
      });
    });

    it('should handle api service error', done => {
      const errorMessage = 'API Error';
      when(apiServiceMock.get(anything(), anything())).thenReturn(throwError(() => new Error(errorMessage)));

      service.getProductInventory(['test-sku']).subscribe({
        error: error => {
          expect(error.message).toBe(errorMessage);
          done();
        },
      });
    });
  });
});
