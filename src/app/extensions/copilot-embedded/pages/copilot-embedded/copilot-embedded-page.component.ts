import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { CopilotEmbeddedFacade } from '../../facades/copilot-embedded.facade';
import { extractProductsFromToolCalls } from '../../models/copilot-embedded-product/copilot-embedded-product.helper';
import { CopilotEmbeddedProduct } from '../../models/copilot-embedded-product/copilot-embedded-product.model';
import { extractChoicePromptFromToolCalls } from '../../models/copilot-embedded/copilot-embedded-choice.helper';
import {
  CopilotEmbeddedChatMessage,
  CopilotEmbeddedChatSession,
  CopilotEmbeddedResponse,
  CopilotEmbeddedToolCall,
  CopilotEmbeddedUpload,
} from '../../models/copilot-embedded/copilot-embedded.model';

const SESSION_STORAGE_KEY = 'copilot_embedded_session_id';

function generateSessionId(): string {
  return `pa-${crypto.randomUUID()}`;
}

/**
 * The Copilot Embedded page orchestrates the conversation state and delegates presentation to the
 * chat and results components. The REST interaction is handled by the {@link CopilotEmbeddedFacade}.
 *
 * The transcript and Flowise `chatId` are persisted to localStorage (keyed by chatflow ID) so the
 * conversation is restored after reload/navigation.
 */
@Component({
  selector: 'ish-copilot-embedded-page',
  standalone: false,
  templateUrl: './copilot-embedded-page.component.html',
  styleUrls: ['./copilot-embedded-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedPageComponent implements OnInit {
  deviceType$: Observable<DeviceType>;

  messages: CopilotEmbeddedChatMessage[] = [];
  pendingAnswer = '';
  loading = false;
  error: string;
  toolErrors: { tool: string; error: string }[] = [];
  products: CopilotEmbeddedProduct[] = [];

  private sessionId: string;
  private chatId: string;
  private chatflowid: string;
  private destroyRef = inject(DestroyRef);

  constructor(
    private copilotEmbeddedFacade: CopilotEmbeddedFacade,
    private appFacade: AppFacade,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.deviceType$ = this.appFacade.deviceType$;
    this.sessionId = this.getOrCreateSessionId();

    this.copilotEmbeddedFacade.configuration$.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(config => {
      this.chatflowid = config?.chatflowid;
      this.restoreSession();
      this.cdRef.markForCheck();
    });
  }

  /**
   * Sends a user message to the Copilot Embedded (streaming when available, otherwise non-streaming).
   */
  onSend(payload: { question: string; uploads?: CopilotEmbeddedUpload[]; thumbnail?: string }) {
    const trimmed = payload?.question?.trim();
    const uploads = payload?.uploads?.length ? payload.uploads : undefined;
    if ((!trimmed && !uploads) || this.loading) {
      return;
    }

    this.loading = true;
    this.error = undefined;
    this.toolErrors = [];
    this.pendingAnswer = '';
    const imageUrl = uploads ? payload.thumbnail : undefined;
    this.addMessage({
      message: trimmed || (imageUrl ? '' : this.translateService.instant('copilot.embedded.input.image_message')),
      type: 'userMessage',
      imageUrl,
    });

    const request = { question: trimmed ?? '', sessionId: this.sessionId, uploads };
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
    return this.copilotEmbeddedFacade.configuration$.pipe(
      take(1),
      switchMap(config =>
        typeof config?.streaming === 'boolean'
          ? of(config.streaming)
          : this.copilotEmbeddedFacade.isStreamingAvailable$()
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

  private startStreaming(request: { question: string; sessionId: string; uploads?: CopilotEmbeddedUpload[] }) {
    let streamedTools: CopilotEmbeddedToolCall[];

    this.copilotEmbeddedFacade
      .streamMessage(request.question, { sessionId: request.sessionId, chatId: this.chatId, uploads: request.uploads })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: event => {
          if (event.event === 'token' && typeof event.data === 'string') {
            this.pendingAnswer += event.data;
          } else if (event.event === 'usedTools' && Array.isArray(event.data)) {
            streamedTools = event.data as CopilotEmbeddedToolCall[];
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

  private fetchFinalAnswer(request: { question: string; sessionId: string; uploads?: CopilotEmbeddedUpload[] }) {
    this.copilotEmbeddedFacade
      .sendMessage(request.question, { sessionId: request.sessionId, chatId: this.chatId, uploads: request.uploads })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => this.finalizeAnswer(response),
        error: error => this.fail(error),
      });
  }

  private finalizeAnswer(response: CopilotEmbeddedResponse) {
    this.chatId = response.chatId ?? this.chatId;
    this.addApiMessage(response.text, response.usedTools, response.chatMessageId);
    this.pendingAnswer = '';
    this.finish();
  }

  private addApiMessage(message: string, usedTools: CopilotEmbeddedToolCall[], messageId?: string) {
    this.toolErrors = this.collectToolErrors(usedTools);
    const products = extractProductsFromToolCalls(usedTools);
    if (products.length) {
      this.products = products;
    }
    // execute the action tool calls (basket, compare, navigation, order templates)
    this.copilotEmbeddedFacade.handleToolCalls(usedTools);
    const choices = extractChoicePromptFromToolCalls(usedTools);
    this.addMessage({
      message,
      type: 'apiMessage',
      usedTools,
      messageId,
      dateTime: new Date().toISOString(),
      choices,
    });
  }

  private addMessage(message: CopilotEmbeddedChatMessage) {
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
      const session = JSON.parse(raw) as CopilotEmbeddedChatSession;
      this.messages = session.chatHistory ?? [];
      this.chatId = session.chatId;
      this.products = this.latestProducts(this.messages);
    } catch {
      // ignore corrupt storage
    }
  }

  private latestProducts(messages: CopilotEmbeddedChatMessage[]): CopilotEmbeddedProduct[] {
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
    const session: CopilotEmbeddedChatSession = { chatId: this.chatId, chatHistory: this.messages };
    try {
      localStorage.setItem(this.chatStorageKey(), JSON.stringify(session));
    } catch {
      // storage full or unavailable: keep chatting, the transcript just won't survive a reload
    }
  }

  private clearStoredSession() {
    if (!SSR && this.chatflowid) {
      localStorage.removeItem(this.chatStorageKey());
    }
  }

  private chatStorageKey(): string {
    return `copilot_embedded_chat_${this.chatflowid}`;
  }

  private isMetadata(data: unknown): data is { chatId?: string } {
    return !!data && typeof data === 'object';
  }

  private collectToolErrors(tools: CopilotEmbeddedToolCall[] | undefined): { tool: string; error: string }[] {
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
