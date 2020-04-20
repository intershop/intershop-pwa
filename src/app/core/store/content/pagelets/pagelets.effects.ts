import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mapTo } from 'rxjs/operators';

import { UserActionTypes } from 'ish-core/store/user';

import * as pageletsActions from './pagelets.actions';

@Injectable()
export class PageletsEffects {
  constructor(private actions$: Actions) {}

  @Effect()
  resetPageletsAfterLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.LogoutUser),
    mapTo(new pageletsActions.ResetPagelets())
  );
}
