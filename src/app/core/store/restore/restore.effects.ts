import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { combineLatest, interval } from 'rxjs';
import { filter, map, mapTo, switchMap, take, takeWhile, tap, withLatestFrom } from 'rxjs/operators';

import { CookiesService } from 'ish-core/services/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';
import { LoadBasketByAPIToken, getCurrentBasket } from '../checkout/basket';
import { LoadOrderByAPIToken, getSelectedOrderId } from '../orders';
import { LoadUserByAPIToken, LogoutUser, UserActionTypes, getAPIToken, getLoggedInUser } from '../user';

interface CookieType {
  apiToken: string;
  type: 'user' | 'basket' | 'order';
  orderId?: string;
}

export class RestoreEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<{}>,
    private router: Router,
    private cookieService: CookiesService,
    @Inject(PLATFORM_ID) private platformId: string,
    private appRef: ApplicationRef
  ) {}

  /**
   * Saves the latest API token with a type information as a cookie in case there is a logged in user, a basket or a selected order.
   * type = user: API token is used to restore the user login.
   * type = basket: API token is used to restore the basket of an anonymous user.
   * type = order: API token is used to restore the just created order after coming back from redirect after checkout ( the orderId is also part of the cookie).
   */
  @Effect({ dispatch: false })
  saveAPITokenToCookie$ = combineLatest([
    this.store$.pipe(select(getLoggedInUser)),
    this.store$.pipe(select(getCurrentBasket)),
    this.store$.pipe(select(getSelectedOrderId)),
    this.store$.pipe(select(getAPIToken)),
    this.cookieService.cookieLawSeen$,
  ]).pipe(
    filter(([user, basket, orderId]) => !!user || !!basket || !!orderId),
    map(([user, basket, orderId, apiToken]) =>
      this.makeCookie({ apiToken, type: user ? 'user' : basket ? 'basket' : 'order', orderId })
    ),
    tap(cookie => {
      const options = { expires: new Date(Date.now() + 3600000) };
      this.cookieService.put('apiToken', cookie, options);
    })
  );

  @Effect({ dispatch: false })
  destroyTokenInCookieOnLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.LogoutUser),
    tap(() => {
      this.cookieService.remove('apiToken');
    })
  );

  /**
   * Triggers actions to restore a user login, a basket or an order based on previously set cookie (see also effect saveAPITokenToCookie$).
   */
  @Effect()
  restoreUserOrBasketOrOrderByToken$ = this.router.events.pipe(
    filter(event => event instanceof NavigationStart),
    take(1),
    map(() => this.cookieService.get('apiToken')),
    whenTruthy(),
    map(c => this.parseCookie(c)),
    map(cookie => {
      switch (cookie.type) {
        case 'basket': {
          return new LoadBasketByAPIToken({ apiToken: cookie.apiToken });
        }
        case 'user': {
          return new LoadUserByAPIToken({ apiToken: cookie.apiToken });
        }
        case 'order': {
          return new LoadOrderByAPIToken({ orderId: cookie.orderId, apiToken: cookie.apiToken });
        }
      }
    })
  );

  @Effect()
  logOutUserIfTokenVanishes$ = this.appRef.isStable.pipe(
    whenTruthy(),
    take(1),
    switchMap(() =>
      interval(1000).pipe(
        takeWhile(() => isPlatformBrowser(this.platformId)),
        withLatestFrom(this.store$.pipe(select(getLoggedInUser)), this.cookieService.cookieLawSeen$),
        filter(([, , cookieLawAccepted]) => cookieLawAccepted),
        map(([, user]) => ({ user, apiToken: this.cookieService.get('apiToken') })),
        filter(({ user, apiToken }) => user && !apiToken),
        mapTo(new LogoutUser())
      )
    )
  );

  private makeCookie(cookie: CookieType): string {
    return cookie && cookie.apiToken
      ? JSON.stringify({ apiToken: cookie.apiToken, type: cookie.type, orderId: cookie.orderId })
      : undefined;
  }

  private parseCookie(cookie: string) {
    return JSON.parse(cookie) as CookieType;
  }
}
