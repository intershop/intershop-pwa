import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { concatMap, filter, map } from 'rxjs/operators';

import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { PunchoutService } from '../../services/punchout/punchout.service';

import { loadPunchoutTypes, loadPunchoutTypesFail, loadPunchoutTypesSuccess } from './punchout-types.actions';

@Injectable()
export class PunchoutTypesEffects {
  constructor(private actions$: Actions, private punchoutService: PunchoutService) {}

  loadPunchoutTypesInitially$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      mapToPayloadProperty('routerState'),
      filter(routerState => /^\/account\/punchout+(?!\/)/.test(routerState.url)),
      map(loadPunchoutTypes)
    )
  );

  loadPunchoutTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPunchoutTypes),
      concatMap(() =>
        this.punchoutService.getPunchoutTypes().pipe(
          map(types => loadPunchoutTypesSuccess({ types })),
          mapErrorToAction(loadPunchoutTypesFail)
        )
      )
    )
  );
}
