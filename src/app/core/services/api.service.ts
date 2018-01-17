import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { CustomErrorHandler } from './custom-error-handler';
import { CurrentLocaleService } from './locale/current-locale.service';
import { ICM_SERVER_URL, REST_ENDPOINT } from './state-transfer/factories';

@Injectable()
export class ApiService {

  /**
   * Constructor
   * @param  {Http} private http
   */
  constructor(
    @Inject(REST_ENDPOINT) private restEndpoint: string,
    @Inject(ICM_SERVER_URL) private icmServerUrl: string,
    private httpClient: HttpClient,
    private customErrorHandler: CustomErrorHandler,
    private currentLocaleService: CurrentLocaleService
  ) { }

  /**
   * format api errors and send errors to custom handler
   * @param  {any} error
   */
  // TODO: error handling needs to be reworked
  private formatErrors(error: any) {
    return this.customErrorHandler.handleApiErrors(error);
  }

  /**
   * http get request
   * @param  {string} path
   * @param  {URLSearchParams=newURLSearchParams(} params
   * @returns Observable
   */

  get<T>(path: string, params?: HttpParams, headers?: HttpHeaders,
    elementsTranslation?: boolean, linkTranslation?: boolean): Observable<T> {
    let localeAndCurrency = '';
    if (!!this.currentLocaleService.getValue()) {
      localeAndCurrency = `;loc=${this.currentLocaleService.getValue().lang};cur=${this.currentLocaleService.getValue().currency}`;
    }
    let url;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      url = path;
    } else {
      url = `${this.restEndpoint}${localeAndCurrency}/${path}`;
    }

    return this.httpClient.get<T>(url, { params: params, headers: headers })
      .map(data => data = (elementsTranslation ? data['elements'] : data))
      .flatMap((data) => this.getLinkedData(data, linkTranslation))
      .catch(this.formatErrors.bind(this));
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
      JSON.stringify(body)
    ).catch(this.formatErrors);
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
      JSON.stringify(body)
    ).catch(this.formatErrors);
  }

  /**
   * http delete request
   * @param  {} path
   * @returns Observable
   */
  delete<T>(path): Observable<T> {

    return this.httpClient.delete<T>(
      `${this.restEndpoint}/${path}`
    ).catch(this.formatErrors);

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
