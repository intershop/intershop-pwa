import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { from } from 'rxjs';
import { concatMap, map, mergeMap, switchMap } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';
import {
  mapErrorToAction,
  mapToPayloadProperty,
  useCombinedObservableOnAction,
  whenTruthy,
} from 'ish-core/utils/operators';

import {
  loadContentPage,
  loadContentPageFail,
  loadContentPageSuccess,
  setBreadcrumbForContentPage,
} from './pages.actions';
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
      useCombinedObservableOnAction(this.actions$.pipe(ofType(loadContentPage)), personalizationStatusDetermined),
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
    this.actions$.pipe(
      ofType(setBreadcrumbForContentPage),
      mapToPayloadProperty('rootId'),
      // eslint-disable-next-line rxjs/no-unsafe-switchmap
      switchMap(rootId =>
        this.store.pipe(
          select(getBreadcrumbForContentPage(rootId)),
          map(breadcrumbData => setBreadcrumbData({ breadcrumbData }))
        )
      )
    )
  );
}
