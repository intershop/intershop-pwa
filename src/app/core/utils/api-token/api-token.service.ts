import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { ApplicationRef, DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Selector, Store, select } from '@ngrx/store';
import { CookieOptions } from 'express';
import { isEqual } from 'lodash-es';
import {
  BehaviorSubject,
  Observable,
  OperatorFunction,
  Subject,
  combineLatest,
  iif,
  interval,
  noop,
  of,
  race,
  throwError,
  timer,
} from 'rxjs';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  filter,
  first,
  map,
  mergeMap,
  pairwise,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { BasketView } from 'ish-core/models/basket/basket.model';
import { HttpErrorHelper } from 'ish-core/models/http-error/http-error.helper';
import { TokenHelper } from 'ish-core/models/token/token.helper';
import { User } from 'ish-core/models/user/user.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getCurrentBasket, getCurrentBasketId, loadBasketByAPIToken } from 'ish-core/store/customer/basket';
import { getOrder, getSelectedOrderId, loadOrderByAPIToken } from 'ish-core/store/customer/orders';
import {
  fetchAnonymousUserToken,
  getLoggedInUser,
  getUserAuthorized,
  loadUserByAPIToken,
} from 'ish-core/store/customer/user';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';

type ApiTokenCookieType = 'order' | 'user';

export interface ApiTokenCookie {
  // the refresh token, since the ICM accepts only refresh tokens to restore the session after a reload
  apiToken: string;
  type: ApiTokenCookieType;
  isAnonymous?: boolean;
  orderId?: string;
  creator?: string;
}

// If no expiry date is supplied by the token endpoint, this value (in ms) is used
const DEFAULT_EXPIRY_TIME = 3600000;

@Injectable({ providedIn: 'root' })
export class ApiTokenService {
  /** stores the current access token, will be used to add authentication header for each request */
  apiToken$: BehaviorSubject<string>;

  /** refresh token belonging to the current access token, will be saved as apiToken in the apiToken cookie */
  private refreshToken: string;

  /** informs subscriber that cookie is unexpectedly removed (e.g. logout from another tab) */
  private cookieVanishes$ = new Subject<ApiTokenCookieType>();

  /** cookie options which are used to store apiToken cookie, will be overwritten by setApiToken() method */
  private cookieOptions: CookieOptions = {};

  /**
   * informs subscriber (e.g. restore$()) with value from initial apiToken cookie,
   * is used by tokenCreatedOnAnotherTab() method to trigger restore$() method again
   */
  private initialCookie$: BehaviorSubject<ApiTokenCookie>;

  /** informs subscriber whenever an apiToken has been changed */
  private cookieChangeEvent$: Observable<[ApiTokenCookie, ApiTokenCookie]>;

  constructor(
    private cookiesService: CookiesService,
    private store: Store,
    private appRef: ApplicationRef
  ) {
    // setup initial values
    // the apiToken of the cookie is a refresh token, requests are sent without authentication until restore$() fetched new tokens
    const initialCookie = this.parseCookie();
    this.initialCookie$ = new BehaviorSubject<ApiTokenCookie>(!SSR ? initialCookie : undefined);
    this.apiToken$ = new BehaviorSubject<string>(undefined);

    if (!SSR) {
      const destroyRef = inject(DestroyRef);

      // a cookie without apiToken (e.g. with invalid content) cannot be restored
      if (!initialCookie && this.cookiesService.get('apiToken')) {
        this.removeApiTokenCookie();
      }

      // multicast apiTokenCookieChange$ to avoid multiple listeners
      this.cookieChangeEvent$ = this.apiTokenCookieChange$().pipe(shareReplay(1));

      // save internal calculated apiToken as cookie whenever apiToken, basket, user or order information changes
      this.calculateApiTokenCookieValueOnChanges$()
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe(apiToken => {
          const cookieContent = apiToken?.apiToken ? JSON.stringify(apiToken) : undefined;
          if (cookieContent) {
            this.cookiesService.put('apiToken', cookieContent, {
              expires: this.cookieOptions?.expires ?? new Date(Date.now() + DEFAULT_EXPIRY_TIME),
              secure: this.cookieOptions?.secure,
              path: '/',
            });
          }
        });

      // remove apiToken cookie on logout
      this.logoutUser$()
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe(() => this.removeApiTokenCookie());

      // unset apiToken when cookie vanishes/ has been removed unexpectedly and notify public event stream
      this.tokenVanish$()
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe(type => {
          this.removeApiToken();
          this.cookieVanishes$.next(type);
        });

      // initialize restore$ mechanism when apiToken cookie is created outside of current PWA context (e.g. login in another tab)
      this.tokenCreatedOnAnotherTab$().pipe(takeUntilDestroyed(destroyRef)).subscribe(noop);
    }
  }

