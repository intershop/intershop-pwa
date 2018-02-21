import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { Locale } from '../../models/locale/locale.interface';
import { CoreState, getCurrentLocale } from '../store/locale';
import { ICM_SERVER_URL, REST_ENDPOINT } from './state-transfer/factories';

@Injectable()
export class ApiService {

  private currentLocale: Locale;

  /**
   * Constructor
   * @param  {Http} private http
   */
  constructor(
    @Inject(REST_ENDPOINT) private restEndpoint: string,
    @Inject(ICM_SERVER_URL) private icmServerUrl: string,
    private httpClient: HttpClient,
    store: Store<CoreState>,
  ) {
    store.pipe(select(getCurrentLocale)).subscribe(locale => this.currentLocale = locale);
  }

  // declare default http header
  private defaultHeaders = new HttpHeaders().set('content-type', 'application/json').set('Accept', 'application/json');

  /**
   * http get request
   * @param  {string} path
   * @param  {URLSearchParams=newURLSearchParams(} params
   * @returns Observable
   */

  get<T>(path: string, params?: HttpParams, headers?: HttpHeaders,
    elementsTranslation?: boolean, linkTranslation?: boolean): Observable<T> {
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

    return this.httpClient.get<T>(url, { params: params, headers: headers })
      .map(data => (elementsTranslation ? data['elements'] : data))
      .flatMap((data) => this.getLinkedData(data, linkTranslation));
  }

  /**
   * http put request
   * @param  {string} path
   * @param  {Object={}} body
   * @returns Observable
   */
  put<T>(path: string, body: Object = {}): Observable<T> {
    return this.httpClient.put<T>(
      `${this.restEndpoint}/${path}`,
      JSON.stringify(body),
      { headers: this.defaultHeaders }
    );
  }

  /**
   * http post request
   * @param  {string} path
   * @param  {Object={}} body
   * @returns Observable
   */
  post<T>(path: string, body: Object = {}): Observable<T> {
    return this.httpClient.post<T>(
      `${this.restEndpoint}/${path}`,
      JSON.stringify(body),
      { headers: this.defaultHeaders }
    );
  }

  /**
   * http delete request
   * @param  {} path
   * @returns Observable
   */
  delete<T>(path): Observable<T> {

    return this.httpClient.delete<T>(
      `${this.restEndpoint}/${path}`
    );

  }

  private getLinkedData(data: any, linkTranslation?: boolean): Observable<any> {
    if (!linkTranslation) {
      return of(data);
    } else {
      let elements = data.elements ? data.elements : data;
      if (!elements || !elements.length || !elements.find(x => x.type === 'Link')) {
        return of(elements);
      }
      return forkJoin(this.getLinkedObjects(elements)).pipe(
        map(results => {
          elements = elements.map((item, key) => {
            return results[key];
          });
          if (data.elements) {
            data.elements = elements;
            return data;
          }
          return elements;
        })
      );
    }
  }


  private getLinkedObjects(data: any[]): Observable<any>[] {
    const uriList$: Observable<any>[] = [];
    data.forEach(item => {
      if (item.type === 'Link' && item.uri) {
        const linkUrl = `${this.icmServerUrl}/${item.uri}`;
        // console.log(`link-translation ${item.uri} to ${linkUrl}`);
        uriList$.push(this.get(linkUrl));
      }
    });
    return uriList$;
  }
}
