import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { filter, switchMap } from 'rxjs/operators';
import * as fromActions from './error.actions';

@Injectable()
export class ErrorEffects {
  constructor(
    private actions$: Actions
  ) { }

  @Effect()
  timeout$ = this.actions$.pipe(
    ofType(fromActions.ErrorActionTypes.generalError),
    filter((action: fromActions.GeneralError) => action.error && (action.error.status === 0)),
    switchMap((action) => of(new fromActions.CommunicationTimeoutError(action.error)))

  );


}