  getApiToken$(): Observable<string> {
    return this.apiToken$.asObservable();
  }

  /**
   * removes the current apiToken from memory, so it is no longer sent with requests
   *
   * The apiToken cookie is not removed, because it is shared with other tabs.
   * It is removed on logout, by invalidateApiToken() or by discardApiToken().
   */
  removeApiToken() {
    this.refreshToken = undefined;
    this.apiToken$.next(undefined);
  }

  /**
   * sets the tokens of a new token response
   *
   * @param accessToken   authenticates the subsequent requests, it is kept in memory only
   * @param options       options (expires, secure) of the apiToken cookie, without them the previous options are kept
   * @param refreshToken  saved as apiToken in the apiToken cookie to restore the session after a reload,
   *                      without it no apiToken cookie is saved
   */
  setApiToken(accessToken: string, options?: CookieOptions, refreshToken?: string) {
    if (options) {
      this.cookieOptions = options;
    }
    this.refreshToken = refreshToken;
    // the refresh token is set first, since sessionRefreshToken$() reads it on the new access token
    this.apiToken$.next(accessToken);
  }

  hasUserApiTokenCookie() {
    const apiTokenCookie = this.parseCookie();
    return apiTokenCookie?.type === 'user' && !apiTokenCookie?.isAnonymous;
  }

  /** trigger actions to restore store information based on initial apiToken cookie, the actions fetch new tokens with the refresh token of the cookie */
  restore$(types: ApiTokenCookieType[] = ['user', 'order']): Observable<boolean> {
    if (SSR) {
      return of(true);
    }
    return this.initialCookie$.pipe(
      first(),
      switchMap(cookie => {
        if (types.includes(cookie?.type)) {
          switch (cookie?.type) {
            case 'user': {
              if (cookie.isAnonymous) {
                this.store.dispatch(loadBasketByAPIToken({ apiToken: cookie.apiToken }));
                // wait until basket infos are loaded
                return this.waitForStoreValue$(getCurrentBasketId);
              } else {
                this.store.dispatch(loadUserByAPIToken({ apiToken: cookie.apiToken }));
                // wait until user is logged in
                return this.waitForStoreValue$(getUserAuthorized);
              }
            }
            case 'order': {
              this.store.dispatch(loadOrderByAPIToken({ orderId: cookie.orderId, apiToken: cookie.apiToken }));
              // wait until order is loaded
              return this.waitForStoreValue$(getOrder(cookie.orderId));
            }
          }
        }
        return of(true);
      })
    );
  }

  /**
   * removes the current apiToken and the apiToken cookie of a previous session without logging out the user on server side,
   * e.g. before a user is logged in with the login information provided by the identity provider (punchout, co-browse)
   */
  discardApiToken() {
    // the apiToken is removed before the cookie, so that the cookie removal is not handled as an unexpected cookie vanish
    this.removeApiToken();
    this.removeApiTokenCookie();
    // the discarded session must not be restored
    this.initialCookie$.next(undefined);
  }

  /**
   * removes the current apiToken that is no longer valid (e.g. rejected by the ICM or the token refresh failed)
   * and informs cookieVanishes$ listeners that the cookie is not working as expected
   *
   * @param rejectedToken  the access or refresh token rejected by the ICM, e.g. the refresh token of the cookie on restore,
   *                       a rejected token that has already been replaced is ignored
   */
  invalidateApiToken(rejectedToken?: string) {
    // eslint-disable-next-line rxjs/no-subject-value
    const apiToken = this.apiToken$.value;

    // the rejected token has already been replaced, e.g. by a login or a token refresh
    if (rejectedToken && (apiToken || this.refreshToken) && ![apiToken, this.refreshToken].includes(rejectedToken)) {
      return;
    }

    const cookie = this.parseCookie();
    // without current tokens (e.g. on restore) the rejected token is the refresh token of the cookie
    const refreshToken = this.refreshToken ?? rejectedToken;

    this.removeApiToken();

    if (cookie) {
      // the cookie may already contain new valid tokens of another tab
      if (refreshToken && cookie.apiToken === refreshToken) {
        this.removeApiTokenCookie();
        // the invalid apiToken must not be restored
        this.initialCookie$.next(undefined);
      }
      this.cookieVanishes$.next(cookie.type);
    }
  }

