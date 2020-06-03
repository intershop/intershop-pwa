import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, mapTo, mergeMap } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { UserActionTypes } from 'ish-core/store/account/user';
import { selectRouteParam } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import * as pagesActions from './pages.actions';

@Injectable()
export class PagesEffects {
  constructor(private actions$: Actions, private store: Store, private cmsService: CMSService) {}

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
  selectedContentPage$ = this.store.pipe(
    select(selectRouteParam('contentPageId')),
    whenTruthy(),
    map(contentPageId => new pagesActions.LoadContentPage({ contentPageId }))
  );

  @Effect()
  resetContentPagesAfterLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.LogoutUser),
    mapTo(new pagesActions.ResetContentPages())
  );
}
