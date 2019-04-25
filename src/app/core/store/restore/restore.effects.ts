import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { CookiesService } from '@ngx-utils/cookies';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, take, takeWhile, tap } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';
import { LoadBasketByAPIToken, getCurrentBasket } from '../checkout/basket';
import { LoadUserByAPIToken, UserActionTypes, getAPIToken, getLoggedInUser } from '../user';

export class RestoreEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<{}>,
    private router: Router,
    private cookieService: CookiesService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  @Effect({ dispatch: false })
  saveAPITokenToCookie$ = combineLatest(
    this.store$.pipe(select(getLoggedInUser)),
    this.store$.pipe(select(getCurrentBasket)),
    this.store$.pipe(select(getAPIToken))
  ).pipe(
    takeWhile(() => isPlatformBrowser(this.platformId)),
    filter(([user, basket]) => !!user || !!basket),
    map(([user, , apiToken]) => this.makeCookie(apiToken, user ? 'user' : 'basket')),
    distinctUntilChanged(),
    tap(cookie => {
      const options = { expires: new Date(Date.now() + 3600000) };
      this.cookieService.put('apiToken', cookie, options);
    })
  );

  @Effect({ dispatch: false })
  destroyTokenInCookieOnLogout$ = this.actions$.pipe(
    takeWhile(() => isPlatformBrowser(this.platformId)),
    ofType(UserActionTypes.LogoutUser),
    tap(() => {
      this.cookieService.remove('apiToken');
    })
  );

  @Effect()
  restoreUserOrBasketByToken$ = this.router.events.pipe(
    takeWhile(() => isPlatformBrowser(this.platformId)),
    filter(event => event instanceof NavigationStart),
    take(1),
    map(() => this.cookieService.get('apiToken')),
    whenTruthy(),
    map(c => this.parseCookie(c)),
    map(cookie =>
      cookie.type === 'basket'
        ? new LoadBasketByAPIToken({ apiToken: cookie.apiToken })
        : new LoadUserByAPIToken({ apiToken: cookie.apiToken })
    )
  );

  private makeCookie(apiToken: string, type: 'user' | 'basket'): string {
    return apiToken ? JSON.stringify({ apiToken, type }) : undefined;
  }

  private parseCookie(cookie: string) {
    return JSON.parse(cookie) as { apiToken: string; type: 'user' | 'basket' };
  }
}