  getCookieVanishes$(): Observable<ApiTokenCookieType> {
    return this.cookieVanishes$.asObservable();
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return iif(
      () => req.url.endsWith('/baskets') && req.method === 'POST', // only on basket creation an anonymous user token can be created
      this.anonymousUserTokenMechanism(),
      of(true)
    ).pipe(
      switchMap(() =>
        this.appendAuthenticationHeader(req).pipe(
          concatMap(request =>
            next.handle(request).pipe(
              map(event => {
                // remove id_token from /token response
                // TODO: remove http request body adaptions if correct id_tokens are returned
                if (event instanceof HttpResponse && TokenHelper.isTokenGrant(request)) {
                  return event.clone({
                    body: {
                      ...event.body,
                      id_token: undefined,
                    },
                  });
                }
                return event;
              }),
              catchError(err => {
                // token grants are sent without authentication header and are not retried,
                // a rejected refresh with the refresh token of the cookie removes the cookie below
                if (HttpErrorHelper.isAuthTokenError(err) && !TokenHelper.isTokenGrant(request)) {
                  this.invalidateApiToken(request.headers.get(ApiService.TOKEN_HEADER_KEY));

                  // retry request without auth token, a replacing apiToken might belong to another user
                  const retryRequest = request.clone({
                    headers: request.headers.delete(ApiService.TOKEN_HEADER_KEY),
                  });
                  // timer introduced for testability
                  return timer(500).pipe(switchMap(() => next.handle(retryRequest)));
                }
                const rejectedCookieToken = this.getRejectedCookieTokenOfRefresh(request, err);
                if (rejectedCookieToken) {
                  this.invalidateApiToken(rejectedCookieToken);
                }
                return throwError(() => err);
              })
            )
          )
        )
      )
    );
  }

  /** emits true as soon as the selected store value is truthy, or false after a timeout of 5 seconds */
  private waitForStoreValue$(selector: Selector<object, unknown>): Observable<boolean> {
    return race(
      this.store.pipe(
        select(selector),
        whenTruthy(),
        take(1),
        map(() => true)
      ),
      timer(5000).pipe(map(() => false))
    );
  }

  /**
   * returns the refresh token of the cookie if the ICM rejected the token refresh with it (e.g. on restore),
   * network or server errors do not indicate an invalid refresh token
   */
  private getRejectedCookieTokenOfRefresh(req: HttpRequest<unknown>, err: unknown): string {
    if (!(err instanceof HttpErrorResponse) || !HttpErrorHelper.isRejectedTokenRefresh(err.status)) {
      return;
    }
    const refreshToken = TokenHelper.getRefreshToken(req);
    return refreshToken && refreshToken === this.parseCookie()?.apiToken ? refreshToken : undefined;
  }

  /**
   * append authentication header to current request in case an apiToken is available and specific header was not set before,
   * token grants are sent without it, since the access token is not needed to fetch new tokens
   */
  private appendAuthenticationHeader(req: HttpRequest<unknown>): Observable<HttpRequest<unknown>> {
    return this.apiToken$.pipe(
      map(apiToken =>
        apiToken && !req.headers?.has(ApiService.TOKEN_HEADER_KEY) && !TokenHelper.isTokenGrant(req)
          ? req.clone({ headers: req.headers.set(ApiService.TOKEN_HEADER_KEY, apiToken) })
          : req
      ),
      first()
    );
  }

  /** process to trigger action to fetch anonymous user token and wait until apiToken is set in service */
  private anonymousUserTokenMechanism(): Observable<unknown> {
    return this.apiToken$.pipe(
      switchMap(
        apiToken =>
          iif(() => !apiToken, of(false).pipe(tap(() => this.store.dispatch(fetchAnonymousUserToken()))), of(true)) // fetch anonymous user token only when api token is not available
      ),
      whenTruthy(),
      first()
    );
  }

  /**
   * Observable which emits with the last two apiToken cookie data only, when these have changed within 1000ms interval
   */
  private apiTokenCookieChange$(): Observable<[ApiTokenCookie, ApiTokenCookie]> {
    return this.appRef.isStable.pipe(
      whenTruthy(),
      first(),
      mergeMap(() =>
        interval(1000).pipe(
          map(() => this.parseCookie()),
          pairwise(),
          distinctUntilChanged((prev, curr) => isEqual(prev, curr))
        )
      )
    );
  }

