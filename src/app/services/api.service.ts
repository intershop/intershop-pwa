import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
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

  get(path: string, params?: HttpParams, headers?: HttpHeaders,
    elementsTranslation?: boolean, linkTranslation?: boolean): Observable<any> {
    const loc = this.localize.parser.currentLocale;
    const url = `${environment.rest_url};loc=${loc.lang};cur=${loc.currency}/${path}`;

    return this.httpClient.get(url, { params: params, headers: headers })
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

  getLinkedData(data: any, linkTranslation?: boolean): Observable<any> {
    if (!linkTranslation) {
      return Observable.of(data);
    } else {
      let elements = data.elements ? data.elements : data;
      if (!elements.length || !_.find(elements, ['type', 'Link'])) {
        return Observable.of(elements);
      }
      return Observable.forkJoin(this.getLinkUri(elements)).map(results => {
        elements = _.map(elements, (item, key) => {
          return results[key];
        });
        if (data.elements) {
          data.elements = elements;
          return data;
        }
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
        // removes <site>/-;loc;cur/
        const linkUrl = (item.uri).replace(/inSPIRED-inTRONICS-Site\/-[^\/]*\//gi, '');
        // console.log(`link-translation ${item.uri} to ${linkUrl}`);
        uriList.push(this.get(linkUrl));
      }
    });
    return uriList;
  }

}
