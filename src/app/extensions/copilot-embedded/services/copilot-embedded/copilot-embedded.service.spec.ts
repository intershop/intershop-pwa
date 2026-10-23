import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { CopilotEmbeddedAnswerData } from '../../models/copilot-embedded-answer/copilot-embedded-answer.interface';
import { CopilotEmbeddedRequest } from '../../models/copilot-embedded-request/copilot-embedded-request.model';
import { CopilotEmbeddedApiService } from '../copilot-embedded-api/copilot-embedded-api.service';

import { CopilotEmbeddedService } from './copilot-embedded.service';

function chatRequest(overrides: Partial<CopilotEmbeddedRequest> = {}): CopilotEmbeddedRequest {
  return { question: 'hi', vars: {}, basket: [], orderTemplates: [], shownProducts: [], ...overrides };
}

describe('Copilot Embedded Service', () => {
  let copilotEmbeddedService: CopilotEmbeddedService;
  let apiService: CopilotEmbeddedApiService;

  beforeEach(() => {
    apiService = mock(CopilotEmbeddedApiService);

    TestBed.configureTestingModule({
      providers: [{ provide: CopilotEmbeddedApiService, useFactory: () => instance(apiService) }],
    });

    copilotEmbeddedService = TestBed.inject(CopilotEmbeddedService);
  });

  it('should be created', () => {
    expect(copilotEmbeddedService).toBeTruthy();
  });

  describe('isStreamingAvailable$', () => {
    it('should probe whether the chatflow supports streaming', done => {
      when(apiService.get(anything())).thenReturn(of({ isStreaming: true }));

      copilotEmbeddedService.isStreamingAvailable$().subscribe(available => {
        expect(available).toBeTrue();
        verify(apiService.get('chatflows-streaming')).once();
        done();
      });
    });

    it('should resolve to false when the probe fails', done => {
      when(apiService.get(anything())).thenReturn(throwError(() => new Error('not configured')));

      copilotEmbeddedService.isStreamingAvailable$().subscribe(available => {
        expect(available).toBeFalse();
        done();
      });
    });
  });

  describe('sendMessage', () => {
    beforeEach(() => {
      const response: CopilotEmbeddedAnswerData = { text: 'Here is a recommendation', chatId: 'abc' };
      when(apiService.post(anything(), anything())).thenReturn(of(response));
    });

    it('should throw when sending a message without a question', () => {
      expect(() => copilotEmbeddedService.sendMessage(chatRequest({ question: '' }))).toThrow();
      expect(() => copilotEmbeddedService.sendMessage(chatRequest({ question: '   ' }))).toThrow();
    });

    it('should post the question to the Flowise prediction endpoint', done => {
      copilotEmbeddedService
        .sendMessage(
          chatRequest({
            question: 'recommend a laptop',
            sessionId: 'session-1',
            vars: { currentLocale: 'en_US', user_token: 'icm-token-xyz' },
          })
        )
        .subscribe(result => {
          expect(result).toEqual({
            text: 'Here is a recommendation',
            chatId: 'abc',
            messageId: undefined,
            usedTools: [],
            products: [],
            choices: undefined,
          });

          const [endpoint, body] = capture(apiService.post).last();
          expect(endpoint).toEqual('prediction');
          // the current basket, order templates and shown products are appended to the question as markers
          expect(body).toEqual({
            question: 'recommend a laptop\n\n[CURRENT_BASKET]=[]\n[ORDER_TEMPLATES]=[]\n[SHOWN_PRODUCTS]=[]',
            streaming: false,
            overrideConfig: {
              sessionId: 'session-1',
              vars: { currentLocale: 'en_US', user_token: 'icm-token-xyz' },
            },
          });
          done();
        });
    });

    it('should append the PWA context to the question', done => {
      copilotEmbeddedService
        .sendMessage(
          chatRequest({
            question: 'add the first one',
            basket: [{ sku: '123', quantity: 2 }],
            orderTemplates: [{ id: 'ot-1', title: 'Office' }],
            shownProducts: [{ sku: '201807204', title: 'Microsoft Surface Laptop' }],
          })
        )
        .subscribe(() => {
          const [, body] = capture(apiService.post).last();
          expect((body as { question: string }).question).toEqual(
            'add the first one\n\n[CURRENT_BASKET]=[{"sku":"123","quantity":2}]' +
              '\n[ORDER_TEMPLATES]=[{"id":"ot-1","title":"Office"}]' +
              '\n[SHOWN_PRODUCTS]=[{"sku":"201807204","title":"Microsoft Surface Laptop"}]'
          );
          done();
        });
    });
  });

  describe('streamMessage', () => {
    it('should stream the prediction and emit the answer received so far', done => {
      when(apiService.stream(anything(), anything())).thenReturn(
        of(
          { event: 'token', data: 'Hello' },
          { event: 'token', data: ' world' },
          { event: 'metadata', data: { chatId: 'chat-1' } }
        )
      );

      copilotEmbeddedService
        .streamMessage(chatRequest())
        .pipe(toArray())
        .subscribe(answers => {
          expect(answers.map(answer => answer.text)).toEqual(['Hello', 'Hello world', 'Hello world']);
          expect(answers.at(-1).chatId).toEqual('chat-1');

          const [endpoint, body] = capture(apiService.stream).last();
          expect(endpoint).toEqual('prediction');
          expect((body as { streaming: boolean }).streaming).toBeTrue();
          done();
        });
    });

    it('should error on a chatflow error event after the answers received so far', done => {
      when(apiService.stream(anything(), anything())).thenReturn(
        of(
          { event: 'token', data: 'A partial' },
          { event: 'error', data: '401 Unauthorized' },
          { event: 'end', data: undefined }
        )
      );
      const answers: string[] = [];

      copilotEmbeddedService.streamMessage(chatRequest()).subscribe({
        next: answer => answers.push(answer.text),
        error: error => {
          expect(answers).toEqual(['A partial']);
          expect(error.message).toContain('401 Unauthorized');
          done();
        },
      });
    });

    it('should error on a chatflow error event without any token', done => {
      when(apiService.stream(anything(), anything())).thenReturn(
        of({ event: 'error', data: 'model not available' }, { event: 'end', data: undefined })
      );

      copilotEmbeddedService.streamMessage(chatRequest()).subscribe({
        error: error => {
          expect(error.message).toContain('model not available');
          done();
        },
      });
    });
  });
});