  /** notify subscriber when user has been logged out */
  private logoutUser$(): Observable<boolean> {
    return this.store.pipe(
      select(getLoggedInUser),
      startWith(undefined),
      pairwise(),
      filter(([previous, current]) => !!previous && !current),
      map(() => true)
    );
  }

  /** @returns calculate current apiToken cookie value based on the internal store$ state */
  private calculateApiTokenCookieValueOnChanges$(): Observable<ApiTokenCookie> {
    return combineLatest([
      this.store.pipe(select(getLoggedInUser)),
      this.store.pipe(select(getCurrentBasket)),
      this.store.pipe(select(getSelectedOrderId)),
      this.sessionRefreshToken$(),
    ]).pipe(
      switchMap(value => of(value)),
      this.mapToApiTokenCookie(),
      filter(apiToken => !!apiToken?.apiToken),
      distinctUntilChanged<ApiTokenCookie>(isEqual)
    );
  }

  /** the refresh token for the apiToken cookie, emitted with every new access token, undefined without a session */
  private sessionRefreshToken$(): Observable<string> {
    return this.apiToken$.pipe(map(accessToken => (accessToken ? this.refreshToken : undefined)));
  }

  /** @returns previous apiToken cookie type when the cookie vanishes */
  private tokenVanish$(): Observable<ApiTokenCookieType> {
    // access token vanishes routine

    return this.cookieChangeEvent$.pipe(
      withLatestFrom(this.apiToken$),
      filter(([[previous, current], apiToken]) => !!previous && !current && !!apiToken),
      map(([[previous]]) => previous.type)
    );
  }

  /**
   * initialize restore$ mechanism when apiToken cookie is created outside of current PWA context
   *
   * Steps:
   * (1): stream got notified when 'apiToken' cookie changes
   * (2): check that a user token cookie was added in comparison to previous cookie value
   * (3): calculate a current apiToken cookie value of current pwa context
   * (4): filter stream values when calculated apiToken cookie value is not truthy --> cookie was added from another tab
   * (5): set initialCookie$ value with information from current apiToken cookie in order to fetch new tokens and data via restore$
   */
  private tokenCreatedOnAnotherTab$(): Observable<boolean> {
    // cookie created routine when user is logged in in an another tab
    return this.cookieChangeEvent$.pipe(
      filter(([previous, current]) => !previous && current?.type === 'user'), // first time after a login cookie appears
      withLatestFrom(
        this.store.pipe(select(getLoggedInUser)),
        this.store.pipe(select(getCurrentBasket)),
        this.store.pipe(select(getSelectedOrderId)),
        this.sessionRefreshToken$()
      ),
      switchMap(([[, current], ...ctx]) =>
        of(ctx).pipe(
          this.mapToApiTokenCookie(),
          filter(calculated => !calculated), // application calculated no api token cookie although an user cookie is stored
          map(() => current)
        )
      ),
      tap(cookieValue => this.initialCookie$.next(cookieValue)),
      switchMap(() => this.restore$())
    );
  }

  private mapToApiTokenCookie(): OperatorFunction<[User, BasketView, string, string], ApiTokenCookie> {
    return (source$: Observable<[User, BasketView, string, string]>) =>
      source$.pipe(
        map(([user, basket, orderId, refreshToken]): ApiTokenCookie => {
          if (user) {
            return { apiToken: refreshToken, type: 'user', isAnonymous: false, creator: 'pwa' };
          } else if (basket) {
            return { apiToken: refreshToken, type: 'user', isAnonymous: true, creator: 'pwa' };
          } else if (orderId) {
            return { apiToken: refreshToken, type: 'order', orderId, creator: 'pwa' };
          }

          const apiTokenCookie = this.parseCookie();
          if (refreshToken && apiTokenCookie) {
            return { ...apiTokenCookie, apiToken: refreshToken }; // overwrite existing cookie information with new refresh token
          }
        })
      );
  }

  /**
   * removes the apiToken cookie, path: '/' is needed to remove it within a multi-site configuration (e.g. configured /en, /fr, /de routes)
   */
  private removeApiTokenCookie() {
    this.cookiesService.remove('apiToken', { path: '/' });
  }

  /**
   * @returns the apiToken cookie, if it contains an apiToken to restore its session
   */
  private parseCookie(): ApiTokenCookie {
    const cookieContent = this.cookiesService.get('apiToken');
    if (cookieContent) {
      try {
        const cookie: ApiTokenCookie = JSON.parse(cookieContent);
        return cookie?.apiToken ? cookie : undefined;
      } catch {
        // ignore
      }
    }
    return;
  }
}
