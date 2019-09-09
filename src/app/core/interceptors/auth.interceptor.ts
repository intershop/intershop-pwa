import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from 'ish-core/services/api/api.service';
import { SetAPIToken } from 'ish-core/store/user';

function setTokenFromResponse(store: Store<{}>, event: HttpEvent<unknown>) {
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

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(tap(event => setTokenFromResponse(this.store, event)));
  }
}
