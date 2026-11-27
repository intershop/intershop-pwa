import { Injectable } from '@angular/core';
import { Observable, combineLatest, throwError } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

import { AiSearchAnswerData } from '../../models/ai-search-answer/ai-search-answer.interface';
import { AiSearchAnswerMapper } from '../../models/ai-search-answer/ai-search-answer.mapper';
import { AiSearchAnswer } from '../../models/ai-search-answer/ai-search-answer.model';
import { AiSearchApiService } from '../ai-search-api/ai-search-api.service';

/**
 * Request body of the Flowise Prediction API.
 */
interface PredictionRequestBody {
  question: string;
  streaming: false;
  overrideConfig: {
    vars: Record<string, unknown>;
  };
}

/**
 * The AI Search Service requests the AI answer to a search query from the AI Search chatflow.
 *
 * The chatflow receives the search query as question and the language of the storefront and the customer account
 * context as chatflow variables (`overrideConfig.vars`), nothing else.
 */
@Injectable({ providedIn: 'root' })
export class AiSearchService {
  constructor(
    private aiSearchApiService: AiSearchApiService,
    private appFacade: AppFacade,
    private accountFacade: AccountFacade,
    private apiTokenService: ApiTokenService
  ) {}

  /**
   * Requests the AI answer to a search query.
   *
   * @param searchQuery The search query of the buyer.
   * @returns           Emits the AI answer once; the text is empty when the chatflow returns no AI answer.
   */
  // UC-001 BR-014: The AI answer is requested without asking the buyer for a consent of its own.
  getAnswer(searchQuery: string): Observable<AiSearchAnswer> {
    if (!searchQuery) {
      return throwError(() => new Error('getAnswer() called without searchQuery'));
    }

    return this.vars$().pipe(
      map((vars): PredictionRequestBody => ({ question: searchQuery, streaming: false, overrideConfig: { vars } })),
      concatMap(body => this.aiSearchApiService.post<AiSearchAnswerData>('prediction', body)),
      map(data => AiSearchAnswerMapper.fromData(data, searchQuery))
    );
  }

  // UC-001 BR-004: Storefront language always; customer account context only when signed in.
  // UC-001 BR-005: AI Search receives no search engine specific data.
  private vars$(): Observable<Record<string, unknown>> {
    return combineLatest([
      this.appFacade.currentLocale$,
      this.accountFacade.isLoggedIn$,
      this.apiTokenService.apiToken$,
    ]).pipe(
      take(1),
      map(([currentLocale, loggedIn, userToken]) => ({
        currentLocale,
        ...(loggedIn && userToken ? { user_token: userToken } : {}),
      }))
    );
  }
}
