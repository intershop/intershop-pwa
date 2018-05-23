import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Locale } from '../../models/locale/locale.model';
import { CoreState } from '../store/core.state';
import { getCurrentLocale } from '../store/locale';
import { ApiServiceErrorHandler } from './api.service.errorhandler';
import { REST_ENDPOINT } from './state-transfer/factories';

export function unpackEnvelope() {
  return map(data => (data ? data['elements'] : data));
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private currentLocale: Locale;

  /**
   * Constructor
   * @param  {Http} private http
   */
  constructor(
    @Inject(REST_ENDPOINT) private restEndpoint: string,
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
