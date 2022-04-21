import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, switchMap } from 'rxjs';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { selectRouteParam } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { loadPagelet, loadPageletFail, loadPageletSuccess } from './pagelets.actions';

@Injectable()
export class PageletsEffects {
  constructor(private actions$: Actions, private cmsService: CMSService, private store: Store) {}

  loadPagelet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPagelet),
      mapToPayloadProperty('pageletId'),
      switchMap(pageletId =>
        this.cmsService.getPagelet(pageletId).pipe(
          map(pagelet => loadPageletSuccess({ pagelet })),
          mapErrorToAction(loadPageletFail)
        )
      )
    )
  );

  selectedPagelet$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('pageletId')),
      whenTruthy(),
      map(pageletId => loadPagelet({ pageletId }))
    )
  );
}
