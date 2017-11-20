import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';

let TOKEN: string;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  /**
   * Intercepts out going request and set authentication-token.
   * Intercepts incoming response and update authentication-token.
   * @param  {HttpRequest<any>} req
   * @param  {HttpHandler} next
   * @returns  Observable<HttpEvent<any>>
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenHeaderKeyName = 'authentication-token';
    const authorizationHeaderKey = 'Authorization';

    if (TOKEN && !req.headers.has(authorizationHeaderKey)) {
      req = req.clone({ headers: req.headers.set(tokenHeaderKeyName, TOKEN) });
    }

    return next.handle(req).do(event => {
      if (event instanceof HttpResponse) {
        const response = <HttpResponse<any>>event;
        const tokenReturned = response.headers.get(tokenHeaderKeyName);
        if (tokenReturned) {
          this._setToken(tokenReturned);
        }
      }
    });
  }

  // visible for testing
  _setToken(token: string): void {
    TOKEN = token;
  }
}
