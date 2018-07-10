import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { forkJoin, Observable, OperatorFunction } from 'rxjs';
import { catchError, defaultIfEmpty, filter, map, switchMap } from 'rxjs/operators';
import { Link } from '../../../models/link/link.model';
import { Locale } from '../../../models/locale/locale.model';
import { CoreState } from '../../store/core.state';
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

@Injectable({ providedIn: 'root' })
export class ApiService {
  private currentLocale: Locale;

  constructor(
    @Inject(REST_ENDPOINT) private restEndpoint: string,
    @Inject(ICM_SERVER_URL) public icmServerURL: string,
    private httpClient: HttpClient,
    store: Store<CoreState>,
    private apiServiceErrorHandler: ApiServiceErrorHandler
  ) {
    store.pipe(select(getCurrentLocale)).subscribe(locale => (this.currentLocale = locale));
  }

  // declare default http header
  private defaultHeaders = new HttpHeaders().set('content-type', 'application/json').set('Accept', 'application/json');

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

    return this.httpClient
      .get<T>(url, options)
      .pipe(catchError(error => this.apiServiceErrorHandler.dispatchCommunicationErrors<T>(error)));
  }

  /**
   * http put request
   * @param  {string} path
   * @param  {Object={}} body
   * @returns Observable
   */
  put<T>(path: string, body: Object = {}): Observable<T> {
    return this.httpClient
      .put<T>(`${this.restEndpoint}/${path}`, JSON.stringify(body), { headers: this.defaultHeaders })
      .pipe(catchError(error => this.apiServiceErrorHandler.dispatchCommunicationErrors<T>(error)));
  }

  /**
   * http post request
   * @param  {string} path
   * @param  {Object={}} body
   * @returns Observable
   */
  post<T>(path: string, body: Object = {}): Observable<T> {
    return this.httpClient
      .post<T>(`${this.restEndpoint}/${path}`, JSON.stringify(body), { headers: this.defaultHeaders })
      .pipe(catchError(error => this.apiServiceErrorHandler.dispatchCommunicationErrors<T>(error)));
  }

  /**
   * http delete request
   * @param  {} path
   * @returns Observable
   */
  delete<T>(path): Observable<T> {
    return this.httpClient
      .delete<T>(`${this.restEndpoint}/${path}`)
      .pipe(catchError(error => this.apiServiceErrorHandler.dispatchCommunicationErrors<T>(error)));
  }
}
