import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { WarrantyData } from 'ish-core/models/warranty/warranty.interface';
import { ApiService } from 'ish-core/services/api/api.service';

import { WarrantyService } from './warranty.service';

describe('Warranty Service', () => {
  let apiServiceMock: ApiService;
  let warrantyService: WarrantyService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    warrantyService = TestBed.inject(WarrantyService);
  });

  it('should be created', () => {
    expect(warrantyService).toBeTruthy();
  });

  it("should get a warranty product when 'getWarranty' is called", done => {
    when(apiServiceMock.get(`products/sku123`, anything())).thenReturn(of({ sku: 'sku123' } as WarrantyData));

    warrantyService.getWarranty('sku123').subscribe(data => {
      expect(data.id).toEqual('sku123');
      verify(apiServiceMock.get(`products/sku123`, anything())).once();
      done();
    });
  });
});
