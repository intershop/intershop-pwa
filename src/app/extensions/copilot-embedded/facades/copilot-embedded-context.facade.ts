import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RxState } from '@rx-angular/state';
import { EMPTY, Observable, Subject, combineLatest, defer, of } from 'rxjs';
import {
  catchError,
  defaultIfEmpty,
  filter,
  map,
  shareReplay,
  switchMap,
  take,
  takeLast,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { whenTruthy } from 'ish-core/utils/operators';

import { CopilotEmbeddedAnswer } from '../models/copilot-embedded-answer/copilot-embedded-answer.model';
import { CopilotEmbeddedChatMessage } from '../models/copilot-embedded-chat-message/copilot-embedded-chat-message.model';
import { CopilotEmbeddedChat } from '../models/copilot-embedded-chat/copilot-embedded-chat.model';
import { CopilotEmbeddedProduct } from '../models/copilot-embedded-product/copilot-embedded-product.model';
import {
  CopilotEmbeddedRequestOptions,
  CopilotEmbeddedShownProduct,
} from '../models/copilot-embedded-request/copilot-embedded-request.model';
import { CopilotEmbeddedToolCall } from '../models/copilot-embedded-tool-call/copilot-embedded-tool-call.model';
import { CopilotEmbeddedUpload } from '../models/copilot-embedded-upload/copilot-embedded-upload.model';
import { CopilotEmbeddedChatService } from '../utils/copilot-embedded-chat/copilot-embedded-chat.service';
import { CopilotEmbeddedToolCallService } from '../utils/copilot-embedded-tool-call/copilot-embedded-tool-call.service';

import { CopilotEmbeddedFacade } from './copilot-embedded.facade';

/**
 * The input the user sends, which becomes a user chat message.
 */
export interface CopilotEmbeddedUserInput {
  question: string;
  uploads?: CopilotEmbeddedUpload[];
  /** Small JPEG thumbnail of the attached image, kept as `imageUrl` of the chat message. */
  thumbnail?: string;
}

export interface CopilotEmbeddedContext {
  chatflowid: string;
  sessionId: string;
  chatId: string;
  messages: CopilotEmbeddedChatMessage[];
  pendingAnswer: string;
  loading: boolean;
  error: string;
  toolErrors: Pick<CopilotEmbeddedToolCall, 'error' | 'tool'>[];
  products: CopilotEmbeddedProduct[];
}

interface PendingMessage {
  question: string;
  shownProducts: CopilotEmbeddedShownProduct[];
  uploads?: CopilotEmbeddedUpload[];
}

function latestProducts(messages: CopilotEmbeddedChatMessage[]): CopilotEmbeddedProduct[] {
  for (let i = messages.length - 1; i >= 0; i--) {
    const products = messages[i].products;
    if (products?.length) {
      return products;
    }
  }
  return [];
}

function collectToolErrors(tools: CopilotEmbeddedToolCall[]): Pick<CopilotEmbeddedToolCall, 'error' | 'tool'>[] {
  return (tools ?? []).filter(tool => !!tool?.error).map(tool => ({ tool: tool.tool, error: tool.error }));
}

/**
 * Restores a persisted conversation; a conversation of another chatflow is ignored.
 */
function restoreChat(chat: CopilotEmbeddedChat, chatflowid: string): Partial<CopilotEmbeddedContext> {
  if (!chat?.messages?.length || chat.chatflowid !== chatflowid) {
    return {};
  }
  return {
    messages: chat.messages,
    sessionId: chat.sessionId,
    chatId: chat.chatId,
    products: latestProducts(chat.messages),
  };
}

/**
 * Holds the state of a Copilot Embedded conversation for the providing component and its children.
 *
 * The transcript and the Flowise session and chat IDs are kept in the store, which persists them to the browser
 * storage according to `dataRetention.copilotEmbedded`, so the conversation is restored after reload/navigation.
 */
@Injectable()
export class CopilotEmbeddedContextFacade extends RxState<CopilotEmbeddedContext> {
  private send$ = new Subject<PendingMessage>();
  private reset$ = new Subject<void>();
  private streamingAvailable$: Observable<boolean>;

  constructor(
    private copilotEmbeddedFacade: CopilotEmbeddedFacade,
    private chatService: CopilotEmbeddedChatService,
    private toolCallService: CopilotEmbeddedToolCallService,
    private translateService: TranslateService
  ) {
    super();

    this.streamingAvailable$ = defer(() => this.chatService.isStreamingAvailable$()).pipe(shareReplay(1));

    this.set({
      sessionId: uuid(),
      messages: [],
      pendingAnswer: '',
      loading: false,
      toolErrors: [],
      products: [],
    });

    this.connect(
      combineLatest([
        this.copilotEmbeddedFacade.configuration$.pipe(whenTruthy()),
        this.copilotEmbeddedFacade.chat$,
      ]).pipe(
        take(1),
        map(([config, chat]) => ({ chatflowid: config.chatflowid, ...restoreChat(chat, config.chatflowid) }))
      )
    );

    this.hold(this.select('messages'), messages => this.persistChat(messages));

    // the logout clears the persisted chat, so the open conversation is dropped as well
    this.hold(
      this.copilotEmbeddedFacade.chat$.pipe(filter(chat => !chat?.messages?.length && !!this.get('messages').length)),
      () => this.reset()
    );

    this.hold(
      this.send$.pipe(
        switchMap(message =>
          this.answer$(message).pipe(
            tap({ next: response => this.addAnswer(response), error: () => this.fail() }),
            catchError(() => EMPTY),
            takeUntil(this.reset$)
          )
        )
      )
    );
  }

  /**
   * Sends a user message to the Copilot Embedded (streaming when available, otherwise non-streaming).
   */
  send(payload: CopilotEmbeddedUserInput) {
    const question = payload?.question?.trim() ?? '';
    const uploads = payload?.uploads?.length ? payload.uploads : undefined;
    if ((!question && !uploads) || this.get('loading')) {
      return;
    }

    const imageUrl = uploads ? payload.thumbnail : undefined;
    const userMessage: CopilotEmbeddedChatMessage = {
      message: question || (imageUrl ? '' : this.translateService.instant('copilot.embedded.input.image_message')),
      type: 'userMessage',
      imageUrl,
    };
    this.set(state => ({
      loading: true,
      error: undefined,
      toolErrors: [],
      pendingAnswer: '',
      messages: [...state.messages, userMessage],
    }));

    const shownProducts = this.get('products').map(product => ({ sku: product.sku, title: product.title }));
    this.send$.next({ question, uploads, shownProducts });
  }

  /**
   * Starts a fresh conversation: cancels a running request, clears the transcript, rotates the
   * session ID and drops the persisted chat (starts a new chatflow memory).
   */
  reset() {
    this.reset$.next();
    this.set({
      sessionId: uuid(),
      chatId: undefined,
      messages: [],
      pendingAnswer: '',
      loading: false,
      error: undefined,
      toolErrors: [],
      products: [],
    });
  }

  private answer$(message: PendingMessage): Observable<CopilotEmbeddedAnswer> {
    return this.streamingAvailable$.pipe(
      switchMap(streaming => (streaming ? this.streamAnswer$(message) : this.fetchAnswer$(message)))
    );
  }

  private fetchAnswer$(message: PendingMessage): Observable<CopilotEmbeddedAnswer> {
    return defer(() => this.chatService.sendMessage(message.question, this.requestOptions(message)));
  }

  private streamAnswer$(message: PendingMessage): Observable<CopilotEmbeddedAnswer> {
    return defer(() =>
      this.chatService.streamMessage(message.question, this.requestOptions(message)).pipe(
        tap(answer => this.set(state => ({ pendingAnswer: answer.text, chatId: answer.chatId ?? state.chatId }))),
        takeLast(1),
        defaultIfEmpty(undefined),
        // Flowise does not always stream the final answer as tokens (e.g. after tool errors);
        // fall back to the non-streaming text so an answer is still shown.
        switchMap(answer => (answer?.text ? of(answer) : this.fetchAnswer$(message)))
      )
    );
  }

  private requestOptions(message: PendingMessage): CopilotEmbeddedRequestOptions {
    return {
      sessionId: this.get('sessionId'),
      chatId: this.get('chatId'),
      uploads: message.uploads,
      shownProducts: message.shownProducts,
    };
  }

  private addAnswer(answer: CopilotEmbeddedAnswer) {
    // execute the action tool calls (basket, compare, navigation, order templates)
    this.toolCallService.triggerToolCallActions(answer.usedTools);
    const message: CopilotEmbeddedChatMessage = {
      message: answer.text,
      type: 'apiMessage',
      messageId: answer.messageId,
      dateTime: new Date().toISOString(),
      products: answer.products.length ? answer.products : undefined,
      choices: answer.choices,
    };
    this.set(state => ({
      chatId: answer.chatId ?? state.chatId,
      toolErrors: collectToolErrors(answer.usedTools),
      products: answer.products.length ? answer.products : state.products,
      messages: [...state.messages, message],
      pendingAnswer: '',
      loading: false,
    }));
  }

  private fail() {
    this.set({ error: 'copilot.embedded.error.generic', loading: false, pendingAnswer: '' });
  }

  private persistChat(messages: CopilotEmbeddedChatMessage[]) {
    const chatflowid = this.get('chatflowid');
    if (!chatflowid) {
      return;
    }
    if (!messages.length) {
      this.copilotEmbeddedFacade.resetChat();
      return;
    }
    this.copilotEmbeddedFacade.setChat({
      chatflowid,
      sessionId: this.get('sessionId'),
      chatId: this.get('chatId'),
      messages,
    });
  }
}
