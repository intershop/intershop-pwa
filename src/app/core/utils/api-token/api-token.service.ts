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
  apiToken$: BehaviorSubject<string>;
  cookieVanishes$ = new Subject<ApiTokenCookieType>();

  private cookieOptions: CookieOptions = {};

  private initialCookie$: BehaviorSubject<ApiTokenCookie>;

  private cookieChangeEvent$: Observable<[ApiTokenCookie, ApiTokenCookie]>;

  constructor(private cookiesService: CookiesService, private store: Store, private appRef: ApplicationRef) {
    // setup initial values
    const initialCookie = this.parseCookie();
    this.initialCookie$ = new BehaviorSubject<ApiTokenCookie>(!SSR ? initialCookie : undefined);
    this.apiToken$ = new BehaviorSubject<string>(initialCookie?.apiToken);

    if (!SSR) {
      // multicast apiTokenCookieChange$ to avoid multiple listeners
      this.cookieChangeEvent$ = this.apiTokenCookieChange$().pipe(shareReplay(1));

      // save internal calculated apiToken as cookie
      this.getInternalApiTokenCookieValue$().subscribe(apiToken => {
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
      this.logoutUser$().subscribe(() => this.cookiesService.remove('apiToken', { path: '/' }));

      // unset apiToken when cookie vanishes and notify public event stream
      this.tokenVanish$().subscribe(type => {
        this.apiToken$.next(undefined);
        this.cookieVanishes$.next(type);
      });

      // initialize restore$ mechanism when apiToken cookie is created outside of current PWA context
      this.tokenCreatedOnAnotherTab$().subscribe(noop);
    }
  }

  hasUserApiTokenCookie() {
    const apiTokenCookie = this.parseCookie();
    return apiTokenCookie?.type === 'user' && !apiTokenCookie?.isAnonymous;
  }

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
                return race(
                  this.store.pipe(select(getUserAuthorized), whenTruthy(), take(1)),
                  timer(5000).pipe(map(() => false))
                );
              }
            }
            case 'order': {
              this.store.dispatch(loadOrderByAPIToken({ orderId: cookie.orderId, apiToken: cookie.apiToken }));
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

  /**
   * Should remove the actual apiToken cookie and fetch a new anonymous user token
   */
  removeApiToken() {
    this.apiToken$.next(undefined);
  }

  setApiToken(apiToken: string, options?: CookieOptions) {
    this.cookieOptions = options;
    this.apiToken$.next(apiToken);
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return iif(
      () => req.url.endsWith('/baskets') && req.method === 'POST', // only on basket creation an anonymous user token can be created
      this.anonymousUserTokenMechanism(),
      of(true)
    ).pipe(
      switchMap(() =>
        this.appendAuthentication(req).pipe(
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
      (err.error.includes('AuthenticationToken') || err.error.includes('Unable to decode token'))
    );
  }

  private appendAuthentication(req: HttpRequest<unknown>): Observable<HttpRequest<unknown>> {
    return this.apiToken$.pipe(
      map(apiToken =>
        apiToken && !req.headers?.has(ApiService.TOKEN_HEADER_KEY)
          ? req.clone({ headers: req.headers.set(ApiService.TOKEN_HEADER_KEY, apiToken) })
          : req
      ),
      first()
    );
  }

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
   * @returns Observable, which emits the last two different apiToken cookie values
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
   * @returns true within a Observable stream, when the user is logged out
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
  private getInternalApiTokenCookieValue$(): Observable<ApiTokenCookie> {
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
   * @returns initialize restore$ mechanism when apiToken cookie is created outside of current PWA context
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
        this.apiToken$.next(cookieValue.apiToken);
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
