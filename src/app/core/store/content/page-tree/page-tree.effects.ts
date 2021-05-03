import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { mapErrorToAction, mapToPayload } from 'ish-core/utils/operators';

import { loadContentPageTree, loadContentPageTreeFail, loadContentPageTreeSuccess } from './page-tree.actions';

@Injectable()
export class PageTreeEffects {
  constructor(private actions$: Actions, private cmsService: CMSService) {}

  loadContentPageTree$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadContentPageTree),
      mapToPayload(),
      concatMap(({ rootId, depth }) =>
        this.cmsService.getContentPageTree(rootId, depth).pipe(
          map(pagetree => loadContentPageTreeSuccess({ pagetree })),
          mapErrorToAction(loadContentPageTreeFail)
        )
      )
    )
  );
}
