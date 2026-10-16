import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Subject, of, throwError } from 'rxjs';

import { CopilotEmbeddedAnswer } from '../models/copilot-embedded-answer/copilot-embedded-answer.model';
import { CopilotEmbeddedChatMessage } from '../models/copilot-embedded-chat-message/copilot-embedded-chat-message.model';
import { CopilotEmbeddedChatService } from '../utils/copilot-embedded-chat/copilot-embedded-chat.service';
import { CopilotEmbeddedToolCallService } from '../utils/copilot-embedded-tool-call/copilot-embedded-tool-call.service';

import { CopilotEmbeddedContextFacade } from './copilot-embedded-context.facade';
import { CopilotEmbeddedFacade } from './copilot-embedded.facade';

function answer(overrides: Partial<CopilotEmbeddedAnswer> = {}): CopilotEmbeddedAnswer {
  return { text: '', usedTools: [], products: [], ...overrides };
}

describe('Copilot Embedded Context Facade', () => {
  let context: CopilotEmbeddedContextFacade;
  let chatService: {
    isStreamingAvailable$: jest.Mock;
    sendMessage: jest.Mock;
    streamMessage: jest.Mock;
  };
  let toolCallService: { handleToolCalls: jest.Mock };

  function createContext() {
    TestBed.configureTestingModule({
      providers: [
        { provide: CopilotEmbeddedChatService, useValue: chatService },
        { provide: CopilotEmbeddedFacade, useValue: { configuration$: of({ chatflowid: 'flow-1' }) } },
        { provide: CopilotEmbeddedToolCallService, useValue: toolCallService },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
        CopilotEmbeddedContextFacade,
      ],
    });
    context = TestBed.inject(CopilotEmbeddedContextFacade);
  }

  beforeEach(() => {
    localStorage.clear();
    chatService = {
      isStreamingAvailable$: jest.fn(() => of(false)),
      sendMessage: jest.fn(() => of(answer({ text: 'A recommendation', chatId: 'chat-1' }))),
      streamMessage: jest.fn(() => of(answer({ text: 'A streamed answer' }))),
    };
    toolCallService = { handleToolCalls: jest.fn() };
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    createContext();

    expect(context).toBeTruthy();
    expect(context.get('messages')).toBeEmpty();
    expect(context.get('sessionId')).toStartWith('pa-');
  });

  it('should use the non-streaming request when streaming is not available', () => {
    createContext();

    context.send({ question: '  find laptops  ' });

    expect(chatService.streamMessage).not.toHaveBeenCalled();
    expect(chatService.sendMessage).toHaveBeenCalledWith('find laptops', {
      sessionId: context.get('sessionId'),
      chatId: undefined,
      uploads: undefined,
      shownProducts: [],
    });
    expect(context.get('messages').map(message => message.message)).toEqual(['find laptops', 'A recommendation']);
    expect(context.get('chatId')).toBe('chat-1');
    expect(context.get('loading')).toBeFalse();
  });

  it('should ignore empty messages', () => {
    createContext();

    context.send({ question: '   ' });

    expect(chatService.sendMessage).not.toHaveBeenCalled();
    expect(context.get('messages')).toBeEmpty();
  });

  it('should forward the products shown in the results panel with the request', () => {
    createContext();
    context.set({ products: [{ sku: '201807204', title: 'Microsoft Surface Laptop', price: 1999 }] });

    context.send({ question: 'add the recommended one' });

    expect(chatService.sendMessage).toHaveBeenCalledWith(
      'add the recommended one',
      expect.objectContaining({ shownProducts: [{ sku: '201807204', title: 'Microsoft Surface Laptop' }] })
    );
  });

  it('should execute tool calls and show the recommended products of an answer', () => {
    const usedTools = [{ tool: 'PWA_basket', toolInput: {}, error: 'failed' }];
    chatService.sendMessage.mockReturnValue(
      of(answer({ text: 'Here you go', usedTools, products: [{ sku: 'product-1' }] }))
    );
    createContext();

    context.send({ question: 'find laptops' });

    expect(toolCallService.handleToolCalls).toHaveBeenCalledWith(usedTools);
    expect(context.get('products').map(product => product.sku)).toEqual(['product-1']);
    expect(context.get('messages').at(-1).products).toEqual([{ sku: 'product-1' }]);
    expect(context.get('toolErrors')).toEqual([{ tool: 'PWA_basket', error: 'failed' }]);
  });

  it('should show the streamed answer and persist the resulting conversation', () => {
    chatService.isStreamingAvailable$.mockReturnValue(of(true));
    chatService.streamMessage.mockReturnValue(
      of(
        answer({ text: 'A ' }),
        answer({ text: 'A ', chatId: 'stream-chat-1' }),
        answer({ text: 'A streamed answer', chatId: 'stream-chat-1' })
      )
    );
    createContext();

    context.send({ question: 'recommend something' });

    expect(chatService.sendMessage).not.toHaveBeenCalled();
    expect(context.get('messages').map(message => message.message)).toEqual([
      'recommend something',
      'A streamed answer',
    ]);
    expect(context.get('pendingAnswer')).toBeEmpty();
    expect(context.get('loading')).toBeFalse();
    expect(JSON.parse(localStorage.getItem('copilot_embedded_chat_flow-1')).chatId).toBe('stream-chat-1');
  });

  it('should fetch a complete answer when the stream ends without tokens', () => {
    chatService.isStreamingAvailable$.mockReturnValue(of(true));
    chatService.streamMessage.mockReturnValue(of(answer({ chatId: 'stream-chat-2' })));
    chatService.sendMessage.mockReturnValue(of(answer({ text: 'Fallback answer', chatId: 'final-chat-2' })));
    createContext();

    context.send({ question: 'show me options' });

    expect(chatService.sendMessage).toHaveBeenCalledWith('show me options', {
      sessionId: context.get('sessionId'),
      chatId: 'stream-chat-2',
      uploads: undefined,
      shownProducts: [],
    });
    expect(context.get('messages').at(-1)).toMatchObject({ message: 'Fallback answer', type: 'apiMessage' });
    expect(context.get('loading')).toBeFalse();
  });

  it('should expose a generic error and stop loading when a request fails', () => {
    chatService.sendMessage.mockReturnValue(throwError(() => new Error('offline')));
    createContext();

    context.send({ question: 'help' });

    expect(context.get('error')).toBe('copilot.embedded.error.generic');
    expect(context.get('loading')).toBeFalse();
    expect(context.get('messages')).toHaveLength(1);
  });

  it('should accept new messages after a failed request', () => {
    chatService.sendMessage.mockReturnValueOnce(throwError(() => new Error('offline')));
    createContext();

    context.send({ question: 'help' });
    context.send({ question: 'help again' });

    expect(context.get('error')).toBeUndefined();
    expect(context.get('messages').at(-1)).toMatchObject({ message: 'A recommendation', type: 'apiMessage' });
  });

  it('should ignore a non-streaming response that arrives after the session is reset', () => {
    const response$ = new Subject<CopilotEmbeddedAnswer>();
    chatService.sendMessage.mockReturnValue(response$);
    createContext();

    context.send({ question: 'find products' });
    context.reset();
    response$.next(answer({ text: 'Late answer', chatId: 'old-chat' }));

    expect(context.get('messages')).toBeEmpty();
    expect(context.get('loading')).toBeFalse();
    expect(toolCallService.handleToolCalls).not.toHaveBeenCalled();
  });

  it('should ignore streamed events that arrive after the session is reset', () => {
    chatService.isStreamingAvailable$.mockReturnValue(of(true));
    const stream$ = new Subject<CopilotEmbeddedAnswer>();
    chatService.streamMessage.mockReturnValue(stream$);
    createContext();

    context.send({ question: 'find products' });
    context.reset();
    stream$.next(answer({ text: 'Late answer' }));

    expect(context.get('messages')).toBeEmpty();
    expect(context.get('pendingAnswer')).toBeEmpty();
    expect(context.get('loading')).toBeFalse();
    expect(toolCallService.handleToolCalls).not.toHaveBeenCalled();
  });

  it('should restore the saved transcript and clear it when the session is reset', () => {
    const history: CopilotEmbeddedChatMessage[] = [{ message: 'Saved reply', type: 'apiMessage' }];
    localStorage.setItem(
      'copilot_embedded_chat_flow-1',
      JSON.stringify({ chatId: 'saved-chat', chatHistory: history })
    );
    createContext();
    const sessionId = context.get('sessionId');

    expect(context.get('messages')).toEqual(history);
    expect(context.get('chatId')).toBe('saved-chat');

    context.reset();

    expect(context.get('messages')).toBeEmpty();
    expect(context.get('sessionId')).not.toBe(sessionId);
    expect(localStorage.getItem('copilot_embedded_chat_flow-1')).toBeNull();
    expect(localStorage.getItem('copilot_embedded_session_id')).toBe(context.get('sessionId'));
  });

  it('should ignore a malformed saved transcript', () => {
    localStorage.setItem('copilot_embedded_chat_flow-1', '{invalid json');
    createContext();

    expect(context.get('messages')).toBeEmpty();
  });
});
