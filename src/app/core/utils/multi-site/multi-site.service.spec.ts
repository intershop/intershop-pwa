import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { MultiSiteService } from './multi-site.service';

describe('Multi Site Service', () => {
  let apiServiceMock: ApiService;
  let multiSiteService: MultiSiteService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    multiSiteService = TestBed.inject(MultiSiteService);
  });

  it('should be created', () => {
    expect(multiSiteService).toBeTruthy();
  });
});
