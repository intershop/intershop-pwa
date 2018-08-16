// tslint:disable:no-any
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, map, take, tap } from 'rxjs/operators';

import { CoreState } from '../store/core.state';
import { SetAPIToken, getAPIToken } from '../store/user';

const tokenHeaderKeyName = 'authentication-token';
const authorizationHeaderKey = 'Authorization';

function setTokenFromResponse(store: Store<CoreState>, event: HttpEvent<any>) {
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
  constructor(private store: Store<CoreState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.pipe(
      select(getAPIToken),
      take(1),
      map(
        TOKEN =>
          TOKEN && !req.headers.has(authorizationHeaderKey)
            ? req.clone({ headers: req.headers.set(tokenHeaderKeyName, TOKEN) })
            : req
      ),
      concatMap(r => next.handle(r).pipe(tap(event => setTokenFromResponse(this.store, event))))
    );
  }
}
