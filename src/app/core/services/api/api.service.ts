import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, OperatorFunction, forkJoin } from 'rxjs';
import { catchError, defaultIfEmpty, filter, map, switchMap, throwIfEmpty } from 'rxjs/operators';

import { Link } from '../../../models/link/link.model';
import { Locale } from '../../../models/locale/locale.model';
import { getCurrentLocale } from '../../store/locale';
import { ICM_SERVER_URL, REST_ENDPOINT } from '../state-transfer/factories';

import { ApiServiceErrorHandler } from './api.service.errorhandler';

/**
 * Pipable operator for elements translation (removing the envelop).
 * @returns The items of an elements array without the elements wrapper.
 */
export function unpackEnvelope<T>(): OperatorFunction<{ elements: T[] }, T[]> {
  return source$ =>
    source$.pipe(
      filter(data => !!data.elements && !!data.elements.length),
      map(data => data.elements),
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

@Injectable({ providedIn: 'root' })
export class ApiService {
  private currentLocale: Locale;

  constructor(
    @Inject(REST_ENDPOINT) private restEndpoint: string,
    @Inject(ICM_SERVER_URL) public icmServerURL: string,
    private httpClient: HttpClient,
    store: Store<{}>,
    private apiServiceErrorHandler: ApiServiceErrorHandler
  ) {
    store.pipe(select(getCurrentLocale)).subscribe(locale => (this.currentLocale = locale));
  }

  // declare default http header
  private defaultHeaders = new HttpHeaders().set('content-type', 'application/json').set('Accept', 'application/json');

  /**
   * http options request
   * @param  {string} path
   * @param  {URLSearchParams=newURLSearchParams(} params
   * @returns Observable
   */
  options<T>(path: string, options?: { params?: HttpParams; headers?: HttpHeaders }): Observable<T> {
    let localeAndCurrency = '';
    if (!!this.currentLocale) {
      localeAndCurrency = `;loc=${this.currentLocale.lang};cur=${this.currentLocale.currency}`;
    }
    let url;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      url = path;
    } else {
      url = `${this.restEndpoint}${localeAndCurrency}/${path}`;
    }

    return this.httpClient.options<T>(url, options).pipe(catchApiError(this.apiServiceErrorHandler));
  }

  /**
   * http get request
   * @param  {string} path
   * @param  {URLSearchParams=newURLSearchParams(} params
   * @returns Observable
   */
  get<T>(path: string, options?: { params?: HttpParams; headers?: HttpHeaders }): Observable<T> {
    let localeAndCurrency = '';
    if (!!this.currentLocale) {
      localeAndCurrency = `;loc=${this.currentLocale.lang};cur=${this.currentLocale.currency}`;
    }
    let url;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      url = path;
    } else {
      url = `${this.restEndpoint}${localeAndCurrency}/${path}`;
    }

    return this.httpClient.get<T>(url, options).pipe(catchApiError(this.apiServiceErrorHandler));
  }

  /**
   * http put request
   */
  put<T>(path: string, body = {}): Observable<T> {
    return this.httpClient
      .put<T>(`${this.restEndpoint}/${path}`, body, { headers: this.defaultHeaders })
      .pipe(catchApiError(this.apiServiceErrorHandler));
  }

  /**
   * http post request
   * @returns Observable
   */
  post<T>(path: string, body = {}): Observable<T> {
    return this.httpClient
      .post<T>(`${this.restEndpoint}/${path}`, body, { headers: this.defaultHeaders })
      .pipe(catchApiError(this.apiServiceErrorHandler));
  }

  /**
   * http delete request
   * @param  {} path
   * @returns Observable
   */
  delete<T>(path): Observable<T> {
    return this.httpClient.delete<T>(`${this.restEndpoint}/${path}`).pipe(catchApiError(this.apiServiceErrorHandler));
  }
}
