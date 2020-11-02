import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { mapErrorToAction, mapToPayload } from 'ish-core/utils/operators';

import {
  loadViewContextEntrypoint,
  loadViewContextEntrypointFail,
  loadViewContextEntrypointSuccess,
} from './viewcontexts.actions';

@Injectable()
export class ViewcontextsEffects {
  constructor(private actions$: Actions, private cmsService: CMSService) {}

  loadViewContextEntrypoint$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadViewContextEntrypoint),
      mapToPayload(),
      concatMap(({ viewContextId, callParameters }) =>
        this.cmsService.getViewContextContent(viewContextId, callParameters).pipe(
          map(({ entrypoint, pagelets }) =>
            loadViewContextEntrypointSuccess({ entrypoint, pagelets, viewContextId, callParameters })
          ),
          mapErrorToAction(loadViewContextEntrypointFail)
        )
      )
    )
  );
}
