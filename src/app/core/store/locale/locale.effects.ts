import { Inject, Injectable } from '@angular/core';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { concatMap, map, switchMap, tap } from 'rxjs/operators';
import { log } from '../../../dev-utils/operators';
import { Locale } from '../../../models/locale/locale.interface';
import { AVAILABLE_LOCALES } from '../../configurations/injection-keys';
import * as fromActions from './locale.actions';

@Injectable()
export class LocaleEffects {
  constructor(
    private actions$: Actions,
    private translateService: TranslateService,
    @Inject(AVAILABLE_LOCALES) private availableLocales: Locale[],
  ) { }

  @Effect()
  setLocale$ = this.actions$.pipe(
    ofType(fromActions.LocaleActionTypes.SelectLocale),
    map((action: fromActions.SelectLocale) => action.payload),
    tap(locale => this.translateService.setDefaultLang(locale.lang)),
    concatMap(() => empty())
  );

  @Effect()
  loadAllLocales$ = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    log(),
    switchMap(() => of(new fromActions.SetAvailableLocales(this.availableLocales)))
  );

  @Effect()
  setFirstAvailableLocale$ = this.actions$.pipe(
    ofType(fromActions.LocaleActionTypes.SetAvailableLocales),
    concatMap((action: fromActions.SetAvailableLocales) =>
      of(new fromActions.SelectLocale(action.payload[0])))
  );
}
