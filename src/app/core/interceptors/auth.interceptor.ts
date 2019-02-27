// tslint:disable:no-any
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from 'ish-core/services/api/api.service';
import { SetAPIToken } from '../store/user';

function setTokenFromResponse(store: Store<{}>, event: HttpEvent<any>) {
  if (event instanceof HttpResponse) {
    const apiToken = event.headers.get(ApiService.TOKEN_HEADER_KEY);
    if (apiToken) {
      store.dispatch(new SetAPIToken({ apiToken }));
    }
  }
}

/**
 * Intercepts incoming HTTP response and updates authentication-token.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<{}>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(tap(event => setTokenFromResponse(this.store, event)));
  }
}
