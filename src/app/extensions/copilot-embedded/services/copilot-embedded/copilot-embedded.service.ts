// cspell:ignore chatflows
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CopilotEmbeddedConfig } from '../../models/copilot-embedded-config/copilot-embedded-config.model';
import {
  CopilotEmbeddedChatRequest,
  CopilotEmbeddedResponse,
  CopilotEmbeddedStreamEvent,
} from '../../models/copilot-embedded/copilot-embedded.model';

/**
 * Parses a single raw SSE event block into a {@link CopilotEmbeddedStreamEvent}.
 *
 * Flowise wraps the payload as JSON in the `data:` field, e.g. `data:{"event":"token","data":"Hi"}`.
 * Falls back to the SSE `event:` field and raw string data if the payload is not JSON.
 */
function parseSseEvent(rawEvent: string): CopilotEmbeddedStreamEvent | undefined {
  let eventName: string | undefined;
  const dataLines: string[] = [];

  for (const line of rawEvent.split('\n')) {
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim());
    }
  }

  const dataString = dataLines.join('\n');
  if (!dataString && !eventName) {
    return;
  }
  if (dataString === '[DONE]') {
    return { event: 'end', data: undefined };
  }

  try {
    const parsed = JSON.parse(dataString);
    if (parsed && typeof parsed === 'object' && 'event' in parsed) {
      return parsed as CopilotEmbeddedStreamEvent;
    }
    return { event: eventName ?? 'message', data: parsed };
  } catch {
    return { event: eventName ?? 'message', data: dataString };
  }
}

/**
 * The Copilot Embedded Service handles the REST interaction with the Flowise chatflow that
 * powers the Copilot Embedded AI agent.
 *
 * In contrast to the Copilot - which embeds a pre-built chat UI (`web.js`) that calls Flowise
 * itself - the PWA owns the whole Copilot Embedded UI. This service therefore talks to the
 * Flowise Prediction API directly:
 *
 * `POST {apiHost}/api/v1/prediction/{chatflowid}`
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
  constructor(private httpClient: HttpClient) {}

  /**
   * Checks whether the configured chatflow has streaming enabled.
   * Mirrors the embed's `GET /api/v1/chatflows-streaming/{chatflowid}` probe; resolves to `false`
   * when the chatflow is not configured or the probe fails.
   */
  isStreamingAvailable$(config: CopilotEmbeddedConfig): Observable<boolean> {
    if (!config?.apiHost || !config?.chatflowid) {
      return of(false);
    }
    return this.httpClient
      .get<{ isStreaming: boolean }>(`${config.apiHost}/api/v1/chatflows-streaming/${config.chatflowid}`)
      .pipe(
        map(response => !!response?.isStreaming),
        catchError(() => of(false))
      );
  }

  /**
   * Sends a message to the Copilot Embedded chatflow and returns the complete response.
   *
   * @param config   The Copilot Embedded configuration.
   * @param request  The user's message with the resolved PWA context. Requires a question or an upload.
   * @returns        The chatflow response including answer text, used tools and source documents.
   */
  sendMessage(config: CopilotEmbeddedConfig, request: CopilotEmbeddedChatRequest): Observable<CopilotEmbeddedResponse> {
    const { url, body } = this.buildRequest(config, request);
    return this.httpClient.post<CopilotEmbeddedResponse>(url, body);
  }

  /**
   * Sends a message to the Copilot Embedded chatflow and streams the response as Server-Sent Events.
   *
   * Emits one {@link CopilotEmbeddedStreamEvent} per Flowise event (`start`, `token`, `usedTools`,
   * `sourceDocuments`, `metadata`, `error`, `end`, ...). Completes when the stream ends and errors
   * on network/HTTP failures. Streaming only works in the browser.
   *
   * @param config   The Copilot Embedded configuration.
   * @param request  The user's message with the resolved PWA context. Requires a question or an upload.
   */
  streamMessage(
    config: CopilotEmbeddedConfig,
    request: CopilotEmbeddedChatRequest
  ): Observable<CopilotEmbeddedStreamEvent> {
    const { url, body } = this.buildRequest(config, request, true);
    return this.streamPrediction(url, body);
  }

  /**
   * Builds the Flowise prediction URL and request body.
   */
  private buildRequest(
    config: CopilotEmbeddedConfig,
    request: CopilotEmbeddedChatRequest,
    streaming = false
  ): { url: string; body: Record<string, unknown> } {
    if (!request.question?.trim() && !request.uploads?.length) {
      throw new Error('Copilot Embedded request without a question or attachment');
    }
    if (!config?.apiHost || !config.chatflowid) {
      throw new Error('Copilot Embedded is not configured (apiHost and chatflowid are required)');
    }

    // Flowise does not resolve runtime vars inside the prompt, so the PWA context is appended to the question;
    // the chatflow memory keeps no tool output, so this is also its only source for the SKUs of shown products
    const questionWithContext =
      `${request.question}\n\n[CURRENT_BASKET]=${JSON.stringify(request.basket)}` +
      `\n[ORDER_TEMPLATES]=${JSON.stringify(request.orderTemplates)}` +
      `\n[SHOWN_PRODUCTS]=${JSON.stringify(request.shownProducts)}`;

    const body: Record<string, unknown> = {
      question: questionWithContext,
      streaming,
      ...(request.uploads?.length ? { uploads: request.uploads } : {}),
      ...(request.chatId ? { chatId: request.chatId } : {}),
      overrideConfig: {
        ...(request.sessionId ? { sessionId: request.sessionId } : {}),
        vars: request.vars,
      },
    };

    return { url: `${config.apiHost}/api/v1/prediction/${config.chatflowid}`, body };
  }

  /**
   * Performs the streaming prediction request via the fetch API and parses the Server-Sent Events.
   */
  private streamPrediction(url: string, body: Record<string, unknown>): Observable<CopilotEmbeddedStreamEvent> {
    return new Observable<CopilotEmbeddedStreamEvent>(subscriber => {
      const abortController = new AbortController();

      from(
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
          body: JSON.stringify(body),
          signal: abortController.signal,
        })
      )
        .pipe(switchMap(response => this.readEventStream(response)))
        .subscribe({
          next: event => subscriber.next(event),
          error: error => subscriber.error(error),
          complete: () => subscriber.complete(),
        });

      return () => abortController.abort();
    });
  }

  /**
   * Reads a `text/event-stream` response body and emits the parsed Copilot Embedded events.
   */
  private readEventStream(response: Response): Observable<CopilotEmbeddedStreamEvent> {
    return new Observable<CopilotEmbeddedStreamEvent>(subscriber => {
      if (!response.ok) {
        subscriber.error(new Error(`Copilot Embedded request failed with status ${response.status}`));
        return;
      }
      if (!response.body) {
        subscriber.error(new Error('Copilot Embedded response does not provide a readable stream'));
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const pump = (): Promise<void> =>
        reader.read().then(({ done, value }) => {
          if (done) {
            subscriber.complete();
            return;
          }

          buffer += decoder.decode(value, { stream: true });

          // SSE events are separated by a blank line.
          let boundary = buffer.indexOf('\n\n');
          while (boundary !== -1) {
            const rawEvent = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);
            const event = parseSseEvent(rawEvent);
            if (event) {
              subscriber.next(event);
            }
            boundary = buffer.indexOf('\n\n');
          }

          return pump();
        });

      pump().catch(error => subscriber.error(error));

      return () => {
        reader.cancel();
      };
    });
  }
}
