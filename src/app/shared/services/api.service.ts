import {Injectable} from '@angular/core';
import {Headers, Http, Response, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {JwtService} from './jwt.service';
import {Observable} from 'rxjs/Observable';
import {CustomErrorHandler} from './customErrorHandler';
import {environment} from '../../../environments/environment.prod';

@Injectable()
export class ApiService {
  private _customErrorHandler = new CustomErrorHandler();

  constructor(private http: Http,
              private jwtService: JwtService,) {
  }

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

  private formatErrors(error: any) {
    return this._customErrorHandler.handleApiErros(error);
  }

  get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
    return this.http.get(`${environment.api_url}${path}`, {headers: this.setHeaders(), search: params})
      .map((data: Response) => {
        return data.json();
      })
      .catch(this.formatErrors.bind(this));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${environment.api_url}${path}`,
      JSON.stringify(body),
      {headers: this.setHeaders()}
    )
      .catch(this.formatErrors)
      .map((res: Response) => {
        return res.json();
      });
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      JSON.stringify(body),
      {headers: this.setHeaders()}
    )
      .catch(this.formatErrors)
      .map((res: Response) => {
        return res.json();
      });
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.api_url}${path}`,
      {headers: this.setHeaders()}
    )
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }
}
