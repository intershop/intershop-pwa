import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';

import { InventoryService } from './inventory.service';

describe('Inventory Service', () => {
  let service: InventoryService;
  let apiServiceMock: ApiService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);

    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });

    service = TestBed.inject(InventoryService);
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
      const mockResponse = [
        { sku: '123', inStock: true },
        { sku: '456', inStock: false },
      ];
      when(apiServiceMock.get(anything(), anything())).thenReturn(of({ data: mockResponse }));

      service.getProductInventory([mockResponse[0].sku, mockResponse[1].sku]).subscribe(inventoryDetails => {
        expect(inventoryDetails).toHaveLength(mockResponse.length);
        verify(apiServiceMock.get('inventories', anything())).once();
        expect(capture<string, AvailableOptions>(apiServiceMock.get).last()[1].params.toString()).toEqual(
          'sku=123&sku=456'
        );
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
