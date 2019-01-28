import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import * as pagesActions from './pages.actions';

@Injectable()
export class PagesEffects {
  constructor(private actions$: Actions, private cmsService: CMSService) {}

  @Effect()
  loadContentPage$ = this.actions$.pipe(
    ofType<pagesActions.LoadContentPage>(pagesActions.PagesActionTypes.LoadContentPage),
    mapToPayloadProperty('id'),
    mergeMap(id =>
      this.cmsService.getContentPage(id).pipe(
        map(contentPage => new pagesActions.LoadContentPageSuccess(contentPage)),
        mapErrorToAction(pagesActions.LoadContentPageFail)
      )
    )
  );
}
