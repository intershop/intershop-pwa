// cspell:ignore chatflows
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, from, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { OrderTemplatesFacade } from '../../../order-templates/facades/order-templates.facade';
import { CopilotEmbeddedConfig } from '../../models/copilot-embedded-config/copilot-embedded-config.model';
import {
  CopilotEmbeddedRequestOptions,
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
 * The `restEndpoint`, `currentLocale` and - for logged-in users - the ICM `user_token` are provided
 * as chatflow variables on every request (mirroring the Copilot integration) so the chatflow can
 * call back into ICM as the current user. The current basket contents and order templates are
 * appended to the question as `[CURRENT_BASKET]` / `[ORDER_TEMPLATES]` markers so the chatflow can
 * act on them without a server-side read.
 */
@Injectable({ providedIn: 'root' })
export class CopilotEmbeddedService {
  constructor(
    private httpClient: HttpClient,
    private statePropertiesService: StatePropertiesService,
    private appFacade: AppFacade,
    private apiTokenService: ApiTokenService,
    private checkoutFacade: CheckoutFacade,
    private orderTemplatesFacade: OrderTemplatesFacade,
    private featureToggleService: FeatureToggleService
  ) {}

  /**
   * The effective Copilot Embedded configuration from server state, environment variable or `environment.ts`.
   */
  getConfiguration$(): Observable<CopilotEmbeddedConfig> {
    return this.statePropertiesService.getStateOrEnvOrDefault<CopilotEmbeddedConfig>(
      'COPILOT_EMBEDDED',
      'copilotEmbedded'
    );
  }

  /**
   * Checks whether the configured chatflow has streaming enabled.
   * Mirrors the embed's `GET /api/v1/chatflows-streaming/{chatflowid}` probe; resolves to `false`
   * when the chatflow is not configured or the probe fails.
   */
  isStreamingAvailable$(): Observable<boolean> {
    return this.getConfiguration$().pipe(
      take(1),
      switchMap(config => {
        if (!config?.apiHost || !config?.chatflowid) {
          return of(false);
        }
        return this.httpClient
          .get<{ isStreaming: boolean }>(`${config.apiHost}/api/v1/chatflows-streaming/${config.chatflowid}`)
          .pipe(
            map(response => !!response?.isStreaming),
            catchError(() => of(false))
          );
      })
    );
  }

  /**
   * Sends a message to the Copilot Embedded chatflow and returns the complete response.
   *
   * @param question  The user's message. Must not be empty.
   * @param options   Optional session ID and additional chatflow variables.
   * @returns         The chatflow response including answer text, used tools and source documents.
   */
  sendMessage(question: string, options?: CopilotEmbeddedRequestOptions): Observable<CopilotEmbeddedResponse> {
    if (!question?.trim() && !options?.uploads?.length) {
      throw new Error('sendMessage() called without a question or attachment');
    }

    return this.buildRequest$(question, options).pipe(
      switchMap(({ url, body }) => this.httpClient.post<CopilotEmbeddedResponse>(url, body))
    );
  }

  /**
   * Sends a message to the Copilot Embedded chatflow and streams the response as Server-Sent Events.
   *
   * Emits one {@link CopilotEmbeddedStreamEvent} per Flowise event (`start`, `token`, `usedTools`,
   * `sourceDocuments`, `metadata`, `error`, `end`, ...). Completes when the stream ends and errors
   * on network/HTTP failures. Streaming only works in the browser.
   *
   * @param question  The user's message. Must not be empty.
   * @param options   Optional session ID and additional chatflow variables.
   */
  streamMessage(question: string, options?: CopilotEmbeddedRequestOptions): Observable<CopilotEmbeddedStreamEvent> {
    if (!question?.trim() && !options?.uploads?.length) {
      throw new Error('streamMessage() called without a question or attachment');
    }

    return this.buildRequest$(question, options, true).pipe(
      switchMap(({ url, body }) => this.streamPrediction(url, body))
    );
  }

  /**
   * Builds the Flowise prediction URL and request body, enriching the chatflow variables with the
   * current REST endpoint and locale.
   */
  private buildRequest$(
    question: string,
    options: CopilotEmbeddedRequestOptions | undefined,
    streaming = false
  ): Observable<{ url: string; body: Record<string, unknown> }> {
    const uploads = options?.uploads?.length ? options.uploads : undefined;
    return combineLatest([
      this.getConfiguration$(),
      this.appFacade.getRestEndpointWithContext$,
      this.appFacade.currentLocale$,
      this.apiTokenService.apiToken$,
      this.checkoutFacade.basketLineItems$,
      // order templates are a lazy, feature-gated store; only read them when the feature is enabled
      this.featureToggleService
        .enabled$('orderTemplates')
        .pipe(switchMap(enabled => (enabled ? this.orderTemplatesFacade.orderTemplates$ : of([])))),
    ]).pipe(
      take(1),
      map(([config, restEndpoint, currentLocale, userToken, lineItems, orderTemplates]) => {
        if (!config?.apiHost || !config?.chatflowid) {
          throw new Error('Copilot Embedded is not configured (apiHost and chatflowid are required)');
        }

        // current PWA context appended to the question because Flowise does not resolve runtime vars
        // inside the prompt; lets the chatflow act without the failing server-side read tools
        const basket = (lineItems ?? []).map(li => ({ sku: li.productSKU, quantity: li.quantity?.value }));
        const templates = (orderTemplates ?? []).map(t => ({ id: t.id, title: t.title }));
        const questionWithContext =
          `${question}\n\n[CURRENT_BASKET]=${JSON.stringify(basket)}` +
          `\n[ORDER_TEMPLATES]=${JSON.stringify(templates)}`;

        const body: Record<string, unknown> = {
          question: questionWithContext,
          streaming,
          ...(uploads ? { uploads } : {}),
          ...(options?.chatId ? { chatId: options.chatId } : {}),
          overrideConfig: {
            ...(options?.sessionId ? { sessionId: options.sessionId } : {}),
            vars: {
              restEndpoint,
              currentLocale,
              // forward the ICM access token so the chatflow can call ICM as the logged-in user
              ...(userToken ? { user_token: userToken } : {}),
              ...config.chatflowConfig?.vars,
              ...options?.vars,
            },
          },
        };

        return { url: `${config.apiHost}/api/v1/prediction/${config.chatflowid}`, body };
      })
    );
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
