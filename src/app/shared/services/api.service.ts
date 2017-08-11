import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { JwtService } from './jwt.service';
import { Observable } from 'rxjs/Observable';
import { CustomErrorHandler } from './custom-error-handler';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';

@Injectable()
export class ApiService {

  /**
   * private variables
   */
  private _customErrorHandler = new CustomErrorHandler();

  /**
   * Constructor
   * @param  {Http} privatehttp
   * @param  {JwtService} privatejwtService
   */
  constructor(private httpClient: HttpClient,
    private jwtService: JwtService) {
  }

  /**
   * set request headers
   * @returns Headers
   */
  private setHeaders(): HttpHeaders {
    const username: string = 'patricia@test.intershop.de';
    const password: string = '!InterShop00!';
    return new HttpHeaders().set('Authorization', 'Basic ' + Buffer.from((username + ':' + password)).toString('base64'));
  }

  /**
   * format api errors and send errors to custom handler
   * @param  {any} error
   */
  private formatErrors(error: any) {
    return this._customErrorHandler.handleApiErrors(error);
  }

  /**
   * http get request
   * @param  {string} path
   * @param  {URLSearchParams=newURLSearchParams(} params
   * @returns Observable
   */
  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.httpClient.get(`${environment.api_url}${path}`, { headers: this.setHeaders() })
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
      `${environment.api_url}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    )
      .catch(this.formatErrors)
      .map((res: Response) => {
        return JSON.parse(res.toString());
      });
  }

  /**
   * http post request
   * @param  {string} path
   * @param  {Object={}} body
   * @returns Observable
   */
  post(path: string, body: Object = {}): Observable<any> {
    return this.httpClient.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    )
      .catch(this.formatErrors)
      .map((res: Response) => {
        return JSON.parse(res.toString());
      });
  }

  /**
   * http delete request
   * @param  {} path
   * @returns Observable
   */
  delete(path): Observable<any> {
    return this.httpClient.delete(
      `${environment.api_url}${path}`,
      { headers: this.setHeaders() }
    )
      .catch(this.formatErrors)
      .map((res: Response) => JSON.parse(res.toString()));
  }
}
