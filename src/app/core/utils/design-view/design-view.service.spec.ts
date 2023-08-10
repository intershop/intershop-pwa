import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { DesignViewService } from './design-view.service';

describe('Design View Service', () => {
  let apiServiceMock: ApiService;
  let designviewService: DesignViewService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    designviewService = TestBed.inject(DesignViewService);
  });

  it('should be created', () => {
    expect(designviewService).toBeTruthy();
  });
});
