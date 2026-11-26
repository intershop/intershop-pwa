import { TestBed } from '@angular/core/testing';
import { anything, instance, mock, verify } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

import { AiSearchApiService } from '../ai-search-api/ai-search-api.service';

import { AiSearchService } from './ai-search.service';

describe('Ai Search Service', () => {
  let aiSearchService: AiSearchService;
  let aiSearchApiService: AiSearchApiService;

  beforeEach(() => {
    aiSearchApiService = mock(AiSearchApiService);

    TestBed.configureTestingModule({
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: AiSearchApiService, useFactory: () => instance(aiSearchApiService) },
        { provide: ApiTokenService, useFactory: () => instance(mock(ApiTokenService)) },
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
      ],
    });

    aiSearchService = TestBed.inject(AiSearchService);
  });

  describe('getAnswer', () => {
    it('should return an error and request no AI answer when called without searchQuery', done => {
      aiSearchService.getAnswer(undefined).subscribe({
        next: fail,
        error: err => {
          expect(err.message).toEqual('getAnswer() called without searchQuery');
          done();
        },
      });

      verify(aiSearchApiService.post(anything(), anything())).never();
    });
  });
});
