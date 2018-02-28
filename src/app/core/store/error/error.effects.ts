import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { concatMap, filter, map, switchMap, tap } from 'rxjs/operators';
import { Locale } from '../../../models/locale/locale.interface';
import { AVAILABLE_LOCALES } from '../../configurations/injection-keys';
import * as fromActions from './error.actions';

@Injectable()
export class ErrorEffects {
  constructor(
    private actions$: Actions
  ) { }

  @Effect()
  timeout$ = this.actions$.pipe(
    ofType(fromActions.ErrorActionTypes.generalError),
    filter((action: fromActions.GeneralError) => action.error && (action.error.payload.status === 0)),
    switchMap((action) => of(new fromActions.CommunicationTimeoutError(action.error)))

  );


}
