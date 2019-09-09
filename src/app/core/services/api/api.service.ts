import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, OperatorFunction, Subject, forkJoin, of, throwError } from 'rxjs';
import { catchError, concatMap, defaultIfEmpty, filter, map, switchMap, tap, throwIfEmpty } from 'rxjs/operators';

import { Link } from 'ish-core/models/link/link.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { getICMServerURL, getRestEndpoint } from 'ish-core/store/configuration';
import { getCurrentLocale } from 'ish-core/store/locale';
import { getAPIToken, getPGID } from 'ish-core/store/user';

import { ApiServiceErrorHandler } from './api.service.errorhandler';

/**
 * Pipable operator for elements translation (removing the envelop).
 * @returns The items of an elements array without the elements wrapper.
 */
export function unpackEnvelope<T>(key: string = 'elements'): OperatorFunction<{}, T[]> {
  return source$ =>
    source$.pipe(
      filter(data => !!data && !!data[key] && !!data[key].length),
      map(data => data[key]),
      defaultIfEmpty([])
    );
}

/**
 * Pipable operator for link translation (resolving one single link).
 * @param apiService  The API service to be used for the link translation.
 * @returns           The link resolved to its actual REST response data.
 */
export function resolveLink<T>(apiService: ApiService): OperatorFunction<Link, T> {
  return source$ =>
    source$.pipe(
      // check if link data is propery formatted
      filter(link => !!link && link.type === 'Link' && !!link.uri),
      throwIfEmpty(() => new Error('link was not properly formatted')),
      // flat map to API request
      switchMap(item => apiService.get<T>(`${apiService.icmServerURL}/${item.uri}`))
    );
}

/**
 * Pipable operator for link translation (resolving the links).
 * @param apiService  The API service to be used for the link translation.
 * @returns           The links resolved to their actual REST response data.
 */
export function resolveLinks<T>(apiService: ApiService): OperatorFunction<Link[], T[]> {
  return source$ =>
    source$.pipe(
      // filter for all real Link elements
      map(links => links.filter(el => !!el && el.type === 'Link' && !!el.uri)),
      // stop if empty array
      filter(links => !!links && !!links.length),
      // transform Link elements to API Observables
      map(links => links.map(item => apiService.get<T>(`${apiService.icmServerURL}/${item.uri}`))),
      // flatten O<O<T>[]> -> O<T[]>
      // tslint:disable-next-line:no-unnecessary-callback-wrapper
      switchMap(obsArray => forkJoin(obsArray)),
      // return empty Array if no links were supplied to be resolved
      defaultIfEmpty([])
    );
}

function catchApiError<T>(handler: ApiServiceErrorHandler) {
  return (source$: Observable<T>) =>
    // tslint:disable-next-line:ban
    source$.pipe(catchError(error => handler.dispatchCommunicationErrors<T>(error)));
}

/**
 * constructs a full server URL with locale and currency for given input path
 */
export function constructUrlForPath(
  path: string,
  method: 'GET' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  restEndpoint: string,
  currentLocale: Locale,
  pgid: string
): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  switch (method) {
    case 'GET':
    case 'OPTIONS':
    case 'POST':
    case 'PUT':
    case 'PATCH':
    case 'DELETE':
      let localeAndCurrency = '';
      if (currentLocale) {
        localeAndCurrency = `;loc=${currentLocale.lang};cur=${currentLocale.currency}`;
      }
      // restrict to calls for cms api
      const pgidP = pgid && path.startsWith('cms/') ? `;pgid=${pgid}` : '';
      return `${restEndpoint}${localeAndCurrency}${pgidP}/${path}`;
    default:
      throw new Error(`unhandled method '${method}'`);
  }
}

export interface AvailableOptions {
  params?: HttpParams;
  headers?: HttpHeaders;
  skipApiErrorHandling?: boolean;
  runExclusively?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  static TOKEN_HEADER_KEY = 'authentication-token';
  static AUTHORIZATION_HEADER_KEY = 'Authorization';

  private currentLocale: Locale;
  private restEndpoint: string;
  private apiToken: string;
  private pgid: string;
  icmServerURL: string;

  private executionBarrier$: Observable<void> | Subject<void> = of(undefined);

  constructor(
    private httpClient: HttpClient,
    private apiServiceErrorHandler: ApiServiceErrorHandler,
    store: Store<{}>
  ) {
    store.pipe(select(getCurrentLocale)).subscribe(locale => (this.currentLocale = locale));
    store.pipe(select(getICMServerURL)).subscribe(url => (this.icmServerURL = url));
    store.pipe(select(getRestEndpoint)).subscribe(url => (this.restEndpoint = url));
    store.pipe(select(getAPIToken)).subscribe(token => (this.apiToken = token));
    store.pipe(select(getPGID)).subscribe(pgid => (this.pgid = pgid));
  }

