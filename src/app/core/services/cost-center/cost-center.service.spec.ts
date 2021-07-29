import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { CostCenterService } from './cost-center.service';

describe('Cost Center Service', () => {
  let apiServiceMock: ApiService;
  let costCenterService: CostCenterService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    costCenterService = TestBed.inject(CostCenterService);
  });

  it('should be created', () => {
    expect(costCenterService).toBeTruthy();
  });
});
