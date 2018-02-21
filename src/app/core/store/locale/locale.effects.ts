import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { empty } from 'rxjs/observable/empty';
import { concatMap, map, tap } from 'rxjs/operators';
import * as fromActions from './locale.actions';

@Injectable()
export class LocaleEffects {
  constructor(
    private actions$: Actions,
    private translateService: TranslateService
  ) { }

  @Effect()
  setLocale$ = this.actions$.pipe(
    ofType(fromActions.LocaleActionTypes.SelectLocale),
    map((action: fromActions.SelectLocale) => action.payload),
    tap(locale => this.translateService.setDefaultLang(locale.lang)),
    concatMap(() => empty())
  );
}
