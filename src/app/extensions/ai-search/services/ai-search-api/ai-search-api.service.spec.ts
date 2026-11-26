import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AiSearchFacade } from '../../facades/ai-search.facade';

import { AiSearchApiService } from './ai-search-api.service';

describe('Ai Search Api Service', () => {
  let apiService: AiSearchApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const aiSearchFacade = mock(AiSearchFacade);
    when(aiSearchFacade.configuration$).thenReturn(
      of({ apiHost: 'https://flowise.example.com', chatflowid: 'chatflow-123' })
    );

    TestBed.configureTestingModule({
      providers: [{ provide: AiSearchFacade, useFactory: () => instance(aiSearchFacade) }, provideHttpClientTesting()],
    });

    apiService = TestBed.inject(AiSearchApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('post', () => {
    it('should return an error and send no request when called without endpoint', done => {
      apiService.post(undefined, { question: 'shoes' }).subscribe({
        next: fail,
        error: err => {
          expect(err.message).toEqual('post() called without endpoint');
          done();
        },
      });
    });

    it('should return an error and send no request when called without body', done => {
      apiService.post('prediction', undefined).subscribe({
        next: fail,
        error: err => {
          expect(err.message).toEqual('post() called without body');
          done();
        },
      });
    });
  });
});
