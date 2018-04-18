import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { map, tap } from 'rxjs/operators';
import { Locale } from '../../../models/locale/locale.model';
import { AVAILABLE_LOCALES } from '../../configurations/injection-keys';
import * as fromActions from './locale.actions';

@Injectable()
export class LocaleEffects {
  constructor(
    private actions$: Actions,
    private translateService: TranslateService,
    @Inject(AVAILABLE_LOCALES) private availableLocales: Locale[]
  ) {}

  @Effect({ dispatch: false })
  setLocale$ = this.actions$.pipe(
    ofType(fromActions.LocaleActionTypes.SelectLocale),
    map((action: fromActions.SelectLocale) => action.payload.lang),
    tap(lang => this.translateService.use(lang))
  );

  @Effect()
  loadAllLocales$ = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    tap(() => this.translateService.setDefaultLang(this.availableLocales[0].lang)),
    map(() => new fromActions.SetAvailableLocales(this.availableLocales))
  );

  @Effect()
  setFirstAvailableLocale$ = this.actions$.pipe(
    ofType(fromActions.LocaleActionTypes.SetAvailableLocales),
    map(
      (action: fromActions.SetAvailableLocales) =>
        new fromActions.SelectLocale(action.payload && action.payload[0] ? action.payload[0] : null)
    )
  );
}
