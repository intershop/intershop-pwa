import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { identity } from 'rxjs';
import { debounceTime, groupBy, map, mergeMap, switchMap } from 'rxjs/operators';

import { CMSService } from 'ish-core/services/cms/cms.service';
import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
import { delayUntil, mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { loadContentInclude, loadContentIncludeFail, loadContentIncludeSuccess } from './includes.actions';

@Injectable()
export class IncludesEffects {
  constructor(
    private actions$: Actions,
    private cmsService: CMSService
  ) {}

  loadContentInclude$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadContentInclude),
      // an include requested with the apiToken of a user cookie needs the PGID of the restored user
      delayUntil(this.actions$.pipe(ofType(personalizationStatusDetermined))),
      mapToPayloadProperty('includeId'),
      groupBy(identity),
      mergeMap(group$ =>
        group$.pipe(
          debounceTime(0), // the actions released together after personalizationStatusDetermined load the include once
          switchMap(includeId =>
            this.cmsService
              .getContentInclude(includeId)
              .pipe(map(loadContentIncludeSuccess), mapErrorToAction(loadContentIncludeFail))
          )
        )
      )
    )
  );
}
