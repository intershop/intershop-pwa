import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

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
      switchMap(({ viewcontextId, callParameters, clientId }) =>
        this.cmsService
          .getViewContextContent(viewcontextId, callParameters, clientId)
          .pipe(map(loadViewContextEntrypointSuccess), mapErrorToAction(loadViewContextEntrypointFail))
      )
    )
  );
}