  /**
   * appends API token to requests if available and request is not an authorization request
   */
  private appendAPITokenToHeaders(headers: HttpHeaders) {
    return this.apiToken && !headers.has(ApiService.AUTHORIZATION_HEADER_KEY)
      ? headers.set(ApiService.TOKEN_HEADER_KEY, this.apiToken)
      : headers;
  }

  /**
   * merges supplied and default headers
   */
  private constructHeaders(options?: { headers?: HttpHeaders }): HttpHeaders {
    const defaultHeaders = new HttpHeaders().set('content-type', 'application/json').set('Accept', 'application/json');

    let newHeaders = defaultHeaders;
    if (options && options.headers) {
      newHeaders = options.headers.keys().reduce((acc, key) => acc.set(key, options.headers.get(key)), defaultHeaders);
    }
    return this.appendAPITokenToHeaders(newHeaders);
  }

  private wrapHttpCall<T>(httpCall: () => Observable<T>, options: AvailableOptions) {
    const wrappedCall = () =>
      options && options.skipApiErrorHandling
        ? httpCall()
        : httpCall().pipe(catchApiError(this.apiServiceErrorHandler));

    if (options && options.runExclusively) {
      // setup a barrier for other calls
      const subject$ = new Subject<void>();
      this.executionBarrier$ = subject$;
      const releaseBarrier = () => {
        subject$.next();
        this.executionBarrier$ = of(undefined);
      };

      // release barrier on completion
      return wrappedCall().pipe(
        tap(releaseBarrier),
        // tslint:disable-next-line:ban
        catchError(err => {
          releaseBarrier();
          return throwError(err);
        })
      );
    } else {
      // respect barrier
      return this.executionBarrier$.pipe(concatMap(wrappedCall));
    }
  }

  /**
   * http get request
   */
  get<T>(path: string, options?: AvailableOptions): Observable<T> {
    return this.wrapHttpCall(
      () =>
        this.httpClient.get<T>(constructUrlForPath(path, 'GET', this.restEndpoint, this.currentLocale, this.pgid), {
          ...options,
          headers: this.constructHeaders(options),
        }),
      options
    );
  }

  /**
   * http options request
   */
  options<T>(path: string, options?: AvailableOptions): Observable<T> {
    return this.wrapHttpCall(
      () =>
        this.httpClient.options<T>(
          constructUrlForPath(path, 'OPTIONS', this.restEndpoint, this.currentLocale, this.pgid),
          {
            ...options,
            headers: this.constructHeaders(options),
          }
        ),
      options
    );
  }

  /**
   * http put request
   */
  put<T>(path: string, body = {}, options?: AvailableOptions): Observable<T> {
    return this.wrapHttpCall(
      () =>
        this.httpClient.put<T>(
          constructUrlForPath(path, 'PUT', this.restEndpoint, this.currentLocale, this.pgid),
          body,
          {
            ...options,
            headers: this.constructHeaders(options),
          }
        ),
      options
    );
  }

  /**
   * http patch request
   */
  patch<T>(path: string, body = {}, options?: AvailableOptions): Observable<T> {
    return this.wrapHttpCall(
      () =>
        this.httpClient.patch<T>(
          constructUrlForPath(path, 'PATCH', this.restEndpoint, this.currentLocale, this.pgid),
          body,
          {
            ...options,
            headers: this.constructHeaders(options),
          }
        ),
      options
    );
  }

  /**
   * http post request
   */
  post<T>(path: string, body = {}, options?: AvailableOptions): Observable<T> {
    return this.wrapHttpCall(
      () =>
        this.httpClient.post<T>(
          constructUrlForPath(path, 'POST', this.restEndpoint, this.currentLocale, this.pgid),
          body,
          {
            ...options,
            headers: this.constructHeaders(options),
          }
        ),
      options
    );
  }

  /**
   * http delete request
   */
  delete<T>(path, options?: AvailableOptions): Observable<T> {
    return this.wrapHttpCall(
      () =>
        this.httpClient.delete<T>(
          constructUrlForPath(path, 'DELETE', this.restEndpoint, this.currentLocale, this.pgid),
          {
            ...options,
            headers: this.constructHeaders(options),
          }
        ),
      options
    );
  }
}
