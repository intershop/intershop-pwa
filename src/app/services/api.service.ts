import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { MockApiService } from '../services/mock-api.service';
import { CustomErrorHandler } from './custom-error-handler';
import { LocalizeRouterService } from './routes-parser-locale-currency/localize-router.service';

@Injectable()
export class ApiService {

  /**
   * Constructor
   * @param  {Http} privatehttp
   */
  constructor(private httpClient: HttpClient,
    private customErrorHandler: CustomErrorHandler,
    private mockApiService: MockApiService,
    private localize: LocalizeRouterService) {
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
    const loc = this.localize.parser.currentLocale;
    let url = `${environment.rest_url};loc=${loc.lang};cur=${loc.currency}/${path}`;

    // TODO: Mocking may support link translation in future
    if (this.mockApiService.pathHasToBeMocked(path)) {
      url = this.mockApiService.getMockPath(path);
    }

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
    return environment.rest_url.replace('inSPIRED-inTRONICS-Site/-', '');

  }
  removeLanguageUrl(url: string) {
    return url.replace('inSPIRED-inTRONICS-Site/-', '').replace(';loc=en_US;cur=USD/', '');
  }

  getLinkedData(data: any, linkTranslation?: boolean): Observable<any> {
    if (!linkTranslation) {
      return Observable.of(data);
    } else {

      let elements = (_.has(data, 'elements') ? data['elements'] : data);
      if (!elements.length) {
        return Observable.of(elements);
      }
      return Observable.forkJoin(this.getLinkUri(elements)).map(results => {
        elements = _.map(elements, (item, key) => {
          return results[key];
        });
        return elements;
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
        const link = `${this.removeLanguageUrl(item.uri)}`;
        uriList.push(this.get(link));
      }
    });
    return uriList;
  }

}
