import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { RequisitionsService } from './requisitions.service';

describe('Requisitions Service', () => {
  let apiServiceMock: ApiService;
  let requisitionsService: RequisitionsService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    requisitionsService = TestBed.inject(RequisitionsService);
  });

  it('should be created', () => {
    expect(requisitionsService).toBeTruthy();
  });
});
