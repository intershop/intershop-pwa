import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import {
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  Subject,
  combineLatest,
  forkJoin,
  iif,
  of,
  throwError,
} from 'rxjs';
import { concatMap, first, map, tap, withLatestFrom } from 'rxjs/operators';

import { Captcha } from 'ish-core/models/captcha/captcha.model';
import { Link } from 'ish-core/models/link/link.model';
import { getCurrentLocale, getICMServerURL, getRestEndpoint } from 'ish-core/store/core/configuration';
import { getAPIToken, getPGID } from 'ish-core/store/customer/user';

import { ApiServiceErrorHandler } from './api.service.errorhandler';

/**
 * Pipeable operator for elements translation (removing the envelope).
 * @param key the name of the envelope (default 'elements')
 * @returns The items of an elements array without the elements wrapper.
 */
export function unpackEnvelope<T>(key: string = 'elements'): OperatorFunction<{}, T[]> {
  return map(data => (!!data && !!data[key] && !!data[key].length ? data[key] : []));
}

export interface AvailableOptions {
  params?: HttpParams;
  headers?: HttpHeaders;
  skipApiErrorHandling?: boolean;
  runExclusively?: boolean;
  captcha?: Captcha;
  sendPGID?: boolean;
  sendSPGID?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  static TOKEN_HEADER_KEY = 'authentication-token';
  static AUTHORIZATION_HEADER_KEY = 'Authorization';

  private executionBarrier$: Observable<void> | Subject<void> = of(undefined);

  constructor(
    private httpClient: HttpClient,
    private apiServiceErrorHandler: ApiServiceErrorHandler,
    private store: Store
  ) {}

  /**
   * appends API token to requests if available and request is not an authorization request
   */
  private appendAPITokenToHeaders(path: string): MonoTypeOperatorFunction<HttpHeaders> {
    return headers$ =>
      headers$.pipe(
        withLatestFrom(this.store.pipe(select(getAPIToken))),
        map(([headers, apiToken]) =>
          apiToken && !headers.has(ApiService.AUTHORIZATION_HEADER_KEY)
            ? headers.set(ApiService.TOKEN_HEADER_KEY, apiToken)
            : headers
        ),
        // TODO: workaround removing auth token for cms if pgid is not available
        withLatestFrom(this.store.pipe(select(getPGID))),
        map(([headers, pgid]) =>
          !pgid && path.startsWith('cms') ? headers.delete(ApiService.TOKEN_HEADER_KEY) : headers
        )
      );
  }

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
          // TODO: remove second parameter 'foo=bar' that currently only resolves a shortcoming of the server side implementation that still requires two parameters
          headers.set(ApiService.AUTHORIZATION_HEADER_KEY, `CAPTCHA g-recaptcha-response=${captcha} foo=bar`)
    );
  }

  /**
   * merges supplied and default headers
   */
  private constructHeaders(path: string, options?: AvailableOptions): Observable<HttpHeaders> {
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
        : // default to api token
          this.appendAPITokenToHeaders(path)
    );
  }

  private execute<T>(options: AvailableOptions, httpCall$: Observable<T>): Observable<T> {
    const wrappedCall$ = httpCall$.pipe(this.apiServiceErrorHandler.handleErrors(!options?.skipApiErrorHandling));

    if (options?.runExclusively) {
      // setup a barrier for other calls
      const subject$ = new Subject<void>();
      this.executionBarrier$ = subject$;
      const releaseBarrier = () => {
        subject$.next();
        this.executionBarrier$ = of(undefined);
      };

      // release barrier on completion
      return wrappedCall$.pipe(tap({ complete: releaseBarrier, error: releaseBarrier }));
    } else {
      // respect barrier
      return this.executionBarrier$.pipe(concatMap(() => wrappedCall$));
    }
  }

  private constructUrlForPath(path: string, options?: AvailableOptions): Observable<string> {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return of(path);
    }
    return combineLatest([
      // base url
      this.store.pipe(select(getRestEndpoint)),
      // locale and currency
      this.store.pipe(
        select(getCurrentLocale),
        map(l => (l ? `;loc=${l.lang};cur=${l.currency}` : ''))
      ),
      // first path segment
      of('/'),
      of(path.includes('/') ? path.split('/')[0] : path),
      // pgid
      this.store.pipe(
        select(getPGID),
        map(pgid => (options?.sendPGID && pgid ? `;pgid=${pgid}` : options?.sendSPGID ? `;spgid=${pgid}` : ''))
      ),
      // remaining path
      of(path.includes('/') ? path.substr(path.indexOf('/')) : ''),
    ]).pipe(
      first(),
      map(arr => arr.join(''))
    );
  }

  private constructHttpClientParams(
    path: string,
    options?: AvailableOptions
  ): Observable<[string, { headers: HttpHeaders; params: HttpParams }]> {
    return forkJoin([
      this.constructUrlForPath(path, options),
      this.constructHeaders(path, options).pipe(
        map(headers => ({
          params: options?.params,
          headers,
        }))
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

  /**
   * http options request
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
   * @returns The link resolved to its actual REST response data.
   */
  resolveLink<T>(): OperatorFunction<Link, T> {
    return stream$ =>
      stream$.pipe(
        withLatestFrom(this.store.pipe(select(getICMServerURL))),
        concatMap(([link, icmServerURL]) =>
          iif(
            // check if link data is properly formatted
            () => link?.type === 'Link' && !!link.uri,
            // flat map to API request
            this.get<T>(`${icmServerURL}/${link.uri}`),
            // throw if link is not properly supplied
            throwError(new Error('link was not properly formatted'))
          )
        )
      );
  }

  /**
   * Pipeable operator for link translation (resolving multiple links).
   * @returns The links resolved to their actual REST response data.
   */
  resolveLinks<T>(): OperatorFunction<Link[], T[]> {
    return source$ =>
      source$.pipe(
        // filter for all real Link elements
        map(links => links.filter(el => el?.type === 'Link' && !!el.uri)),
        withLatestFrom(this.store.pipe(select(getICMServerURL))),
        // transform Link elements to API Observables
        map(([links, icmServerURL]) => links.map(item => this.get<T>(`${icmServerURL}/${item.uri}`))),
        // flatten to API requests O<O<T>[]> -> O<T[]>
        concatMap(obsArray => iif(() => !!obsArray.length, forkJoin(obsArray), of([])))
      );
  }
}
