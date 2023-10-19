import { HttpErrorResponse, HttpEvent, HttpHandler, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { ApplicationRef, Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
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

type ApiTokenCookieType = 'user' | 'order';

export interface ApiTokenCookie {
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
  /**
   * stores current apiToken information, will be used to add authentication header for each request
   */
  private apiToken$: BehaviorSubject<string>;

  /**
   * informs subscriber that cookie is unexpectedly removed (e.g. logout from another tab)
   */
  private cookieVanishes$ = new Subject<ApiTokenCookieType>();

  /**
   * cookie options which are used to store apiToken cookie, will be overwritten by setApiToken() method
   */
  private cookieOptions: CookieOptions = {};

  /**
   * informs subscriber (e.g. restore$()) with value from initial apiToken cookie,
   * is used by tokenCreatedOnAnotherTab() method to trigger restore$() method again
   */
  private initialCookie$: BehaviorSubject<ApiTokenCookie>;

  /**
   * informs subscriber whenever an apiToken has been changed
   */
  private cookieChangeEvent$: Observable<[ApiTokenCookie, ApiTokenCookie]>;

  constructor(private cookiesService: CookiesService, private store: Store, private appRef: ApplicationRef) {
    // setup initial values
    const initialCookie = this.parseCookie();
    this.initialCookie$ = new BehaviorSubject<ApiTokenCookie>(!SSR ? initialCookie : undefined);
    this.apiToken$ = new BehaviorSubject<string>(initialCookie?.apiToken);

    if (!SSR) {
      // multicast apiTokenCookieChange$ to avoid multiple listeners
      this.cookieChangeEvent$ = this.apiTokenCookieChange$().pipe(shareReplay(1));

      // save internal calculated apiToken as cookie whenever apiToken, basket, user or order information changes
      this.calculateApiTokenCookieValueOnChanges$().subscribe(apiToken => {
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
      // path: '/' is added in order to remove cookie within a multi-site configuration (e.g. configured /en, /fr, /de routes)
      this.logoutUser$().subscribe(() => this.cookiesService.remove('apiToken', { path: '/' }));

      // unset apiToken when cookie vanishes/ has been removed unexpectedly and notify public event stream
      this.tokenVanish$().subscribe(type => {
        this.removeApiToken();
        this.cookieVanishes$.next(type);
      });

      // initialize restore$ mechanism when apiToken cookie is created outside of current PWA context (e.g. login in another tab)
      this.tokenCreatedOnAnotherTab$().subscribe(noop);
    }
  }

  hasUserApiTokenCookie() {
    const apiTokenCookie = this.parseCookie();
    return apiTokenCookie?.type === 'user' && !apiTokenCookie?.isAnonymous;
  }

  /**
   * trigger actions to restore store information based on initial apiToken cookie
   */
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
                return race(
                  this.store.pipe(
                    select(getCurrentBasketId),
                    whenTruthy(),
                    take(1),
                    map(() => true)
                  ),
                  timer(5000).pipe(map(() => false))
                );
              } else {
                this.store.dispatch(loadUserByAPIToken());
                // wait until user is logged in
                return race(
                  this.store.pipe(select(getUserAuthorized), whenTruthy(), take(1)),
                  timer(5000).pipe(map(() => false))
                );
              }
            }
            case 'order': {
              this.store.dispatch(loadOrderByAPIToken({ orderId: cookie.orderId, apiToken: cookie.apiToken }));
              // wait until order is loaded
              return race(
                this.store.pipe(
                  select(getOrder(cookie.orderId)),
                  whenTruthy(),
                  take(1),
                  map(() => true)
                ),
                timer(5000).pipe(map(() => false))
              );
            }
          }
        }
        return of(true);
      })
    );
  }

  getApiToken$(): Observable<string> {
    return this.apiToken$.asObservable();
  }

  /**
   * remove the actual apiToken cookie
   */
  removeApiToken() {
    this.apiToken$.next(undefined);
  }

  /**
   * sets new apiToken and new apiToken cookie options when available
   */
  setApiToken(apiToken: string, options?: CookieOptions) {
    if (options) {
      this.cookieOptions = options;
    }
    this.apiToken$.next(apiToken);
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
                if (
                  event instanceof HttpResponse &&
                  event.url.endsWith('token') &&
                  request.body instanceof HttpParams
                ) {
                  const { id_token: _, ...body } = event.body;
                  return event.clone({
                    body,
                  });
                }
                return event;
              }),
              catchError(err => {
                if (this.isAuthTokenError(err)) {
                  this.invalidateApiToken();

                  // retry request without auth token
                  const retryRequest = request.clone({
                    headers: request.headers.delete(ApiService.TOKEN_HEADER_KEY),
                  });
                  // timer introduced for testability
                  return timer(500).pipe(switchMap(() => next.handle(retryRequest)));
                }
                return throwError(() => err);
              })
            )
          )
        )
      )
    );
  }

  /**
   * will remove apiToken and inform cookieVanishes$ listeners that cookie in not working as expected
   */
  private invalidateApiToken() {
    const cookie = this.parseCookie();

    this.removeApiToken();

    if (cookie) {
      this.cookieVanishes$.next(cookie?.type);
    }
  }

  private isAuthTokenError(err: unknown) {
    return (
      err instanceof HttpErrorResponse &&
      typeof err.error === 'string' &&
      (err.error.includes('AuthenticationToken') || err.error.includes('Unable to decode token')) // possible auth token error codes
    );
  }

  /**
   * append authentication header to current request in case an apiToken is available and specific header was not set before
   */
  private appendAuthenticationHeader(req: HttpRequest<unknown>): Observable<HttpRequest<unknown>> {
    return this.apiToken$.pipe(
      map(apiToken =>
        apiToken && !req.headers?.has(ApiService.TOKEN_HEADER_KEY)
          ? req.clone({ headers: req.headers.set(ApiService.TOKEN_HEADER_KEY, apiToken) })
          : req
      ),
      first()
    );
  }

  /**
   * process to trigger action to fetch anonymous user token and wait until apiToken is set in service
   */
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

  /**
   * notify subscriber when user has been logged out
   */
  private logoutUser$(): Observable<boolean> {
    return this.store.pipe(
      select(getLoggedInUser),
      startWith(undefined),
      pairwise(),
      filter(([previous, current]) => !!previous && !current),
      map(() => true)
    );
  }

  /**
   * @returns calculate current apiToken cookie value based on the internal store$ state
   */
  private calculateApiTokenCookieValueOnChanges$(): Observable<ApiTokenCookie> {
    return combineLatest([
      this.store.pipe(select(getLoggedInUser)),
      this.store.pipe(select(getCurrentBasket)),
      this.store.pipe(select(getSelectedOrderId)),
      this.apiToken$,
    ]).pipe(
      switchMap(value => of(value)),
      this.mapToApiTokenCookie(),
      filter(apiToken => !!apiToken?.apiToken),
      distinctUntilChanged<ApiTokenCookie>(isEqual)
    );
  }

  /**
   * @returns previous apiToken cookie type when the cookie vanishes
   */
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
   *
   * (1): stream got notified when 'apiToken' cookie changes
   *
   * (2): check that a user token cookie was added in comparison to previous cookie value
   *
   * (3): calculate a current apiToken cookie value of current pwa context
   *
   * (4): filter stream values when calculated apiToken cookie value is not truthy --> cookie was added from another tab
   *
   * (5): set new apiToken and initialCookie$ values with information from current apiToken cookie in order to fetch data via restore$
   *
   */
  private tokenCreatedOnAnotherTab$(): Observable<boolean> {
    // cookie created routine when user is logged in in an another tab
    return this.cookieChangeEvent$.pipe(
      filter(([previous, current]) => !previous && current?.type === 'user' && !!current?.apiToken), // first time after a login cookie appears
      withLatestFrom(
        this.store.pipe(select(getLoggedInUser)),
        this.store.pipe(select(getCurrentBasket)),
        this.store.pipe(select(getSelectedOrderId)),
        this.apiToken$
      ),
      switchMap(([[, current], ...ctx]) =>
        of(ctx).pipe(
          this.mapToApiTokenCookie(),
          filter(calculated => !calculated), // application calculated no api token cookie although an user cookie is stored
          map(() => current)
        )
      ),
      tap(cookieValue => {
        this.setApiToken(cookieValue.apiToken);
        this.initialCookie$.next(cookieValue);
      }),
      switchMap(() => this.restore$())
    );
  }

  private mapToApiTokenCookie(): OperatorFunction<[User, BasketView, string, string], ApiTokenCookie> {
    return (source$: Observable<[User, BasketView, string, string]>) =>
      source$.pipe(
        map(([user, basket, orderId, apiToken]): ApiTokenCookie => {
          if (user) {
            return { apiToken, type: 'user', isAnonymous: false, creator: 'pwa' };
          } else if (basket) {
            return { apiToken, type: 'user', isAnonymous: true, creator: 'pwa' };
          } else if (orderId) {
            return { apiToken, type: 'order', orderId, creator: 'pwa' };
          }

          const apiTokenCookieString = this.cookiesService.get('apiToken');
          const apiTokenCookie: ApiTokenCookie = apiTokenCookieString ? JSON.parse(apiTokenCookieString) : undefined;
          if (apiToken && apiTokenCookie) {
            return { ...apiTokenCookie, apiToken }; // overwrite existing cookie information with new apiToken
          }
        })
      );
  }

  private parseCookie(): ApiTokenCookie {
    const cookieContent = this.cookiesService.get('apiToken');
    if (cookieContent) {
      try {
        return JSON.parse(cookieContent);
      } catch (err) {
        // ignore
      }
    }
    return;
  }
}
