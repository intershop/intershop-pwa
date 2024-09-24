import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  EMPTY,
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  combineLatest,
  defer,
  forkJoin,
  identity,
  iif,
  of,
  throwError,
} from 'rxjs';
import { catchError, concatMap, filter, first, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { Captcha } from 'ish-core/models/captcha/captcha.model';
import { Link } from 'ish-core/models/link/link.model';
import {
  getCurrentCurrency,
  getCurrentLocale,
  getICMServerURL,
  getRestEndpoint,
} from 'ish-core/store/core/configuration';
import { communicationTimeoutError, serverError } from 'ish-core/store/core/error';
import { isServerConfigurationLoaded } from 'ish-core/store/core/server-config';
import { getBasketIdOrCurrent } from 'ish-core/store/customer/basket';
import { getLoggedInCustomer, getLoggedInUser, getPGID } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * Pipeable operator for elements translation (removing the envelope).
 *
 * @param key the name of the envelope (default 'elements')
 * @returns The items of an elements array without the elements wrapper.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, -- any to avoid having to type everything before
export function unpackEnvelope<T>(key: string = 'elements'): OperatorFunction<any, T[]> {
  return map(data => (data?.[key]?.length ? data[key] : []));
}

export interface AvailableOptions {
  params?: HttpParams;
  headers?: HttpHeaders;
  responseType?: string;
  skipApiErrorHandling?: boolean;
  captcha?: Captcha;
  /** opt-out of sending currency matrix parameter by setting it to false */
  sendCurrency?: boolean;
  /** opt-out of sending locale matrix parameter by setting it to false */
  sendLocale?: boolean;
  /**
   * opt-in to sending pgid matrix parameter by setting it to true. As per Intershop Commerce REST api documentation ´pgid´ is the standard means
   * to get and cache personalized content of supported REST resources (e.g. cms).
   */
  sendPGID?: boolean;
  /**
   * opt-in to sending spgid matrix parameter by setting it to true. As per Intershop Commerce REST api documentation this is the special means
   * to get and cache personalized content of the product and category API (1.x).
   */
  sendSPGID?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  static TOKEN_HEADER_KEY = 'authentication-token';
  static AUTHORIZATION_HEADER_KEY = 'Authorization';

  constructor(
    private httpClient: HttpClient,
    private store: Store,
    private featureToggleService: FeatureToggleService
  ) {}

  /**
-  * sets the request header for the appropriate captcha service
-  * @param captcha captcha token for captcha V2 and V3
-  * @param captchaAction captcha action for captcha V3
-  */
  private appendCaptchaTokenToHeaders(captcha: string, captchaAction: string): MonoTypeOperatorFunction<HttpHeaders> {
    return map(headers =>
      // testing token gets 'null' from captcha service, so we accept it as a valid value here
      captchaAction !== undefined
        ? // captcha V3
          headers.set(ApiService.AUTHORIZATION_HEADER_KEY, `CAPTCHA recaptcha_token=${captcha} action=${captchaAction}`)
        : // captcha V2
          // second parameter 'foo=bar' is only required to resolve a shortcoming of the server side implementation that requires two parameters
          headers.set(ApiService.AUTHORIZATION_HEADER_KEY, `CAPTCHA g-recaptcha-response=${captcha} foo=bar`)
    );
  }

  /**
   * merges supplied and default headers
   */
  private constructHeaders(options?: AvailableOptions): Observable<HttpHeaders> {
    const defaultHeaders = new HttpHeaders().set('content-type', 'application/json').set('Accept', 'application/json');

    return of(
      options?.headers
        ? // append incoming headers to default ones
          options.headers.keys().reduce((acc, key) => acc.set(key, options.headers.get(key)), defaultHeaders)
        : // just use default headers
          defaultHeaders
    ).pipe(
      // testing token gets 'null' from captcha service, so we accept it as a valid value here
      options?.captcha?.captcha !== undefined
        ? // captcha headers
          this.appendCaptchaTokenToHeaders(options.captcha.captcha, options.captcha.captchaAction)
        : identity
    );
  }

  private handleErrors<T>(dispatch: boolean): MonoTypeOperatorFunction<T> {
    return catchError(error => {
      if (dispatch) {
        if (error.status === 0) {
          this.store.dispatch(communicationTimeoutError({ error }));
          return EMPTY;
        } else if (error.status >= 500 && error.status < 600) {
          this.store.dispatch(serverError({ error }));
          return EMPTY;
        }
      }
      return throwError(() => error);
    });
  }

  private execute<T>(options: AvailableOptions, httpCall$: Observable<T>): Observable<T> {
    return httpCall$.pipe(this.handleErrors(!options?.skipApiErrorHandling));
  }

  constructUrlForPath(path: string, options?: AvailableOptions): Observable<string> {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return of(path);
    }
    return combineLatest([
      this.store.pipe(select(getRestEndpoint), whenTruthy()),
      this.getLocale$(options),
      this.getCurrency$(options),
      of('/'),
      of(path.includes('/') ? path.split('/')[0] : path),
      // pgid
      this.store.pipe(
        select(getPGID),
        map(pgid => (options?.sendPGID && pgid ? `;pgid=${pgid}` : options?.sendSPGID && pgid ? `;spgid=${pgid}` : ''))
      ),
      // remaining path
      of(path.includes('/') ? path.substring(path.indexOf('/')) : ''),
    ]).pipe(
      first(),
      map(arr => arr.join(''))
    );
  }

  private getLocale$(options: AvailableOptions): Observable<string> {
    return options?.sendLocale === undefined || options.sendLocale
      ? this.store.pipe(
          select(isServerConfigurationLoaded),
          whenTruthy(),
          switchMap(() =>
            this.store.pipe(
              select(getCurrentLocale),
              whenTruthy(),
              map(l => `;loc=${l}`)
            )
          )
        )
      : of('');
  }

  private getCurrency$(options: AvailableOptions): Observable<string> {
    return options?.sendCurrency === undefined || options.sendCurrency
      ? this.store.pipe(
          select(isServerConfigurationLoaded),
          whenTruthy(),
          switchMap(() =>
            this.store.pipe(
              select(getCurrentCurrency),
              whenTruthy(),
              map(l => `;cur=${l}`)
            )
          )
        )
      : of('');
  }

  private constructHttpClientParams(
    path: string,
    options?: AvailableOptions
  ): Observable<[string, { headers: HttpHeaders; params: HttpParams }]> {
    return forkJoin([
      this.constructUrlForPath(path, options),
      defer(() =>
        this.constructHeaders(options).pipe(
          map(headers => ({
            headers,
            params: options?.params,
            responseType: options?.responseType,
          }))
        )
      ),
    ]);
  }

  /**
   * http get request
   */
  get<T>(path: string, options?: AvailableOptions): Observable<T> {
    return this.execute(
      options,
      this.constructHttpClientParams(path, options).pipe(
        concatMap(([url, httpOptions]) => this.httpClient.get<T>(url, httpOptions))
      )
    );
  }

  // not-dead-code
  /**
   * @deprecated http options request - will be removed with the next major release (6.0)
   */
  options<T>(path: string, options?: AvailableOptions): Observable<T> {
    return this.execute(
      options,
      this.constructHttpClientParams(path, options).pipe(
        concatMap(([url, httpOptions]) => this.httpClient.options<T>(url, httpOptions))
      )
    );
  }

  /**
   * http put request
   */
  put<T>(path: string, body = {}, options?: AvailableOptions): Observable<T> {
    return this.execute(
      options,
      this.constructHttpClientParams(path, options).pipe(
        concatMap(([url, httpOptions]) => this.httpClient.put<T>(url, body, httpOptions))
      )
    );
  }

  /**
   * http patch request
   */
  patch<T>(path: string, body = {}, options?: AvailableOptions): Observable<T> {
    return this.execute(
      options,
      this.constructHttpClientParams(path, options).pipe(
        concatMap(([url, httpOptions]) => this.httpClient.patch<T>(url, body, httpOptions))
      )
    );
  }

  /**
   * http post request
   */
  post<T>(path: string, body = {}, options?: AvailableOptions): Observable<T> {
    return this.execute(
      options,
      this.constructHttpClientParams(path, options).pipe(
        concatMap(([url, httpOptions]) => this.httpClient.post<T>(url, body, httpOptions))
      )
    );
  }

  /**
   * http delete request
   */
  delete<T>(path: string, options?: AvailableOptions): Observable<T> {
    return this.execute(
      options,
      this.constructHttpClientParams(path, options).pipe(
        concatMap(([url, httpOptions]) => this.httpClient.delete<T>(url, httpOptions))
      )
    );
  }

  /**
   * Pipeable operator for link translation (resolving one single link).
   *
   * @returns The link resolved to its actual REST response data.
   */
  resolveLink<T>(options?: AvailableOptions): OperatorFunction<Link, T> {
    return stream$ =>
      stream$.pipe(
        withLatestFrom(this.store.pipe(select(getICMServerURL))),
        concatMap(([link, icmServerURL]) =>
          iif(
            // check if link data is properly formatted
            () => link?.type === 'Link' && !!link.uri,
            // flat map to API request
            this.get<T>(`${icmServerURL}/${link.uri}`, options),
            // throw if link is not properly supplied
            throwError(() => new Error('link was not properly formatted'))
          )
        )
      );
  }

  /**
   * Pipeable operator for link translation (resolving multiple links).
   *
   * @returns The links resolved to their actual REST response data.
   */
  resolveLinks<T>(options?: AvailableOptions): OperatorFunction<Link[], T[]> {
    return source$ =>
      source$.pipe(
        // filter for all real Link elements
        map(links => links.filter(el => el?.type === 'Link' && !!el.uri)),
        withLatestFrom(this.store.pipe(select(getICMServerURL))),
        // transform Link elements to API Observables
        map(([links, icmServerURL]) => links.map(item => this.get<T>(`${icmServerURL}/${item.uri}`, options))),
        // flatten to API requests O<O<T>[]> -> O<T[]>
        concatMap(obsArray => iif(() => !!obsArray.length, forkJoin(obsArray), of([])))
      );
  }

  /**
   * To support special characters (slash, percent and plus char) of user defined URI Components (like login, email, ...).
   * This method encodes a given resource ID in a way that can be processed by ICM.
   * REST API of ICM version pre 12.0 encode the URI components twice, because of former restriction of the httpd.
   *
   * @param resourceId    The resource ID to be encoded.
   * @returns             The encoded resource ID.
   */
  encodeResourceId(resourceId: string): string {
    return this.featureToggleService.enabled('legacyEncoding')
      ? // ICM 7.10 & ICM 11 resource ID encoding
        encodeURIComponent(encodeURIComponent(resourceId))
      : // ICM 12 and above resource ID encoding
        // encodeURIComponent replaces spaces with '+' that's not RFC conform.
        // Therefore, we encode existing '+' with '%2B', converting the string with encodeURIComponent,
        // and converting '%2B' ('%252B' after encodeURIComponent) to '+' back.
        encodeURIComponent(resourceId?.replaceAll('+', '%2B'))?.replaceAll('\\+', '%20')?.replaceAll('%252B', '+');
  }

  /**
   * Method to generate a B2B user endpoint prefix based on the currently logged in user and customer.
   */
  b2bUserEndpoint() {
    const ids$ = combineLatest([
      this.store.pipe(select(getLoggedInUser)),
      this.store.pipe(select(getLoggedInCustomer)),
    ]).pipe(
      filter(([user, customer]) => !!user && !!customer),
      take(1)
    );

    return {
      get: <T>(path: string, options?: AvailableOptions) =>
        ids$.pipe(
          concatMap(([user, customer]) =>
            this.get<T>(
              `customers/${this.encodeResourceId(customer.customerNo)}/users/${this.encodeResourceId(
                user.login
              )}/${path}`,
              options
            )
          )
        ),
      delete: <T>(path: string, options?: AvailableOptions) =>
        ids$.pipe(
          concatMap(([user, customer]) =>
            this.delete<T>(
              `customers/${this.encodeResourceId(customer.customerNo)}/users/${this.encodeResourceId(
                user.login
              )}/${path}`,
              options
            )
          )
        ),
      put: <T>(path: string, body = {}, options?: AvailableOptions) =>
        ids$.pipe(
          concatMap(([user, customer]) =>
            this.put<T>(
              `customers/${this.encodeResourceId(customer.customerNo)}/users/${this.encodeResourceId(
                user.login
              )}/${path}`,
              body,
              options
            )
          )
        ),
      patch: <T>(path: string, body = {}, options?: AvailableOptions) =>
        ids$.pipe(
          concatMap(([user, customer]) =>
            this.patch<T>(
              `customers/${this.encodeResourceId(customer.customerNo)}/users/${this.encodeResourceId(
                user.login
              )}/${path}`,
              body,
              options
            )
          )
        ),
      post: <T>(path: string, body = {}, options?: AvailableOptions) =>
        ids$.pipe(
          concatMap(([user, customer]) =>
            this.post<T>(
              `customers/${this.encodeResourceId(customer.customerNo)}/users/${this.encodeResourceId(
                user.login
              )}/${path}`,
              body,
              options
            )
          )
        ),
    };
  }

  /**
   * Basket REST API wrapper to work with the currently selected basket id or 'current' as fallback.
   */
  currentBasketEndpoint() {
    const basketUrl$ = this.store
      .pipe(
        select(getBasketIdOrCurrent),
        map(basketId => `baskets/${basketId}`)
      )
      .pipe(take(1));

    return {
      get: <T>(path: string, options?: AvailableOptions) =>
        basketUrl$.pipe(concatMap(basketUrl => this.get<T>(path ? `${basketUrl}/${path}` : basketUrl, options))),
      delete: <T>(path: string, options?: AvailableOptions) =>
        basketUrl$.pipe(concatMap(basketUrl => this.delete<T>(path ? `${basketUrl}/${path}` : basketUrl, options))),
      put: <T>(path: string, body = {}, options?: AvailableOptions) =>
        basketUrl$.pipe(concatMap(basketUrl => this.put<T>(path ? `${basketUrl}/${path}` : basketUrl, body, options))),
      patch: <T>(path: string, body = {}, options?: AvailableOptions) =>
        basketUrl$.pipe(
          concatMap(basketUrl => this.patch<T>(path ? `${basketUrl}/${path}` : basketUrl, body, options))
        ),
      post: <T>(path: string, body = {}, options?: AvailableOptions) =>
        basketUrl$.pipe(concatMap(basketUrl => this.post<T>(path ? `${basketUrl}/${path}` : basketUrl, body, options))),
    };
  }
}
