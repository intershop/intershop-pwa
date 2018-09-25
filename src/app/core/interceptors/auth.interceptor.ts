// tslint:disable:no-any
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take, tap } from 'rxjs/operators';

import { SetAPIToken, getAPIToken } from '../store/user';

const tokenHeaderKeyName = 'authentication-token';
const authorizationHeaderKey = 'Authorization';

function setTokenFromResponse(store: Store<{}>, event: HttpEvent<any>) {
  if (event instanceof HttpResponse) {
    const tokenReturned = event.headers.get(tokenHeaderKeyName);
    if (tokenReturned) {
      store.dispatch(new SetAPIToken(tokenReturned));
    }
  }
}

/**
 * Intercepts outgoing HTTP request and sets authentication-token if available.
 * Intercepts incoming HTTP response and updates authentication-token.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<{}>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.pipe(
      select(getAPIToken),
      take(1),
      map(
        token =>
          token && !req.headers.has(authorizationHeaderKey)
            ? req.clone({ headers: req.headers.set(tokenHeaderKeyName, token) })
            : req
      ),
      concatMap(r => next.handle(r).pipe(tap(event => setTokenFromResponse(this.store, event))))
    );
  }
}
