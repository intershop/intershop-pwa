/* eslint-disable ish-custom-rules/no-intelligence-in-artifacts */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { isEqual } from 'lodash-es';
import { concatMap, debounceTime, distinctUntilChanged, filter, map, skip, take, tap } from 'rxjs';

import { InstantSearchFacade } from 'ish-core/facades/instant-search.facade';
import { setDefaultInstantSearchQuery, setInstantSearchHeader } from 'ish-core/store/core/viewconf';
import { mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { setProductListing } from './solr-instant-search.action';

@Injectable()
export class SolrInstantSearchEffects {
  constructor(private actions$: Actions, private instantSearchFacade: InstantSearchFacade) {}

  firstInstantSearchOnNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      mapToPayloadProperty('routerState'),
      take(1),
      map(state => new URL(`http://host${state.url}`)),
      map(url => this.determineSearchTermFromURL(url)),
      concatMap(searchTerm =>
        searchTerm
          ? [
              setInstantSearchHeader({ instantSearch: true }),
              setDefaultInstantSearchQuery({ instantSearchQuery: searchTerm }),
            ]
          : [setInstantSearchHeader({ instantSearch: false })]
      )
    )
  );

  instantSearchOnNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      mapToPayloadProperty('routerState'),
      map(state => new URL(`http://host${state.url}`)),
      map(url => url.pathname),
      distinctUntilChanged(),
      skip(1),
      map(() => setInstantSearchHeader({ instantSearch: false }))
    )
  );

  reloadSearchOnInstantSearch$ = createEffect(() =>
    this.instantSearchFacade.select('query').pipe(
      whenTruthy(),
      filter(query => query?.length > 2),
      debounceTime(1000),
      distinctUntilChanged((a, b) => isEqual(a?.trim(), b?.trim())),
      tap(searchTeam => this.patchURLOnBrowser(searchTeam)),
      map(searchTerm => setProductListing({ productListingID: { type: 'search', value: searchTerm } }))
    )
  );

  private determineSearchTermFromURL(url: URL) {
    const searchTermMatcher = /searchTerm=([^&]+)/;
    const filters = url.searchParams.get('filters');

    if (filters) {
      const matches = searchTermMatcher.exec(filters);
      if (matches && matches.length > 1) {
        return decodeURIComponent(matches[1]);
      }
    }
  }

  private patchURLOnBrowser(searchTerm: string) {
    if (SSR) {
      return;
    }
    const url = new URL(window.document.URL);
    const filters = url.searchParams.get('filters');
    if (filters) {
      const searchTermMatcher = /(searchTerm=)([^&]+)/;

      if (searchTermMatcher.test(filters)) {
        url.searchParams.set('filters', filters.replace(searchTermMatcher, `$1${encodeURIComponent(searchTerm)}`));
      } else {
        url.searchParams.set('filters', `searchTerm=${encodeURIComponent(searchTerm)}&${filters}`);
      }
    } else {
      url.searchParams.set('filters', `searchTerm=${encodeURIComponent(searchTerm)}`);
    }

    window.history.replaceState(undefined, '', url.toString());
  }
}
