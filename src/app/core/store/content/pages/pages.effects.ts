import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, mergeMap } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { selectRouteParam } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { LoadContentPage, LoadContentPageFail, LoadContentPageSuccess, PagesActionTypes } from './pages.actions';

@Injectable()
export class PagesEffects {
  constructor(private actions$: Actions, private store: Store, private cmsService: CMSService) {}

  @Effect()
  loadContentPage$ = this.actions$.pipe(
    ofType<LoadContentPage>(PagesActionTypes.LoadContentPage),
    mapToPayloadProperty('contentPageId'),
    mergeMap(contentPageId =>
      this.cmsService.getContentPage(contentPageId).pipe(
        map(contentPage => new LoadContentPageSuccess(contentPage)),
        mapErrorToAction(LoadContentPageFail)
      )
    )
  );

  @Effect()
  selectedContentPage$ = this.store.pipe(
    select(selectRouteParam('contentPageId')),
    whenTruthy(),
    map(contentPageId => new LoadContentPage({ contentPageId }))
  );
}
