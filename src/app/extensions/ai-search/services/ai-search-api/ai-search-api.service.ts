import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { AiSearchFacade } from '../../facades/ai-search.facade';

/**
 * The AI Search API Service handles the HTTP interaction with the Flowise API of the AI Search chatflow.
 *
 * Every request targets a chatflow-scoped endpoint `{apiHost}/api/v1/{endpoint}/{chatflowid}`; `apiHost` and
 * `chatflowid` are read from the AI Search configuration.
 */
@Injectable({ providedIn: 'root' })
export class AiSearchApiService {
  constructor(
    private httpClient: HttpClient,
    private aiSearchFacade: AiSearchFacade
  ) {}

  /**
   * Sends a POST request to the given chatflow endpoint.
   *
   * Errors when AI Search is enabled without its configuration.
   *
   * @param endpoint  The Flowise endpoint without the chatflow ID, e.g. `prediction`.
   * @param body      The request body.
   */
  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.url$(endpoint).pipe(concatMap(url => this.httpClient.post<T>(url, body)));
  }

  private url$(endpoint: string): Observable<string> {
    return this.aiSearchFacade.configuration$.pipe(
      whenTruthy(),
      take(1),
      map(config => {
        if (!config.apiHost || !config.chatflowid) {
          throw new Error('AI Search is not configured (apiHost and chatflowid are required)');
        }
        return `${config.apiHost}/api/v1/${endpoint}/${config.chatflowid}`;
      })
    );
  }
}
