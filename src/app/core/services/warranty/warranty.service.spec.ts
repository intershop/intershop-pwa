import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

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
});
