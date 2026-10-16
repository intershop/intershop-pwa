import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RxState } from '@rx-angular/state';
import { EMPTY, Observable, Subject, defer, of } from 'rxjs';
import { catchError, defaultIfEmpty, map, switchMap, take, takeLast, takeUntil, tap } from 'rxjs/operators';

import { CopilotEmbeddedAnswer } from '../models/copilot-embedded-answer/copilot-embedded-answer.model';
import {
  CopilotEmbeddedChatMessage,
  CopilotEmbeddedChatSession,
  CopilotEmbeddedUserInput,
} from '../models/copilot-embedded-chat-message/copilot-embedded-chat-message.model';
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

const SESSION_STORAGE_KEY = 'copilot_embedded_session_id';

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
  uploads?: CopilotEmbeddedUpload[];
  shownProducts: CopilotEmbeddedShownProduct[];
}

function generateSessionId(): string {
  return `pa-${crypto.randomUUID()}`;
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

function collectToolErrors(
  tools: CopilotEmbeddedToolCall[] | undefined
): Pick<CopilotEmbeddedToolCall, 'error' | 'tool'>[] {
  return (tools ?? []).filter(tool => !!tool?.error).map(tool => ({ tool: tool.tool, error: tool.error }));
}

/**
 * Holds the state of a Copilot Embedded conversation for the providing component and its children.
 *
 * The transcript and Flowise `chatId` are persisted to localStorage (keyed by chatflow ID) so the
 * conversation is restored after reload/navigation.
 */
@Injectable()
export class CopilotEmbeddedContextFacade extends RxState<CopilotEmbeddedContext> {
  private send$ = new Subject<PendingMessage>();
  private reset$ = new Subject<void>();

  constructor(
    private copilotEmbeddedFacade: CopilotEmbeddedFacade,
    private chatService: CopilotEmbeddedChatService,
    private toolCallService: CopilotEmbeddedToolCallService,
    private translateService: TranslateService
  ) {
    super();

    this.set({
      sessionId: this.getOrCreateSessionId(),
      messages: [],
      pendingAnswer: '',
      loading: false,
      toolErrors: [],
      products: [],
    });

    this.connect(
      this.copilotEmbeddedFacade.configuration$.pipe(
        take(1),
        map(config => ({ chatflowid: config.chatflowid, ...this.restoreSession(config.chatflowid) }))
      )
    );

    this.hold(this.select('messages'), messages => this.persistSession(messages));

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
   * session ID and drops the persisted chat (clears the chatflow memory).
   */
  reset() {
    this.reset$.next();
    const sessionId = generateSessionId();
    this.persistSessionId(sessionId);
    this.set({
      sessionId,
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
    return this.chatService
      .isStreamingAvailable$()
      .pipe(switchMap(streaming => (streaming ? this.streamAnswer$(message) : this.fetchAnswer$(message))));
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
    this.toolCallService.handleToolCalls(answer.usedTools);
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
    this.set({ error: 'copilot.embedded.error.generic', loading: false });
  }

  private getOrCreateSessionId(): string {
    const stored = !SSR ? localStorage.getItem(SESSION_STORAGE_KEY) : undefined;
    if (stored) {
      return stored;
    }
    const sessionId = generateSessionId();
    this.persistSessionId(sessionId);
    return sessionId;
  }

  private persistSessionId(sessionId: string) {
    if (!SSR) {
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
  }

  private restoreSession(chatflowid: string): Partial<CopilotEmbeddedContext> {
    if (SSR || !chatflowid) {
      return {};
    }
    const raw = localStorage.getItem(this.chatStorageKey(chatflowid));
    if (!raw) {
      return {};
    }
    try {
      const session = JSON.parse(raw) as CopilotEmbeddedChatSession;
      const messages = session.chatHistory ?? [];
      return { messages, chatId: session.chatId, products: latestProducts(messages) };
    } catch {
      // ignore corrupt storage
      return {};
    }
  }

  private persistSession(messages: CopilotEmbeddedChatMessage[]) {
    const chatflowid = this.get('chatflowid');
    if (SSR || !chatflowid) {
      return;
    }
    if (!messages.length) {
      localStorage.removeItem(this.chatStorageKey(chatflowid));
      return;
    }
    const session: CopilotEmbeddedChatSession = { chatId: this.get('chatId'), chatHistory: messages };
    try {
      localStorage.setItem(this.chatStorageKey(chatflowid), JSON.stringify(session));
    } catch {
      // storage full or unavailable: keep chatting, the transcript just won't survive a reload
    }
  }

  private chatStorageKey(chatflowid: string): string {
    return `copilot_embedded_chat_${chatflowid}`;
  }
}
