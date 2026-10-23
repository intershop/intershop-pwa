import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { instance, mock, when } from 'ts-mockito';

import { CopilotEmbeddedFacade } from '../../facades/copilot-embedded.facade';
import { CopilotEmbeddedConfig } from '../../models/copilot-embedded-config/copilot-embedded-config.model';

import { CopilotEmbeddedApiService } from './copilot-embedded-api.service';

describe('Copilot Embedded Api Service', () => {
  let apiService: CopilotEmbeddedApiService;
  let httpTestingController: HttpTestingController;
  let configuration$: BehaviorSubject<CopilotEmbeddedConfig>;

  beforeEach(() => {
    configuration$ = new BehaviorSubject({ apiHost: 'https://flowise.example.com', chatflowid: 'chatflow-123' });
    const copilotEmbeddedFacade = mock(CopilotEmbeddedFacade);
    when(copilotEmbeddedFacade.configuration$).thenReturn(configuration$);

    TestBed.configureTestingModule({
      providers: [
        { provide: CopilotEmbeddedFacade, useFactory: () => instance(copilotEmbeddedFacade) },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    apiService = TestBed.inject(CopilotEmbeddedApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(apiService).toBeTruthy();
  });

  it('should send GET requests to the chatflow-scoped endpoint', done => {
    apiService.get('chatflows-streaming').subscribe(response => {
      expect(response).toEqual({ isStreaming: true });
      done();
    });

    const req = httpTestingController.expectOne('https://flowise.example.com/api/v1/chatflows-streaming/chatflow-123');
    expect(req.request.method).toEqual('GET');
    req.flush({ isStreaming: true });
  });

  it('should send POST requests with the body to the chatflow-scoped endpoint', done => {
    apiService.post('prediction', { question: 'hi' }).subscribe(response => {
      expect(response).toEqual({ text: 'ok' });
      done();
    });

    const req = httpTestingController.expectOne('https://flowise.example.com/api/v1/prediction/chatflow-123');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ question: 'hi' });
    req.flush({ text: 'ok' });
  });

  it('should error when the chatflow is not configured', done => {
    configuration$.next({ apiHost: '', chatflowid: '' });

    apiService.get('chatflows-streaming').subscribe({
      error: error => {
        expect(error.message).toContain('not configured');
        done();
      },
    });
  });

  describe('stream', () => {
    const originalFetch = global.fetch;

    function mockFetch(chunks: string[], status = 200) {
      const encoded = chunks.map(chunk => new TextEncoder().encode(chunk));
      const reader = {
        read: jest.fn(() =>
          Promise.resolve(encoded.length ? { done: false, value: encoded.shift() } : { done: true, value: undefined })
        ),
        cancel: jest.fn(),
      };
      global.fetch = jest.fn(() =>
        Promise.resolve({ ok: status < 400, status, body: { getReader: () => reader } } as unknown as Response)
      );
    }

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should post to the chatflow-scoped endpoint and emit the parsed Server-Sent Events', done => {
      mockFetch([
        'data:{"event":"token","data":"Hel"}\n\n',
        'data:{"event":"token","data":"lo"}\n\ndata:[DONE]',
        '\n\n',
      ]);

      apiService
        .stream('prediction', { question: 'hi' })
        .pipe(toArray())
        .subscribe(events => {
          expect(events).toEqual([
            { event: 'token', data: 'Hel' },
            { event: 'token', data: 'lo' },
            { event: 'end', data: undefined },
          ]);
          expect(global.fetch).toHaveBeenCalledWith(
            'https://flowise.example.com/api/v1/prediction/chatflow-123',
            expect.objectContaining({ method: 'POST', body: '{"question":"hi"}' })
          );
          done();
        });
    });

    it('should error when the response is not ok', done => {
      mockFetch([], 500);

      apiService.stream('prediction', {}).subscribe({
        error: error => {
          expect(error.message).toContain('500');
          done();
        },
      });
    });
  });
});
