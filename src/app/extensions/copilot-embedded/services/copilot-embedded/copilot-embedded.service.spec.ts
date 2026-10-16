import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CopilotEmbeddedAnswerData } from '../../models/copilot-embedded-answer/copilot-embedded-answer.interface';
import { CopilotEmbeddedConfig } from '../../models/copilot-embedded-config/copilot-embedded-config.model';
import { CopilotEmbeddedChatRequest } from '../../models/copilot-embedded-request/copilot-embedded-request.model';

import { CopilotEmbeddedService } from './copilot-embedded.service';

const copilotEmbeddedConfig: CopilotEmbeddedConfig = {
  apiHost: 'https://flowise.example.com',
  chatflowid: 'chatflow-123',
};

const predictionUrl = 'https://flowise.example.com/api/v1/prediction/chatflow-123';

function chatRequest(overrides: Partial<CopilotEmbeddedChatRequest> = {}): CopilotEmbeddedChatRequest {
  return { question: 'hi', vars: {}, basket: [], orderTemplates: [], shownProducts: [], ...overrides };
}

// testing here is handled by http testing controller

describe('Copilot Embedded Service', () => {
  let copilotEmbeddedService: CopilotEmbeddedService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });

    copilotEmbeddedService = TestBed.inject(CopilotEmbeddedService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(copilotEmbeddedService).toBeTruthy();
  });

  it('should throw when sending a message without a question', () => {
    expect(() => copilotEmbeddedService.sendMessage(copilotEmbeddedConfig, chatRequest({ question: '' }))).toThrow();
    expect(() => copilotEmbeddedService.sendMessage(copilotEmbeddedConfig, chatRequest({ question: '   ' }))).toThrow();
  });

  it('should throw when the chatflow is not configured', () => {
    expect(() => copilotEmbeddedService.sendMessage({ apiHost: '', chatflowid: '' }, chatRequest())).toThrow();
  });

  it('should post the question to the Flowise prediction endpoint', done => {
    const response: CopilotEmbeddedAnswerData = { text: 'Here is a recommendation', chatId: 'abc' };

    copilotEmbeddedService
      .sendMessage(
        copilotEmbeddedConfig,
        chatRequest({
          question: 'recommend a laptop',
          sessionId: 'session-1',
          vars: { currentLocale: 'en_US', user_token: 'icm-token-xyz' },
        })
      )
      .subscribe(result => {
        expect(result).toEqual(response);
        done();
      });

    const req = httpTestingController.expectOne(predictionUrl);
    expect(req.request.method).toEqual('POST');
    // the current basket, order templates and shown products are appended to the question as markers
    expect(req.request.body.question).toEqual(
      'recommend a laptop\n\n[CURRENT_BASKET]=[]\n[ORDER_TEMPLATES]=[]\n[SHOWN_PRODUCTS]=[]'
    );
    expect(req.request.body.streaming).toBeFalse();
    expect(req.request.body.overrideConfig).toEqual({
      sessionId: 'session-1',
      vars: { currentLocale: 'en_US', user_token: 'icm-token-xyz' },
    });
    req.flush(response);
  });

  it('should append the PWA context to the question', done => {
    copilotEmbeddedService
      .sendMessage(
        copilotEmbeddedConfig,
        chatRequest({
          question: 'add the first one',
          basket: [{ sku: '123', quantity: 2 }],
          orderTemplates: [{ id: 'ot-1', title: 'Office' }],
          shownProducts: [{ sku: '201807204', title: 'Microsoft Surface Laptop' }],
        })
      )
      .subscribe(() => done());

    const req = httpTestingController.expectOne(predictionUrl);
    expect(req.request.body.question).toEqual(
      'add the first one\n\n[CURRENT_BASKET]=[{"sku":"123","quantity":2}]' +
        '\n[ORDER_TEMPLATES]=[{"id":"ot-1","title":"Office"}]' +
        '\n[SHOWN_PRODUCTS]=[{"sku":"201807204","title":"Microsoft Surface Laptop"}]'
    );
    req.flush({ text: 'ok' });
  });

  it('should probe whether the chatflow supports streaming', done => {
    copilotEmbeddedService.isStreamingAvailable$(copilotEmbeddedConfig).subscribe(available => {
      expect(available).toBeTrue();
      done();
    });

    const req = httpTestingController.expectOne('https://flowise.example.com/api/v1/chatflows-streaming/chatflow-123');
    expect(req.request.method).toEqual('GET');
    req.flush({ isStreaming: true });
  });
});
