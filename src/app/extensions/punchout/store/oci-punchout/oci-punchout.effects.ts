import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';

import { mapErrorToAction } from 'ish-core/utils/operators';

import { PunchoutService } from '../../services/punchout/punchout.service';

import { loadPunchoutUsers, loadPunchoutUsersFail, loadPunchoutUsersSuccess } from './oci-punchout.actions';

@Injectable()
export class OciPunchoutEffects {
  constructor(private punchoutService: PunchoutService, private actions$: Actions) {}

  loadPunchoutUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPunchoutUsers),
      mergeMap(() =>
        this.punchoutService.getUsers().pipe(
          map(users => loadPunchoutUsersSuccess({ users })),
          mapErrorToAction(loadPunchoutUsersFail)
        )
      )
    )
  );
}
