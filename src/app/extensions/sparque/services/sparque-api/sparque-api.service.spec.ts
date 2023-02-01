import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { SparqueApiService } from './sparque-api.service';

describe('Sparque Api Service', () => {
  let apiServiceMock: ApiService;
  let sparqueApiService: SparqueApiService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }, provideMockStore({})],
    });
    sparqueApiService = TestBed.inject(SparqueApiService);
  });

  it('should be created', () => {
    expect(sparqueApiService).toBeTruthy();
  });
});
