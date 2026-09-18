import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { ProductAdvisorFacade } from '../../facades/product-advisor.facade';
import { extractProductsFromToolCalls } from '../../models/product-advisor-product/product-advisor-product.helper';
import { ProductAdvisorProduct } from '../../models/product-advisor-product/product-advisor-product.model';
import {
  ProductAdvisorChatMessage,
  ProductAdvisorChatSession,
  ProductAdvisorResponse,
  ProductAdvisorToolCall,
} from '../../models/product-advisor/product-advisor.model';

const SESSION_STORAGE_KEY = 'product_advisor_session_id';

function generateSessionId(): string {
  return `pa-${crypto.randomUUID()}`;
}

/**
 * The Product Advisor page orchestrates the conversation state and delegates presentation to the
 * chat and results components. The REST interaction is handled by the {@link ProductAdvisorFacade}.
 *
 * The transcript and Flowise `chatId` are persisted to localStorage (keyed by chatflow ID) so the
 * conversation is restored after reload/navigation.
 */
@Component({
  selector: 'ish-product-advisor-page',
  standalone: false,
  templateUrl: './product-advisor-page.component.html',
  styleUrls: ['./product-advisor-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAdvisorPageComponent implements OnInit {
  deviceType$: Observable<DeviceType>;

  messages: ProductAdvisorChatMessage[] = [];
  pendingAnswer = '';
  loading = false;
  error: string;
  toolErrors: { tool: string; error: string }[] = [];
  products: ProductAdvisorProduct[] = [];

  private sessionId: string;
  private chatId: string;
  private chatflowid: string;
  private destroyRef = inject(DestroyRef);

  constructor(
    private productAdvisorFacade: ProductAdvisorFacade,
    private appFacade: AppFacade,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.deviceType$ = this.appFacade.deviceType$;
    this.sessionId = this.getOrCreateSessionId();

    this.productAdvisorFacade.configuration$.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(config => {
      this.chatflowid = config?.chatflowid;
      this.restoreSession();
      this.cdRef.markForCheck();
    });
  }

  /**
   * Sends a user message to the advisor (streaming when available, otherwise non-streaming).
   */
  onSend(question: string) {
    const trimmed = question?.trim();
    if (!trimmed || this.loading) {
      return;
    }

    this.loading = true;
    this.error = undefined;
    this.toolErrors = [];
    this.pendingAnswer = '';
    this.addMessage({ message: trimmed, type: 'userMessage' });

    const request = { question: trimmed, sessionId: this.sessionId };
    this.resolveStreaming$()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(streamingAvailable =>
        streamingAvailable ? this.startStreaming(request) : this.fetchFinalAnswer(request)
      );
  }

  /**
   * Resolves whether to stream: honors the `streaming` config override, otherwise probes the chatflow.
   */
  private resolveStreaming$(): Observable<boolean> {
    return this.productAdvisorFacade.configuration$.pipe(
      take(1),
      switchMap(config =>
        typeof config?.streaming === 'boolean'
          ? of(config.streaming)
          : this.productAdvisorFacade.isStreamingAvailable$()
      )
    );
  }

  /**
   * Starts a fresh conversation: clears the transcript, rotates the session ID and drops the
   * persisted chat (clears the chatflow memory).
   */
  resetSession() {
    this.messages = [];
    this.chatId = undefined;
    this.pendingAnswer = '';
    this.toolErrors = [];
    this.products = [];
    this.error = undefined;
    this.clearStoredSession();
    this.sessionId = generateSessionId();
    this.persistSessionId(this.sessionId);
  }

  private startStreaming(request: { question: string; sessionId: string }) {
    let streamedTools: ProductAdvisorToolCall[];

    this.productAdvisorFacade
      .streamMessage(request.question, { sessionId: request.sessionId, chatId: this.chatId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: event => {
          if (event.event === 'token' && typeof event.data === 'string') {
            this.pendingAnswer += event.data;
          } else if (event.event === 'usedTools' && Array.isArray(event.data)) {
            streamedTools = event.data as ProductAdvisorToolCall[];
          } else if (event.event === 'metadata' && this.isMetadata(event.data)) {
            this.chatId = event.data.chatId ?? this.chatId;
          }
          this.cdRef.markForCheck();
        },
        error: error => this.fail(error),
        complete: () => {
          // Flowise does not always stream the final answer as tokens (e.g. after tool errors);
          // fall back to the non-streaming text so an answer is still shown.
          if (!this.pendingAnswer) {
            this.fetchFinalAnswer(request);
          } else {
            this.addApiMessage(this.pendingAnswer, streamedTools);
            this.pendingAnswer = '';
            this.finish();
          }
        },
      });
  }

  private fetchFinalAnswer(request: { question: string; sessionId: string }) {
    this.productAdvisorFacade
      .sendMessage(request.question, { sessionId: request.sessionId, chatId: this.chatId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.finalizeAnswer(response),
        error: error => this.fail(error),
      });
  }

  private finalizeAnswer(response: ProductAdvisorResponse) {
    this.chatId = response.chatId ?? this.chatId;
    this.addApiMessage(response.text, response.usedTools, response.chatMessageId);
    this.pendingAnswer = '';
    this.finish();
  }

  private addApiMessage(message: string, usedTools: ProductAdvisorToolCall[], messageId?: string) {
    this.toolErrors = this.collectToolErrors(usedTools);
    const products = extractProductsFromToolCalls(usedTools);
    if (products.length) {
      this.products = products;
    }
    this.addMessage({ message, type: 'apiMessage', usedTools, messageId, dateTime: new Date().toISOString() });
  }

  private addMessage(message: ProductAdvisorChatMessage) {
    this.messages = [...this.messages, message];
    this.saveSession();
  }

  private getOrCreateSessionId(): string {
    if (!SSR) {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        return stored;
      }
    }
    const sessionId = generateSessionId();
    this.persistSessionId(sessionId);
    return sessionId;
  }

  private persistSessionId(sessionId: string) {
    if (!SSR && sessionId) {
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
  }

  private restoreSession() {
    if (SSR || !this.chatflowid) {
      return;
    }
    const raw = localStorage.getItem(this.chatStorageKey());
    if (!raw) {
      return;
    }
    try {
      const session = JSON.parse(raw) as ProductAdvisorChatSession;
      this.messages = session.chatHistory ?? [];
      this.chatId = session.chatId;
      this.products = this.latestProducts(this.messages);
    } catch {
      // ignore corrupt storage
    }
  }

  private latestProducts(messages: ProductAdvisorChatMessage[]): ProductAdvisorProduct[] {
    for (let i = messages.length - 1; i >= 0; i--) {
      const products = extractProductsFromToolCalls(messages[i].usedTools);
      if (products.length) {
        return products;
      }
    }
    return [];
  }

  private saveSession() {
    if (SSR || !this.chatflowid) {
      return;
    }
    const session: ProductAdvisorChatSession = { chatId: this.chatId, chatHistory: this.messages };
    localStorage.setItem(this.chatStorageKey(), JSON.stringify(session));
  }

  private clearStoredSession() {
    if (!SSR && this.chatflowid) {
      localStorage.removeItem(this.chatStorageKey());
    }
  }

  private chatStorageKey(): string {
    return `product_advisor_chat_${this.chatflowid}`;
  }

  private isMetadata(data: unknown): data is { chatId?: string } {
    return !!data && typeof data === 'object';
  }

  private collectToolErrors(tools: ProductAdvisorToolCall[] | undefined): { tool: string; error: string }[] {
    return (tools ?? []).filter(tool => !!tool?.error).map(tool => ({ tool: tool.tool, error: tool.error }));
  }

  private finish() {
    this.loading = false;
    this.cdRef.markForCheck();
  }

  private fail(error: unknown) {
    this.error = error instanceof Error ? error.message : JSON.stringify(error);
    this.finish();
  }
}
