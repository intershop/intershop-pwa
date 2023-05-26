import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { DesignviewService } from './designview.service';

describe('Designview Service', () => {
  let apiServiceMock: ApiService;
  let designviewService: DesignviewService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    designviewService = TestBed.inject(DesignviewService);
  });

  it('should be created', () => {
    expect(designviewService).toBeTruthy();
  });
});
