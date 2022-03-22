import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { ApplicationRef, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { Observable, ReplaySubject, Subject, combineLatest, interval, of, race, throwError, timer } from 'rxjs';
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
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { ApiService } from 'ish-core/services/api/api.service';
import { getCurrentBasket, getCurrentBasketId, loadBasket, loadBasketByAPIToken } from 'ish-core/store/customer/basket';
import { getOrder, getSelectedOrderId, loadOrderByAPIToken } from 'ish-core/store/customer/orders';
import { getLoggedInUser, getUserAuthorized, loadUserByAPIToken } from 'ish-core/store/customer/user';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';

export type ApiTokenCookieType = 'user' | 'order';

interface ApiTokenCookie {
  apiToken: string;
  type: ApiTokenCookieType;
  isAnonymous?: boolean;
  orderId?: string;
  creator?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiTokenService {
  apiToken$ = new ReplaySubject<string>(1);
  cookieVanishes$ = new Subject<ApiTokenCookieType>();

  private initialCookie$: Observable<ApiTokenCookie>;

  constructor(
    private cookiesService: CookiesService,
    private router: Router,
    private store: Store,
    appRef: ApplicationRef
  ) {
    const initialCookie = this.parseCookie();
    this.initialCookie$ = of(!SSR ? initialCookie : undefined);
    this.initialCookie$.pipe(mapToProperty('apiToken')).subscribe(token => {
      this.apiToken$.next(token);
    });

    if (!SSR) {
      // save token routine
      combineLatest([
        store.pipe(select(getLoggedInUser)),
        store.pipe(select(getCurrentBasket)),
        store.pipe(select(getSelectedOrderId)),
        this.apiToken$.pipe(skip(1)),
      ])
        .pipe(
          map(([user, basket, orderId, apiToken]): ApiTokenCookie => {
            if (user) {
              return { apiToken, type: 'user', isAnonymous: false, creator: 'pwa' };
            } else if (basket) {
              return { apiToken, type: 'user', isAnonymous: true, creator: 'pwa' };
            } else if (orderId) {
              return { apiToken, type: 'order', orderId, creator: 'pwa' };
            } else {
              const apiTokenCookieString = this.cookiesService.get('apiToken');
              const apiTokenCookie: ApiTokenCookie = apiTokenCookieString
                ? JSON.parse(apiTokenCookieString)
                : undefined;
              if (apiToken && apiTokenCookie) {
                return { ...apiTokenCookie, apiToken };
              }
            }
          }),
          distinctUntilChanged<ApiTokenCookie>(isEqual)
        )
        .subscribe(apiToken => {
          const cookieContent = apiToken?.apiToken ? JSON.stringify(apiToken) : undefined;
          if (cookieContent) {
            cookiesService.put('apiToken', cookieContent, {
              expires: new Date(Date.now() + 3600000),
              secure: true,
              sameSite: 'Strict',
            });
          } else {
            cookiesService.remove('apiToken');
          }
        });

      // token vanishes routine
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

  hasUserApiTokenCookie() {
    const apiTokenCookie = this.parseCookie();
    return apiTokenCookie?.type === 'user' && !apiTokenCookie?.isAnonymous;
  }

  restore$(types: ApiTokenCookieType[] = ['user', 'order']): Observable<boolean> {
    if (SSR) {
      return of(true);
    }
    return this.router.events.pipe(
      first(),
      switchMap(() => this.initialCookie$),
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

  private parseCookie() {
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

  private setApiToken(apiToken: string) {
    if (!apiToken) {
      console.warn('do not use setApiToken to unset token, use remove or invalidate instead');
    }
    this.apiToken$.next(apiToken);
  }

  removeApiToken() {
    this.apiToken$.next(undefined);
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

  private setTokenFromResponse(event: HttpEvent<unknown>) {
    if (event instanceof HttpResponse) {
      const apiToken = event.headers.get(ApiService.TOKEN_HEADER_KEY);
      if (apiToken) {
        if (apiToken.startsWith('AuthenticationTokenOutdated') || apiToken.startsWith('AuthenticationTokenInvalid')) {
          this.invalidateApiToken();
        } else if (!event.url.endsWith('/configurations') && !event.url.endsWith('/contact')) {
          this.setApiToken(apiToken);
        }
      }
    }
  }

  private appendAuthentication(req: HttpRequest<unknown>): Observable<HttpRequest<unknown>> {
    return this.apiToken$.pipe(
      map(apiToken =>
        apiToken && !req.headers?.has(ApiService.AUTHORIZATION_HEADER_KEY)
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
          catchError(err => {
            if (this.isAuthTokenError(err)) {
              this.invalidateApiToken();

              // retry request without auth token
              const retryRequest = request.clone({ headers: request.headers.delete(ApiService.TOKEN_HEADER_KEY) });
              // timer introduced for testability
              return timer(500).pipe(switchMap(() => next.handle(retryRequest)));
            }
            return throwError(() => err);
          }),
          tap(event => this.setTokenFromResponse(event))
        )
      )
    );
  }
}
