import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { Observable, merge, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  pairwise,
  startWith,
  switchMap,
  takeUntil,
  timeout,
  withLatestFrom,
} from 'rxjs/operators';

import { resetUserData } from 'ish-core/store/customer/user';
import { setProductListingPages } from 'ish-core/store/shopping/product-listing';
import { mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { AiSearchAnswerHelper } from '../../models/ai-search-answer/ai-search-answer.helper';
import { AiSearchAnswer } from '../../models/ai-search-answer/ai-search-answer.model';
import { PageVisit } from '../../models/page-visit/page-visit.model';
import { AiSearchService } from '../../services/ai-search/ai-search.service';
import { AiSearchNavigationService } from '../../utils/ai-search-navigation/ai-search-navigation.service';
import { AI_SEARCH_KEPT_ANSWER_STORAGE } from '../ai-search-store';

import { aiSearchAnswerInternalActions } from './ai-search-answer.actions';
import { AiSearchAnswerState } from './ai-search-answer.reducer';
import { getAiSearchAnswerState, getAiSearchKeptAnswer } from './ai-search-answer.selectors';

/**
 * Time in milliseconds after the search starts within which the AI answer must arrive.
 */
const ANSWER_TIMEOUT = 15000;

@Injectable()
export class AiSearchAnswerEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private aiSearchService: AiSearchService,
    private aiSearchNavigationService: AiSearchNavigationService
  ) {}

  // UC-001 BR-002: The AI answer is requested next to the search, which never waits for it.
  loadAnswer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(aiSearchAnswerInternalActions.loadAnswer),
      mapToPayloadProperty('searchQuery'),
      filter(() => !SSR),
      switchMap(searchQuery =>
        this.aiSearchService.getAnswer(searchQuery).pipe(
          // UC-001 BR-003: The AI answer must arrive within 15 seconds after the search starts.
          timeout(ANSWER_TIMEOUT),
          map(answer =>
            AiSearchAnswerHelper.isAnswered(answer)
              ? aiSearchAnswerInternalActions.loadAnswerSuccess({ answer })
              : aiSearchAnswerInternalActions.loadAnswerFail({ searchQuery })
          ),
          catchError(() => of(aiSearchAnswerInternalActions.loadAnswerFail({ searchQuery }))),
          takeUntil(this.answerCancelled$(searchQuery))
        )
      )
    )
  );

  /**
   * Decides on every navigation whether the search results page requests a new AI answer, shows the kept one,
   * keeps the current one, or shows none.
   *
   * Declared after `loadAnswer$`: effects are subscribed in the order of declaration, and when AI Search is loaded
   * after the initial navigation, this effect dispatches for the current page right on subscription.
   */
  triggerAnswer$ = createEffect(() =>
    this.aiSearchNavigationService.pageVisits$().pipe(
      startWith(undefined as PageVisit),
      pairwise(),
      withLatestFrom(this.store.pipe(select(getAiSearchAnswerState)), this.store.pipe(select(getAiSearchKeptAnswer))),
      map(([[previous, current], state, kept]) => this.nextAction(previous, current, state, kept)),
      whenTruthy()
    )
  );

  /**
   * Discards the pending AI answer once the search engine found no product for its search query. The search result
   * decides, not the no-results page: the storefront shows that page briefly before every search starts (OQ-030).
   * A refined product list (filters) without products keeps the AI answer (BR-012).
   */
  // UC-001 BR-011: The no-results page shows no AI answer; its pending AI answer is discarded.
  discardAnswerWithoutProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setProductListingPages),
      mapToPayload(),
      filter(({ id, itemCount }) => id.type === 'search' && !id.filters && !itemCount),
      map(({ id }) => aiSearchAnswerInternalActions.discardAnswer({ searchQuery: id.value }))
    )
  );

  /**
   * Removes the kept AI answers under every base href on logout, so the next user of the browser cannot see them.
   * The reducer only clears the kept AI answer of the current base href, but the logout applies to the whole site.
   * Both storages are searched, because `dataRetention.aiSearch` decides where the kept AI answer is stored.
   */
  // UC-001 BR-013: The logout deletes the kept AI answer (OQ-028).
  removeKeptAnswersOnLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resetUserData),
        filter(() => !SSR),
        map(() => {
          const keySuffix = `-${AI_SEARCH_KEPT_ANSWER_STORAGE.prefix}-${AI_SEARCH_KEPT_ANSWER_STORAGE.key}`;
          [localStorage, sessionStorage].forEach(storage =>
            Array.from({ length: storage.length }, (_, index) => storage.key(index))
              .filter(key => key?.endsWith(keySuffix))
              .forEach(key => storage.removeItem(key))
          );
        })
      ),
    { dispatch: false }
  );

  private nextAction(
    previous: PageVisit,
    current: PageVisit,
    state: AiSearchAnswerState,
    kept: AiSearchAnswer
  ): Action {
    if (!current.searchQuery) {
      // leaving the search results page drops a pending AI answer, which is then never shown or kept
      return state?.searchQuery ? aiSearchAnswerInternalActions.resetAnswer() : undefined;
    }
    const stayed = previous?.path === current.path;
    // UC-001 BR-012: Filtering, sorting, or paging keeps the answer box and requests no new AI answer.
    if (stayed && state?.searchQuery === current.searchQuery) {
      return;
    }
    if (!AiSearchAnswerHelper.isAnswerRequested(current.searchQuery)) {
      return aiSearchAnswerInternalActions.resetAnswer();
    }
    // UC-001 BR-013: A reload, back navigation, or the same search shows the kept AI answer.
    if (kept?.searchQuery === current.searchQuery && kept.text && (current.restored || stayed)) {
      return aiSearchAnswerInternalActions.showKeptAnswer({ answer: kept });
    }
    return aiSearchAnswerInternalActions.loadAnswer({ searchQuery: current.searchQuery });
  }

  private answerCancelled$(searchQuery: string): Observable<unknown> {
    return merge(
      this.actions$.pipe(
        ofType(aiSearchAnswerInternalActions.resetAnswer, aiSearchAnswerInternalActions.showKeptAnswer)
      ),
      this.actions$.pipe(
        ofType(aiSearchAnswerInternalActions.discardAnswer),
        filter(action => action.payload.searchQuery === searchQuery)
      )
    );
  }
}
