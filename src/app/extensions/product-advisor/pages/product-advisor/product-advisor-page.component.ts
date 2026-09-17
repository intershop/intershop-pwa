import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

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
 * Interim Product Advisor page to work with the {@link ProductAdvisorFacade} until the final UI
 * components are available. Reachable at `/product-advisor`.
 *
 * The rendered transcript and the Flowise `chatId` are persisted to localStorage (keyed by
 * chatflow ID) so the conversation is restored after reload/navigation - mirroring the embed.
 */
@Component({
  selector: 'ish-product-advisor-page',
  standalone: false,
  templateUrl: './product-advisor-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAdvisorPageComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatWindow') private chatWindow: ElementRef<HTMLElement>;

  form: FormGroup;

  loading = false;
  error: string;

  messages: ProductAdvisorChatMessage[] = [];
  pendingAnswer = '';
  toolErrors: { tool: string; error: string }[] = [];
  products: ProductAdvisorProduct[] = [];

  private chatId: string;
  private chatflowid: string;
  private stickToBottom = true;
  private scrollPending = false;
  private destroyRef = inject(DestroyRef);

  constructor(
    private productAdvisorFacade: ProductAdvisorFacade,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      question: new FormControl('I am looking for a laptop for gaming', Validators.required),
      sessionId: new FormControl(this.getOrCreateSessionId()),
    });

    this.productAdvisorFacade.configuration$.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(config => {
      this.chatflowid = config?.chatflowid;
      this.restoreSession();
      this.scrollPending = true;
      this.cdRef.markForCheck();
    });
  }

  ngAfterViewChecked() {
    if (this.scrollPending) {
      this.scrollPending = false;
      if (this.stickToBottom) {
        this.scrollToBottom();
      }
    }
  }

  /**
   * Keeps auto-scroll active only while the user is near the bottom of the transcript.
   */
  onChatScroll() {
    const el = this.chatWindow?.nativeElement;
    if (el) {
      this.stickToBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    }
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

    const sessionId = generateSessionId();
    this.persistSessionId(sessionId);
    this.form.get('sessionId').setValue(sessionId);
  }

  send() {
    const request = this.prepareRequest();
    if (!request) {
      return;
    }

    this.productAdvisorFacade
      .sendMessage(request.question, { sessionId: request.sessionId, chatId: this.chatId })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.finalizeAnswer(response),
        error: error => this.fail(error),
      });
  }

  stream() {
    const request = this.prepareRequest();
    if (!request) {
      return;
    }

    // only stream when the chatflow supports it, otherwise go straight to non-streaming
    this.productAdvisorFacade
      .isStreamingAvailable$()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(streamingAvailable => {
        if (streamingAvailable) {
          this.startStreaming(request);
        } else {
          this.fetchFinalAnswer(request);
        }
      });
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
            this.scrollPending = true;
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

  private prepareRequest(): { question: string; sessionId: string } | undefined {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { question, sessionId } = this.form.value;
    const trimmed = question.trim();
    this.persistSessionId(sessionId);

    this.loading = true;
    this.error = undefined;
    this.toolErrors = [];
    this.pendingAnswer = '';
    this.stickToBottom = true;

    this.addMessage({ message: trimmed, type: 'userMessage' });
    this.form.get('question').reset('');

    return { question: trimmed, sessionId };
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
    this.scrollPending = true;
    this.saveSession();
  }

  private scrollToBottom() {
    const el = this.chatWindow?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
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
