import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, mapTo, mergeMap } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { selectQueryParam } from 'ish-core/store/router';
import { UserActionTypes } from 'ish-core/store/user';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import * as pagesActions from './pages.actions';

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
  routeListenerForSelectingContentPages$ = this.store.pipe(
    select(selectQueryParam('contentPageId')),
    map(contentPageId => new pagesActions.SelectContentPage({ contentPageId }))
  );

  @Effect()
  selectedContentPage$ = this.actions$.pipe(
    ofType<pagesActions.SelectContentPage>(pagesActions.PagesActionTypes.SelectContentPage),
    mapToPayloadProperty('contentPageId'),
    whenTruthy(),
    map(contentPageId => new pagesActions.LoadContentPage({ contentPageId }))
  );

  @Effect()
  resetContentPagesAfterLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.LogoutUser),
    mapTo(new pagesActions.ResetContentPages())
  );
}
