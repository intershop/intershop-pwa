import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { CustomErrorHandler } from './custom-error-handler';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as _ from 'lodash';

@Injectable()
export class ApiService {

  /**
   * Constructor
   * @param  {Http} privatehttp
   */
  constructor(private httpClient: HttpClient,
    private customErrorHandler: CustomErrorHandler
    ) {
  }

  /**
   * format api errors and send errors to custom handler
   * @param  {any} error
   */
  private formatErrors(error: any) {
    return this.customErrorHandler.handleApiErrors(error);
  }

  /**
   * http get request
   * @param  {string} path
   * @param  {URLSearchParams=newURLSearchParams(} params
   * @returns Observable
   */

  get(path: string, params: HttpParams = new HttpParams(), headers?: HttpHeaders,
    elementsTranslation?: boolean, linkTranslation?: boolean): Observable<any> {
    // const loc = this.localize.parser.currentLocale;
     const url = `${environment.rest_url}/${path}`;

    // TODO: Mocking may support link translation in future
    // if (environment.needMock && this.mockApiService.pathHasToBeMocked(path)) {
    //   url = this.mockApiService.getMockPath(path);
    // }

    return this.httpClient.get(url, { headers: headers })
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
  put(path: string, body: Object = {}): Observable<any> {
    return this.httpClient.put(
      `${environment.rest_url}/${path}`,
      JSON.stringify(body)
    ).catch(this.formatErrors);
  }

  /**
   * http post request
   * @param  {string} path
   * @param  {Object={}} body
   * @returns Observable
   */
  post(path: string, body: Object = {}): Observable<any> {
    return this.httpClient.post(
      `${environment.rest_url}/${path}`,
      JSON.stringify(body)
    ).catch(this.formatErrors);
  }

  /**
   * http delete request
   * @param  {} path
   * @returns Observable
   */
  delete(path): Observable<any> {

    return this.httpClient.delete(
      `${environment.rest_url}/${path}`
    ).catch(this.formatErrors);

  }

  // TODO: need to improve  base url replacement logic
  getSubLinkBaseUrl(): string {
    return environment.rest_url.replace('inSPIRED-inTRONICS-Site/-/', '');
  }

  getLinkedData(data: any, linkTranslation?: boolean): Observable<any> {
    if (!linkTranslation) {
      return Observable.of(data);
    } else {

      let elements = (_.has(data, 'elements') ? data['elements'] : data);
      return Observable.forkJoin(this.getLinkUri(elements)).map(results => {
        elements = _.map(elements, (item, key) => {
          return results[key];
        });
        return { ...data, elements };
      });

    }
  }


  /**
   * @param  {any[]} data
   * @returns Observable
   */
  getLinkUri(data: any[]): Observable<Object>[] {
    const uriList: Observable<Object>[] = [];
    _.forEach(data, item => {
      if (item.type === 'Link' && item.uri) {
        uriList.push(this.get(`${this.getSubLinkBaseUrl()}${item.uri}`));
      }
    });
    return uriList;
  }

}
