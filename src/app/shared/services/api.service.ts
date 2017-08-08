import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { JwtService } from './jwt.service';
import { Observable } from 'rxjs/Observable';
import { CustomErrorHandler } from './custom-error-handler';
import { environment } from '../../../environments/environment.prod';

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
  constructor(private http: Http,
    private jwtService: JwtService) {
  }

  /**
   * set request headers
   * @returns Headers
   */
  private setHeaders(): Headers {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (this.jwtService.getToken()) {
      headersConfig['Authorization'] = `Bearer ${this.jwtService.getToken()}`;
    }
    return new Headers(headersConfig);
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
  get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, { headers: this.setHeaders(), search: params })
      .map((data: Response) => {
        return JSON.parse(data.toString());
      })
      .catch(this.formatErrors.bind(this));
  }

  /**
   * http put request
   * @param  {string} path
   * @param  {Object={}} body
   * @returns Observable
   */
  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
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
    return this.http.post(
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
    return this.http.delete(
      `${environment.api_url}${path}`,
      { headers: this.setHeaders() }
    )
      .catch(this.formatErrors)
      .map((res: Response) => JSON.parse(res.toString()));
  }
}
