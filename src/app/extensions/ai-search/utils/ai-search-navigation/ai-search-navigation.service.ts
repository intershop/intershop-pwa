import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { EMPTY, Observable, concat, defer } from 'rxjs';
import { filter, map, startWith, take, withLatestFrom } from 'rxjs/operators';

import { selectRouter } from 'ish-core/store/core/router';
import { RouterState } from 'ish-core/store/core/router/router.reducer';

import { PageVisit } from '../../models/page-visit/page-visit.model';

/**
 * Whether the browser loaded the document by a reload or by browser back or forward navigation.
 */
function isRestoredDocument(): boolean {
  const [entry] = (performance?.getEntriesByType?.('navigation') ?? []) as PerformanceNavigationTiming[];
  return entry?.type === 'reload' || entry?.type === 'back_forward';
}

function toPageVisit(state: RouterState, restored: boolean): PageVisit {
  const url = state?.url ?? '';
  const searchQuery = url.startsWith('/search/') ? state.params?.searchTerm : undefined;
  return { path: url.split(/[?#]/)[0], searchQuery, restored };
}

/**
 * The AI Search Navigation Service tells which pages the buyer navigates to and whether the browser shows a page
 * again by a reload or by browser back or forward navigation.
 */
@Injectable({ providedIn: 'root' })
export class AiSearchNavigationService {
  constructor(
    private actions$: Actions,
    private store: Store,
    private router: Router
  ) {}

  /**
   * Emits the pages the buyer navigates to in the browser, starting with the current page when the initial navigation
   * has already ended. Emits nothing during server-side rendering.
   */
  pageVisits$(): Observable<PageVisit> {
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
}
