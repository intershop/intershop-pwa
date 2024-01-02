import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { DotCmsImageService } from './dot-cms-image.service';

describe('DotCmsImage Service', () => {
  let apiServiceMock: ApiService;
  let dotCmsImageService: DotCmsImageService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    dotCmsImageService = TestBed.inject(DotCmsImageService);
  });

  it('should be created', () => {
    expect(dotCmsImageService).toBeTruthy();
  });
});
