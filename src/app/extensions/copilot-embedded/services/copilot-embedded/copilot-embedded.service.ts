import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, scan } from 'rxjs/operators';

import { CopilotEmbeddedAnswerData } from '../../models/copilot-embedded-answer/copilot-embedded-answer.interface';
import { CopilotEmbeddedAnswerMapper } from '../../models/copilot-embedded-answer/copilot-embedded-answer.mapper';
import { CopilotEmbeddedAnswer } from '../../models/copilot-embedded-answer/copilot-embedded-answer.model';
import { CopilotEmbeddedRequest } from '../../models/copilot-embedded-request/copilot-embedded-request.model';
import { CopilotEmbeddedUpload } from '../../models/copilot-embedded-upload/copilot-embedded-upload.model';
import { CopilotEmbeddedApiService } from '../copilot-embedded-api/copilot-embedded-api.service';

/**
 * Request body of the Flowise Prediction API.
 */
interface PredictionRequestBody {
  question: string;
  streaming: boolean;
  overrideConfig: {
    vars: Record<string, unknown>;
    sessionId?: string;
  };
  uploads?: CopilotEmbeddedUpload[];
  chatId?: string;
}

/**
 * The Copilot Embedded Service handles the REST interaction with the Flowise chatflow that
 * powers the Copilot Embedded AI agent.
 *
 * In contrast to the Copilot - which embeds a pre-built chat UI (`web.js`) that calls Flowise
 * itself - the PWA owns the whole Copilot Embedded UI. This service therefore talks to the
 * Flowise Prediction API directly via the {@link CopilotEmbeddedApiService}.
 *
 * It supports both a non-streaming request ({@link sendMessage}) and a streaming, token-by-token
 * request via Server-Sent Events ({@link streamMessage}).
 *
 * The current basket contents, order templates and the products shown in the results panel are
 * appended to the question as `[CURRENT_BASKET]` / `[ORDER_TEMPLATES]` / `[SHOWN_PRODUCTS]` markers
 * so the chatflow can act on them without a server-side read.
 */
@Injectable({ providedIn: 'root' })
export class CopilotEmbeddedService {
  constructor(private copilotEmbeddedApiService: CopilotEmbeddedApiService) {}

  /**
   * Checks whether the configured chatflow has streaming enabled.
   */
  isStreamingAvailable$(): Observable<boolean> {
    return this.copilotEmbeddedApiService.get<{ isStreaming: boolean }>('chatflows-streaming').pipe(
      map(response => !!response?.isStreaming),
      catchError(() => of(false))
    );
  }

  /**
   * Sends a message to the Copilot Embedded chatflow and returns the complete response.
   *
   * @param request  The user's message with the resolved PWA context. Requires a question or an upload.
   * @returns        The chatflow answer including the recommended products and answer choices.
   */
  sendMessage(request: CopilotEmbeddedRequest): Observable<CopilotEmbeddedAnswer> {
    return this.copilotEmbeddedApiService
      .post<CopilotEmbeddedAnswerData>('prediction', this.buildRequestBody(request))
      .pipe(map(response => CopilotEmbeddedAnswerMapper.fromData(response)));
  }

  /**
   * Sends a message to the Copilot Embedded chatflow and streams the response as Server-Sent Events.
   *
   * Emits the answer received so far whenever a Flowise event (`token`, `usedTools`, `metadata`, ...)
   * changes it. Completes when the stream ends and errors on network/HTTP failures. Streaming only works
   * in the browser.
   *
   * @param request  The user's message with the resolved PWA context. Requires a question or an upload.
   */
  streamMessage(request: CopilotEmbeddedRequest): Observable<CopilotEmbeddedAnswer> {
    return this.copilotEmbeddedApiService.stream('prediction', this.buildRequestBody(request, true)).pipe(
      scan(
        (answer, event) => CopilotEmbeddedAnswerMapper.fromStreamEvent(answer, event),
        CopilotEmbeddedAnswerMapper.fromData({ text: '' })
      ),
      distinctUntilChanged()
    );
  }

  /**
   * Builds the Flowise prediction request body.
   */
  private buildRequestBody(request: CopilotEmbeddedRequest, streaming = false): PredictionRequestBody {
    if (!request.question?.trim() && !request.uploads?.length) {
      throw new Error('Copilot Embedded request without a question or attachment');
    }

    // Flowise does not resolve runtime vars inside the prompt, so the PWA context is appended to the question;
    // the chatflow memory keeps no tool output, so this is also its only source for the SKUs of shown products
    const questionWithContext =
      `${request.question}\n\n[CURRENT_BASKET]=${JSON.stringify(request.basket)}` +
      `\n[ORDER_TEMPLATES]=${JSON.stringify(request.orderTemplates)}` +
      `\n[SHOWN_PRODUCTS]=${JSON.stringify(request.shownProducts)}`;

    return {
      question: questionWithContext,
      streaming,
      ...(request.uploads?.length ? { uploads: request.uploads } : {}),
      ...(request.chatId ? { chatId: request.chatId } : {}),
      overrideConfig: {
        ...(request.sessionId ? { sessionId: request.sessionId } : {}),
        vars: request.vars,
      },
    };
  }
}
