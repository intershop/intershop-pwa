import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, mergeMap } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { selectRouteParam } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { loadContentPageTree, loadContentPageTreeFail, loadContentPageTreeSuccess } from './page-trees.actions';

@Injectable()
export class PageTreesEffects {
  constructor(private actions$: Actions, private store: Store, private cmsService: CMSService) {}

  loadContentPageTree$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadContentPageTree),
      mapToPayloadProperty('contentPageId'),
      mergeMap(contentPageId =>
        this.cmsService.getContentPageTree(contentPageId).pipe(
          map(tree =>
            !tree.parent
              ? loadContentPageTreeSuccess({ tree })
              : loadContentPageTree({ contentPageId: tree.path[0].itemId })
          ),
          mapErrorToAction(loadContentPageTreeFail)
        )
      )
    )
  );

  selectedContentPage$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('contentPageId')),
      whenTruthy(),
      map(contentPageId => loadContentPageTree({ contentPageId }))
    )
  );
}
