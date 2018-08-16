import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { map, mapTo, take, tap } from 'rxjs/operators';

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

  /**
   * set available locales on app init
   */
  @Effect()
  loadAllLocales$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION_TYPE),
    take(1),
    mapTo(new fromActions.SetAvailableLocales(this.availableLocales))
  );

  @Effect()
  setFirstAvailableLocale$ = this.actions$.pipe(
    ofType<fromActions.SetAvailableLocales>(fromActions.LocaleActionTypes.SetAvailableLocales),
    map(action => (action.payload && action.payload[0] ? action.payload[0] : undefined)),
    map(locale => new fromActions.SelectLocale(locale))
  );
}
