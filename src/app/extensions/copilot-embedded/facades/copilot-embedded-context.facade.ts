import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RxState } from '@rx-angular/state';
import { EMPTY, Observable, Subject, concat, defer, of } from 'rxjs';
import { catchError, ignoreElements, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { CopilotEmbeddedAnswerData } from '../models/copilot-embedded-answer/copilot-embedded-answer.interface';
import {
  CopilotEmbeddedChatMessage,
  CopilotEmbeddedChatSession,
} from '../models/copilot-embedded-chat-message/copilot-embedded-chat-message.model';
import { CopilotEmbeddedChoiceMapper } from '../models/copilot-embedded-choice/copilot-embedded-choice.mapper';
import { CopilotEmbeddedProductMapper } from '../models/copilot-embedded-product/copilot-embedded-product.mapper';
import { CopilotEmbeddedProduct } from '../models/copilot-embedded-product/copilot-embedded-product.model';
import { CopilotEmbeddedRequestOptions } from '../models/copilot-embedded-request/copilot-embedded-request.model';
import { CopilotEmbeddedToolCall } from '../models/copilot-embedded-tool-call/copilot-embedded-tool-call.model';
import { CopilotEmbeddedUpload } from '../models/copilot-embedded-upload/copilot-embedded-upload.model';

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
  toolErrors: { tool: string; error: string }[];
  products: CopilotEmbeddedProduct[];
}

interface PendingMessage {
  question: string;
  uploads?: CopilotEmbeddedUpload[];
  shownProducts: { sku: string; title?: string }[];
}

function generateSessionId(): string {
  return `pa-${crypto.randomUUID()}`;
}

function latestProducts(messages: CopilotEmbeddedChatMessage[]): CopilotEmbeddedProduct[] {
  for (let i = messages.length - 1; i >= 0; i--) {
    const products = CopilotEmbeddedProductMapper.fromToolCalls(messages[i].usedTools);
    if (products.length) {
      return products;
    }
  }
  return [];
}

function collectToolErrors(tools: CopilotEmbeddedToolCall[] | undefined): { tool: string; error: string }[] {
  return (tools ?? []).filter(tool => !!tool?.error).map(tool => ({ tool: tool.tool, error: tool.error }));
}

function isMetadata(data: unknown): data is { chatId?: string } {
  return !!data && typeof data === 'object';
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
  send(payload: { question: string; uploads?: CopilotEmbeddedUpload[]; thumbnail?: string }) {
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

  private answer$(message: PendingMessage): Observable<CopilotEmbeddedAnswerData> {
    return this.copilotEmbeddedFacade
      .isStreamingAvailable$()
      .pipe(switchMap(streaming => (streaming ? this.streamAnswer$(message) : this.fetchAnswer$(message))));
  }

  private fetchAnswer$(message: PendingMessage): Observable<CopilotEmbeddedAnswerData> {
    return defer(() => this.copilotEmbeddedFacade.sendMessage(message.question, this.requestOptions(message)));
  }

  private streamAnswer$(message: PendingMessage): Observable<CopilotEmbeddedAnswerData> {
    return defer(() => {
      let usedTools: CopilotEmbeddedToolCall[];
      return concat(
        this.copilotEmbeddedFacade.streamMessage(message.question, this.requestOptions(message)).pipe(
          tap(({ event, data }) => {
            if (event === 'token' && typeof data === 'string') {
              this.set('pendingAnswer', state => state.pendingAnswer + data);
            } else if (event === 'usedTools' && Array.isArray(data)) {
              usedTools = data as CopilotEmbeddedToolCall[];
            } else if (event === 'metadata' && isMetadata(data)) {
              this.set('chatId', state => data.chatId ?? state.chatId);
            }
          }),
          ignoreElements()
        ),
        // Flowise does not always stream the final answer as tokens (e.g. after tool errors);
        // fall back to the non-streaming text so an answer is still shown.
        defer(() =>
          this.get('pendingAnswer')
            ? of<CopilotEmbeddedAnswerData>({ text: this.get('pendingAnswer'), usedTools })
            : this.fetchAnswer$(message)
        )
      );
    });
  }

  private requestOptions(message: PendingMessage): CopilotEmbeddedRequestOptions {
    return {
      sessionId: this.get('sessionId'),
      chatId: this.get('chatId'),
      uploads: message.uploads,
      shownProducts: message.shownProducts,
    };
  }

  private addAnswer(response: CopilotEmbeddedAnswerData) {
    const usedTools = response.usedTools;
    // execute the action tool calls (basket, compare, navigation, order templates)
    this.copilotEmbeddedFacade.handleToolCalls(usedTools);
    const products = CopilotEmbeddedProductMapper.fromToolCalls(usedTools);
    const answer: CopilotEmbeddedChatMessage = {
      message: response.text,
      type: 'apiMessage',
      usedTools,
      messageId: response.chatMessageId,
      dateTime: new Date().toISOString(),
      choices: CopilotEmbeddedChoiceMapper.fromToolCalls(usedTools),
    };
    this.set(state => ({
      chatId: response.chatId ?? state.chatId,
      toolErrors: collectToolErrors(usedTools),
      products: products.length ? products : state.products,
      messages: [...state.messages, answer],
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
