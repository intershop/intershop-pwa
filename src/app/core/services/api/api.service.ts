import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, OperatorFunction, forkJoin } from 'rxjs';
import { catchError, defaultIfEmpty, filter, map, switchMap, throwIfEmpty } from 'rxjs/operators';

import { getICMServerURL, getRestEndpoint } from 'ish-core/store/configuration';
import { Link } from '../../models/link/link.model';
import { Locale } from '../../models/locale/locale.model';
import { getCurrentLocale } from '../../store/locale';

import { ApiServiceErrorHandler } from './api.service.errorhandler';

/**
 * Pipable operator for elements translation (removing the envelop).
 * @returns The items of an elements array without the elements wrapper.
 */
export function unpackEnvelope<T>(key: string = 'elements'): OperatorFunction<{}, T[]> {
  return source$ =>
    source$.pipe(
      filter(data => !!data[key] && !!data[key].length),
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
  currentLocale?: Locale
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
      return `${restEndpoint}${localeAndCurrency}/${path}`;
    default:
      throw new Error(`unhandled method '${method}'`);
  }
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private currentLocale: Locale;
  private restEndpoint: string;
  icmServerURL: string;

  constructor(
    private httpClient: HttpClient,
    private apiServiceErrorHandler: ApiServiceErrorHandler,
    store: Store<{}>
  ) {
    store.pipe(select(getCurrentLocale)).subscribe(locale => (this.currentLocale = locale));
    store.pipe(select(getICMServerURL)).subscribe(url => (this.icmServerURL = url));
    store.pipe(select(getRestEndpoint)).subscribe(url => (this.restEndpoint = url));
  }

  // declare default http header
  private defaultHeaders = new HttpHeaders().set('content-type', 'application/json').set('Accept', 'application/json');

  /**
   * http options request
   */
  options<T>(path: string, options?: { params?: HttpParams; headers?: HttpHeaders }): Observable<T> {
    return this.httpClient
      .options<T>(constructUrlForPath(path, 'OPTIONS', this.restEndpoint, this.currentLocale), {
        headers: this.defaultHeaders,
        ...options,
      })
      .pipe(catchApiError(this.apiServiceErrorHandler));
  }

  /**
   * http get request
   */
  get<T>(path: string, options?: { params?: HttpParams; headers?: HttpHeaders }): Observable<T> {
    return this.httpClient
      .get<T>(constructUrlForPath(path, 'GET', this.restEndpoint, this.currentLocale), {
        headers: this.defaultHeaders,
        ...options,
      })
      .pipe(catchApiError(this.apiServiceErrorHandler));
  }

  /**
   * http put request
   */
  put<T>(path: string, body = {}): Observable<T> {
    return this.httpClient
      .put<T>(constructUrlForPath(path, 'PUT', this.restEndpoint, this.currentLocale), body, {
        headers: this.defaultHeaders,
      })
      .pipe(catchApiError(this.apiServiceErrorHandler));
  }

  /**
   * http patch request
   */
  patch<T>(path: string, body = {}, options?: { params?: HttpParams; headers?: HttpHeaders }): Observable<T> {
    return this.httpClient
      .patch<T>(constructUrlForPath(path, 'PATCH', this.restEndpoint, this.currentLocale), body, {
        headers: this.defaultHeaders,
        ...options,
      })
      .pipe(catchApiError(this.apiServiceErrorHandler));
  }

  /**
   * http post request
   */
  post<T>(path: string, body = {}, options?: { params?: HttpParams; headers?: HttpHeaders }): Observable<T> {
    return this.httpClient
      .post<T>(constructUrlForPath(path, 'POST', this.restEndpoint, this.currentLocale), body, {
        headers: this.defaultHeaders,
        ...options,
      })
      .pipe(catchApiError(this.apiServiceErrorHandler));
  }

  /**
   * http delete request
   */
  delete<T>(path, options?: { params?: HttpParams; headers?: HttpHeaders }): Observable<T> {
    return this.httpClient
      .delete<T>(constructUrlForPath(path, 'DELETE', this.restEndpoint, this.currentLocale), {
        headers: this.defaultHeaders,
        ...options,
      })
      .pipe(catchApiError(this.apiServiceErrorHandler));
  }
}
