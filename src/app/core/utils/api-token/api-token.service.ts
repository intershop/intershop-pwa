import { HttpErrorResponse, HttpEvent, HttpHandler, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { ApplicationRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { CookieOptions } from 'express';
import { isEqual } from 'lodash-es';
import {
  Observable,
  OperatorFunction,
  ReplaySubject,
  Subject,
  combineLatest,
  interval,
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
  skip,
  startWith,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs/operators';

import { BasketView } from 'ish-core/models/basket/basket.model';
import { User } from 'ish-core/models/user/user.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getCurrentBasket, getCurrentBasketId, loadBasket, loadBasketByAPIToken } from 'ish-core/store/customer/basket';
import { getOrder, getSelectedOrderId, loadOrderByAPIToken } from 'ish-core/store/customer/orders';
import {
  fetchAnonymousUserToken,
  getLoggedInUser,
  getUserAuthorized,
  loadUserByAPIToken,
} from 'ish-core/store/customer/user';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';

type ApiTokenCookieType = 'user' | 'order' | 'anonymous';

interface ApiTokenCookie {
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
  apiToken$ = new ReplaySubject<string>(1);
  cookieVanishes$ = new Subject<ApiTokenCookieType>();

  private cookieOptions: CookieOptions = {};

  private initialCookie$: Observable<ApiTokenCookie>;

  constructor(
    private cookiesService: CookiesService,
    private router: Router,
    private store: Store,
    appRef: ApplicationRef
  ) {
    // setup initial values
    const initialCookie = this.parseCookie();
    this.initialCookie$ = of(!SSR ? initialCookie : undefined);
    this.initialCookie$.pipe(mapToProperty('apiToken')).subscribe(token => {
      this.apiToken$.next(token);
    });

    if (!SSR) {
      // save token routine
      combineLatest([
        store.pipe(select(getLoggedInUser), startWith(undefined), pairwise()),
        store.pipe(select(getCurrentBasket)),
        store.pipe(select(getSelectedOrderId)),
        this.apiToken$,
      ])
        .pipe(skip(1), this.mapToApiTokenCookie(), distinctUntilChanged<ApiTokenCookie>(isEqual))
        .subscribe(apiToken => {
          const cookieContent = apiToken?.apiToken ? JSON.stringify(apiToken) : undefined;
          if (cookieContent) {
            cookiesService.put('apiToken', cookieContent, {
              expires: this.cookieOptions?.expires ?? new Date(Date.now() + DEFAULT_EXPIRY_TIME),
              secure: this.cookieOptions?.secure ?? true,
              sameSite: 'Strict',
              path: '/',
            });
          } else {
            cookiesService.remove('apiToken');
          }
        });

      // access token vanishes routine
      appRef.isStable
        .pipe(
          whenTruthy(),
          first(),
          mergeMap(() =>
            interval(1000).pipe(
              map(() => this.parseCookie()),
              pairwise(),
              // trigger only if application token exists but external token vanished
              withLatestFrom(this.apiToken$),
              filter(([[previous, current], apiToken]) => !!previous && !current && !!apiToken),
              map(([[previous]]) => previous.type)
            )
          )
        )
        .subscribe(type => {
          this.apiToken$.next(undefined);
          this.cookieVanishes$.next(type);
        });

      // cookie vanishes routine when user is logged out in an another tab
      appRef.isStable
        .pipe(
          whenTruthy(),
          first(),
          mergeMap(() =>
            interval(1000).pipe(
              map(() => this.parseCookie()),
              pairwise(),
              filter(([previous, current]) => previous?.type === 'user' && current?.type === 'anonymous'), // user is logged out and got a new token as an anonymous user
              switchMap(([previous, current]) =>
                combineLatest([
                  store.pipe(select(getLoggedInUser), startWith(undefined), pairwise()),
                  store.pipe(select(getCurrentBasket)),
                  store.pipe(select(getSelectedOrderId)),
                  this.apiToken$,
                ]).pipe(
                  take(1),
                  this.mapToApiTokenCookie(),
                  filter(calculated => calculated?.type === 'user'), // application calculated an user api token cookie although an anonymous cookie is stored
                  map<ApiTokenCookie, [ApiTokenCookieType, string]>(() => [previous.type, current.apiToken])
                )
              )
            )
          )
        )
        .subscribe(([type, apiToken]) => {
          this.apiToken$.next(apiToken);
          this.cookieVanishes$.next(type);
        });

      // session keep alive
      appRef.isStable
        .pipe(
          whenTruthy(),
          first(),
          mergeMap(() =>
            store.pipe(
              select(getCurrentBasket),
              switchMap(basket => interval(10 * 60 * 1000).pipe(map(() => !!basket)))
            )
          ),
          whenTruthy()
        )
        .subscribe(() => {
          store.dispatch(loadBasket());
        });
    }
  }

  private mapToApiTokenCookie(): OperatorFunction<[[User, User], BasketView, string, string], ApiTokenCookie> {
    return (source$: Observable<[[User, User], BasketView, string, string]>) =>
      source$.pipe(
        map(([[prevUser, user], basket, orderId, apiToken]): ApiTokenCookie => {
          if (user) {
            return { apiToken, type: 'user', isAnonymous: false, creator: 'pwa' };
          } else if (basket) {
            return { apiToken, type: 'user', isAnonymous: true, creator: 'pwa' };
          } else if (orderId) {
            return { apiToken, type: 'order', orderId, creator: 'pwa' };
          }
          // user is logged out and is now anonymous
          else if (apiToken && !user && prevUser) {
            return { apiToken, type: 'anonymous', creator: 'pwa', isAnonymous: true };
          }

          const apiTokenCookieString = this.cookiesService.get('apiToken');
          const apiTokenCookie: ApiTokenCookie = apiTokenCookieString ? JSON.parse(apiTokenCookieString) : undefined;
          if (apiToken) {
            if (apiTokenCookie) {
              return { ...apiTokenCookie, apiToken }; // overwrite existing cookie informations with new apiToken
            }
            return { apiToken, type: 'anonymous', creator: 'pwa', isAnonymous: true }; // initial api token cookie
          }
        })
      );
  }

  hasUserApiTokenCookie() {
    const apiTokenCookie = this.parseCookie();
    return apiTokenCookie?.type === 'user' && !apiTokenCookie?.isAnonymous;
  }

  restore$(types: ApiTokenCookieType[] = ['user', 'order'], fetchAnonymousToken = true): Observable<boolean> {
    if (SSR) {
      return of(true);
    }
    return this.router.events.pipe(
      first(),
      switchMap(() => this.initialCookie$),
      withLatestFrom(this.apiToken$),
      switchMap(([cookie, apiToken]) => {
        if (!apiToken && fetchAnonymousToken) {
          this.store.dispatch(fetchAnonymousUserToken());
        }
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

  private invalidateApiToken() {
    const cookie = this.parseCookie();

    this.removeApiToken();

    if (cookie) {
      this.cookieVanishes$.next(cookie?.type);
    }
  }

  private isAuthTokenError(err: unknown) {
    return (
      err instanceof HttpErrorResponse && typeof err.error === 'string' && err.error.includes('AuthenticationToken')
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

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.appendAuthentication(req).pipe(
      concatMap(request =>
        next.handle(request).pipe(
          map(event => {
            // remove id_token from /token response
            // TODO: remove http request body adaptions if correct id_tokens are returned
            if (event instanceof HttpResponse && event.url.endsWith('token') && request.body instanceof HttpParams) {
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
              const retryRequest = request.clone({ headers: request.headers.delete(ApiService.TOKEN_HEADER_KEY) });
              // timer introduced for testability
              return timer(500).pipe(switchMap(() => next.handle(retryRequest)));
            }
            return throwError(() => err);
          })
        )
      )
    );
  }
}
