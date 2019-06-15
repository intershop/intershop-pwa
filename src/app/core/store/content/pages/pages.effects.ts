import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { mapToParam, ofRoute } from 'ngrx-router';
import { filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import * as pagesActions from './pages.actions';
import * as pagesSelectors from './pages.selectors';

@Injectable()
export class PagesEffects {
  constructor(private actions$: Actions, private store: Store<{}>, private cmsService: CMSService) {}

  @Effect()
  loadContentPage$ = this.actions$.pipe(
    ofType<pagesActions.LoadContentPage>(pagesActions.PagesActionTypes.LoadContentPage),
    mapToPayloadProperty('contentPageId'),
    mergeMap(contentPageId =>
      this.cmsService.getContentPage(contentPageId).pipe(
        map(contentPage => new pagesActions.LoadContentPageSuccess(contentPage)),
        mapErrorToAction(pagesActions.LoadContentPageFail)
      )
    )
  );

  @Effect()
  routeListenerForSelectingContentPages$ = this.actions$.pipe(
    ofRoute(),
    mapToParam<string>('contentPageId'),
    withLatestFrom(this.store.pipe(select(pagesSelectors.getSelectedContentPageId))),
    filter(([fromAction, fromStore]) => fromAction !== fromStore),
    map(([contentPageId]) => new pagesActions.SelectContentPage({ contentPageId }))
  );

  @Effect()
  selectedContentPage$ = this.actions$.pipe(
    ofType<pagesActions.SelectContentPage>(pagesActions.PagesActionTypes.SelectContentPage),
    mapToPayloadProperty('contentPageId'),
    whenTruthy(),
    map(contentPageId => new pagesActions.LoadContentPage({ contentPageId }))
  );
}
