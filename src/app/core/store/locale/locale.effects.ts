import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { filter, map, mapTo, mergeMapTo, take, tap } from 'rxjs/operators';

import { Locale } from '../../../models/locale/locale.model';
import { AVAILABLE_LOCALES } from '../../configurations/injection-keys';

import * as fromActions from './locale.actions';
import { getAvailableLocales, getCurrentLocale } from './locale.selectors';

@Injectable()
export class LocaleEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private translateService: TranslateService,
    @Inject(AVAILABLE_LOCALES) private availableLocales: Locale[]
  ) {}

  @Effect({ dispatch: false })
  setLocale$ = this.store.pipe(
    select(getCurrentLocale),
    filter(locale => !!locale && !!locale.lang),
    map(locale => locale.lang),
    tap(lang => this.translateService.use(lang))
  );

  /**
   * set available locales on app init
   */
  @Effect()
  loadAllLocales$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION_TYPE),
    take(1),
    mergeMapTo(this.store.pipe(select(getAvailableLocales), filter(locales => !locales.length))),
    mapTo(new fromActions.SetAvailableLocales(this.availableLocales))
  );

  @Effect()
  setFirstAvailableLocale$ = this.actions$.pipe(
    ofType<fromActions.SetAvailableLocales>(fromActions.LocaleActionTypes.SetAvailableLocales),
    map(action => (action.payload && action.payload[0] ? action.payload[0] : undefined)),
    map(locale => new fromActions.SelectLocale(locale))
  );
}
