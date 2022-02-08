import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { StoresService } from './stores.service';

describe('Stores Service', () => {
  let apiServiceMock: ApiService;
  let storesService: StoresService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    storesService = TestBed.inject(StoresService);
  });

  it('should be created', () => {
    expect(storesService).toBeTruthy();
  });
});
