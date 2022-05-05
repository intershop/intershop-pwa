import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { from } from 'rxjs';
import { concatMap, map, mergeMap } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { loadContentPage, loadContentPageFail, loadContentPageSuccess } from './pages.actions';
import { getBreadcrumbForContentPage } from './pages.selectors';

@Injectable()
export class PagesEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private cmsService: CMSService,
    private httpStatusCodeService: HttpStatusCodeService
  ) {}

  loadContentPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadContentPage),
      mapToPayloadProperty('contentPageId'),
      mergeMap(contentPageId =>
        this.cmsService
          .getContentPage(contentPageId)
          .pipe(map(loadContentPageSuccess), mapErrorToAction(loadContentPageFail))
      )
    )
  );

  redirectIfErrorInContentPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadContentPageFail),
        concatMap(() => from(this.httpStatusCodeService.setStatus(404)))
      ),
    { dispatch: false }
  );

  selectedContentPage$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('contentPageId')),
      whenTruthy(),
      map(contentPageId => loadContentPage({ contentPageId }))
    )
  );

  setBreadcrumbForContentPage$ = createEffect(() =>
    this.store.pipe(select(getBreadcrumbForContentPage)).pipe(
      whenTruthy(),
      map(breadcrumbData => setBreadcrumbData({ breadcrumbData }))
    )
  );
}
