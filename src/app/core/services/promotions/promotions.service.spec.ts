import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from '../api/api.service';

import { PromotionsService } from './promotions.service';

describe('Promotions Service', () => {
  let apiServiceMock: ApiService;
  let promotionsService: PromotionsService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    promotionsService = TestBed.get(PromotionsService);
  });

  it('should be created', () => {
    expect(promotionsService).toBeTruthy();
  });
});
