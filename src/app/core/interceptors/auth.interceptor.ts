// tslint:disable:no-any
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

let TOKEN: string;

const tokenHeaderKeyName = 'authentication-token';
const authorizationHeaderKey = 'Authorization';

/**
 * Intercepts outgoing HTTP request and sets authentication-token if available.
 * Intercepts incoming HTTP response and updates authentication-token.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (TOKEN && !req.headers.has(authorizationHeaderKey)) {
      req = req.clone({ headers: req.headers.set(tokenHeaderKeyName, TOKEN) });
    }

    return next.handle(req).pipe(tap(this.setTokenFromResponse));
  }

  private setTokenFromResponse(event: HttpEvent<any>) {
    if (event instanceof HttpResponse) {
      const response = <HttpResponse<any>>event;
      const tokenReturned = response.headers.get(tokenHeaderKeyName);
      if (tokenReturned) {
        TOKEN = tokenReturned;
      }
    }
  }
}

// visible for testing
export function _setToken(token: string) {
  TOKEN = token;
}
