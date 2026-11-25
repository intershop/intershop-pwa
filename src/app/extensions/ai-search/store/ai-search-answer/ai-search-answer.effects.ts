import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Action, Store, select } from '@ngrx/store';
import { EMPTY, Observable, concat, defer, merge, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  pairwise,
  startWith,
  switchMap,
  take,
  takeUntil,
  timeout,
  withLatestFrom,
} from 'rxjs/operators';

import { selectRouter } from 'ish-core/store/core/router';
import { RouterState } from 'ish-core/store/core/router/router.reducer';
import { resetUserData } from 'ish-core/store/customer/user';
import { setProductListingPages } from 'ish-core/store/shopping/product-listing';
import { mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { AiSearchAnswerHelper } from '../../models/ai-search-answer/ai-search-answer.helper';
import { AiSearchAnswer } from '../../models/ai-search-answer/ai-search-answer.model';
import { AiSearchService } from '../../services/ai-search/ai-search.service';

import { aiSearchAnswerInternalActions } from './ai-search-answer.actions';
import { AiSearchAnswerState } from './ai-search-answer.reducer';
import { getAiSearchAnswerState, getAiSearchKeptAnswer } from './ai-search-answer.selectors';

/**
 * Time in milliseconds after the search starts within which the AI answer must arrive.
 */
const ANSWER_TIMEOUT = 15000;

/**
 * Suffix of the storage keys of the kept AI answer; `dataRetentionMeta` stores it as `{baseHref}-aiSearch-_keptAnswer`.
 */
const KEPT_ANSWER_STORAGE_KEY_SUFFIX = '-aiSearch-_keptAnswer';

const SEARCH_PAGE_URL = /^\/search\//;

/**
 * A page the buyer navigated to.
 */
interface PageVisit {
  /** URL path without query parameters and fragment. */
  path: string;
  /** The search query, only for a search results page. */
  searchQuery: string;
  /** Whether the page is shown again by a reload or by browser back or forward navigation. */
  restored: boolean;
}

/**
 * Whether the browser loaded the document by a reload or by browser back or forward navigation.
 */
function isRestoredDocument(): boolean {
  const [entry] = (performance?.getEntriesByType?.('navigation') ?? []) as PerformanceNavigationTiming[];
  return entry?.type === 'reload' || entry?.type === 'back_forward';
}

function toPageVisit(state: RouterState, restored: boolean): PageVisit {
  const url = state?.url ?? '';
  const searchQuery = SEARCH_PAGE_URL.test(url) ? state.params?.searchTerm : undefined;
  return { path: url.split(/[?#]/)[0], searchQuery, restored };
}

@Injectable()
export class AiSearchAnswerEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router,
    private aiSearchService: AiSearchService
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
    this.pageVisits$().pipe(
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
   * Removes the kept AI answers under every base href on logout, so the next user of the browser tab cannot see them.
   * The reducer only clears the kept AI answer of the current base href, but the logout applies to the whole site.
   */
  // UC-001 BR-013: The logout deletes the kept AI answer (OQ-028).
  removeKeptAnswersOnLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resetUserData),
        filter(() => !SSR),
        map(() =>
          Array.from({ length: sessionStorage.length }, (_, index) => sessionStorage.key(index))
            .filter(key => key?.endsWith(KEPT_ANSWER_STORAGE_KEY_SUFFIX))
            .forEach(key => sessionStorage.removeItem(key))
        )
      ),
    { dispatch: false }
  );

  /**
   * Emits the pages the buyer navigates to in the browser, starting with the current page when the initial navigation
   * has already ended.
   */
  private pageVisits$(): Observable<PageVisit> {
    return defer(() => {
      if (SSR) {
        return EMPTY;
      }
      const navigationStarts$ = this.router.events.pipe(
        filter((event): event is NavigationStart => event instanceof NavigationStart),
        startWith(undefined as NavigationStart)
      );
      const currentPage$ = this.router.navigated
        ? this.store.pipe(
            select(selectRouter),
            take(1),
            map(router => toPageVisit(router?.state, isRestoredDocument()))
          )
        : EMPTY;
      const navigatedPages$ = this.actions$.pipe(
        ofType(routerNavigatedAction),
        withLatestFrom(navigationStarts$),
        map(([action, lastStart]) => {
          const { id } = action.payload.event;
          const restored =
            id === 1 ? isRestoredDocument() : lastStart?.id === id && lastStart.navigationTrigger === 'popstate';
          return toPageVisit(action.payload.routerState as unknown as RouterState, restored);
        })
      );
      return concat(currentPage$, navigatedPages$);
    });
  }

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
