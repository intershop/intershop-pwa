import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { concatMap, map, switchMap, take } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { CopilotEmbeddedFacade } from '../../facades/copilot-embedded.facade';
import { CopilotEmbeddedStreamEvent } from '../../models/copilot-embedded-answer/copilot-embedded-answer.interface';

/**
 * Parses a single raw SSE event block into a {@link CopilotEmbeddedStreamEvent}.
 *
 * Flowise wraps the payload as JSON in the `data:` field, e.g. `data:{"event":"token","data":"Hi"}`.
 * Falls back to the SSE `event:` field and raw string data if the payload is not JSON.
 */
function parseSseEvent(rawEvent: string): CopilotEmbeddedStreamEvent {
  let eventName: string;
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
 * The Copilot Embedded API Service handles the HTTP interaction with the Flowise API of the configured chatflow.
 *
 * Every request targets a chatflow-scoped endpoint `{apiHost}/api/v1/{endpoint}/{chatflowid}`; `apiHost` and
 * `chatflowid` are read from the Copilot Embedded configuration. Besides plain `get` and `post` requests it
 * supports streamed responses via Server-Sent Events ({@link stream}).
 */
@Injectable({ providedIn: 'root' })
export class CopilotEmbeddedApiService {
  constructor(
    private httpClient: HttpClient,
    private copilotEmbeddedFacade: CopilotEmbeddedFacade
  ) {}

  /**
   * Sends a GET request to the given chatflow endpoint.
   *
   * @param endpoint  The Flowise endpoint without the chatflow ID, e.g. `chatflows-streaming`.
   */
  get<T>(endpoint: string): Observable<T> {
    return this.url$(endpoint).pipe(concatMap(url => this.httpClient.get<T>(url)));
  }

  /**
   * Sends a POST request to the given chatflow endpoint.
   *
   * @param endpoint  The Flowise endpoint without the chatflow ID, e.g. `prediction`.
   * @param body      The request body.
   */
  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.url$(endpoint).pipe(concatMap(url => this.httpClient.post<T>(url, body)));
  }

  /**
   * Sends a POST request to the given chatflow endpoint and emits the Server-Sent Events of the response.
   *
   * Completes when the stream ends and errors on network/HTTP failures. Streaming only works in the browser.
   *
   * @param endpoint  The Flowise endpoint without the chatflow ID, e.g. `prediction`.
   * @param body      The request body.
   */
  stream(endpoint: string, body: unknown): Observable<CopilotEmbeddedStreamEvent> {
    return this.url$(endpoint).pipe(concatMap(url => this.fetchEventStream(url, body)));
  }

  /**
   * Builds the URL of a chatflow-scoped endpoint from the Copilot Embedded configuration.
   */
  private url$(endpoint: string): Observable<string> {
    return this.copilotEmbeddedFacade.configuration$.pipe(
      whenTruthy(),
      take(1),
      map(config => {
        if (!config.apiHost || !config.chatflowid) {
          throw new Error('Copilot Embedded is not configured (apiHost and chatflowid are required)');
        }
        return `${config.apiHost}/api/v1/${endpoint}/${config.chatflowid}`;
      })
    );
  }

  /**
   * Performs the streaming request via the fetch API and parses the Server-Sent Events.
   */
  private fetchEventStream(url: string, body: unknown): Observable<CopilotEmbeddedStreamEvent> {
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
