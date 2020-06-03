import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { EMPTY, combineLatest, iif, interval } from 'rxjs';
import {
  concatMapTo,
  filter,
  first,
  map,
  mapTo,
  mergeMapTo,
  switchMap,
  takeWhile,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { CookiesService } from 'ish-core/services/cookies/cookies.service';
import { LoadBasket, LoadBasketByAPIToken, ResetBasket, getCurrentBasket } from 'ish-core/store/account/basket';
import { LoadOrderByAPIToken, getSelectedOrderId } from 'ish-core/store/account/orders';
import {
  LoadUserByAPIToken,
  LogoutUser,
  UserActionTypes,
  getAPIToken,
  getLoggedInUser,
} from 'ish-core/store/account/user';
import { whenTruthy } from 'ish-core/utils/operators';
import { SfeAdapterService } from 'ish-shared/cms/sfe-adapter/sfe-adapter.service';

interface CookieType {
  apiToken: string;
  type: 'user' | 'basket' | 'order';
  orderId?: string;
}

@Injectable()
export class RestoreEffects {
  static readonly SESSION_KEEP_ALIVE = 600000;
  constructor(
    private actions$: Actions,
    private store$: Store,
    private cookieService: CookiesService,
    @Inject(PLATFORM_ID) private platformId: string,
    private appRef: ApplicationRef,
    private sfeAdapterService: SfeAdapterService
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
  ]).pipe(
    filter(() => isPlatformBrowser(this.platformId)),
    filter(([user, basket, orderId]) => !!user || !!basket || !!orderId),
    map(([user, basket, orderId, apiToken]) =>
      this.makeCookie({ apiToken, type: user ? 'user' : basket ? 'basket' : 'order', orderId })
    ),
    tap(cookie => {
      const options = {
        expires: new Date(Date.now() + 3600000),
        secure: (isPlatformBrowser(this.platformId) && location.protocol === 'https:') || false,
      };
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
  restoreUserOrBasketOrOrderByToken$ = iif(
    () => isPlatformBrowser(this.platformId),
    this.actions$.pipe(
      ofType(routerNavigationAction),
      first(),
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
    )
  );

  @Effect()
  logOutUserIfTokenVanishes$ = this.appRef.isStable.pipe(
    whenTruthy(),
    first(),
    concatMapTo(
      interval(1000).pipe(
        takeWhile(() => isPlatformBrowser(this.platformId)),
        withLatestFrom(this.store$.pipe(select(getLoggedInUser))),
        map(([, user]) => ({ user, apiToken: this.cookieService.get('apiToken') })),
        filter(({ user, apiToken }) => user && !apiToken),
        mapTo(new LogoutUser())
      )
    )
  );

  @Effect()
  removeAnonymousBasketIfTokenVanishes$ = this.appRef.isStable.pipe(
    whenTruthy(),
    first(),
    concatMapTo(
      interval(1000).pipe(
        takeWhile(() => isPlatformBrowser(this.platformId)),
        withLatestFrom(this.store$.pipe(select(getLoggedInUser)), this.store$.pipe(select(getCurrentBasket))),
        map(([, user, basket]) => ({ user, basket, apiToken: this.cookieService.get('apiToken') })),
        filter(({ user, basket, apiToken }) => !user && basket && !apiToken),
        mapTo(new ResetBasket())
      )
    )
  );

  @Effect()
  sessionKeepAlive$ = this.appRef.isStable.pipe(
    filter(() => isPlatformBrowser(this.platformId)),
    whenTruthy(),
    first(),
    concatMapTo(
      this.store$.pipe(
        select(getCurrentBasket),
        switchMap(basket =>
          this.sfeAdapterService.isInitialized()
            ? EMPTY
            : interval(RestoreEffects.SESSION_KEEP_ALIVE).pipe(mergeMapTo(basket ? [new LoadBasket()] : []))
        )
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
