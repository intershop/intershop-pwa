import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { getSelectedContentPageBreadcrumbData } from 'ish-core/store/content/page-trees';
import { selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { loadContentPage, loadContentPageFail, loadContentPageSuccess } from './pages.actions';
import { getSelectedContentPage } from './pages.selectors';

@Injectable()
export class PagesEffects {
  constructor(private actions$: Actions, private store: Store, private cmsService: CMSService) {}

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

  selectedContentPage$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('contentPageId')),
      whenTruthy(),
      map(contentPageId => loadContentPage({ contentPageId }))
    )
  );

  setBreadcrumbForContentPage1$ = createEffect(() =>
    combineLatest([
      this.store.pipe(select(getSelectedContentPage)),
      this.store.pipe(select(getSelectedContentPageBreadcrumbData)),
    ]).pipe(
      whenTruthy(),
      filter(([contentPage]) => !!contentPage),
      map(([contentPage, breadcrumbData]) =>
        breadcrumbData
          ? setBreadcrumbData({ breadcrumbData })
          : setBreadcrumbData({ breadcrumbData: [{ key: contentPage.displayName }] })
      )
    )
  );
}
