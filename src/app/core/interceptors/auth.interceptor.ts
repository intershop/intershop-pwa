import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, switchMapTo, tap } from 'rxjs/operators';

import { ApiService } from 'ish-core/services/api/api.service';
import { ResetAPIToken, SetAPIToken } from 'ish-core/store/user';

/**
 * Intercepts incoming HTTP response and updates authentication-token.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<{}>) {}

  private static isAuthTokenError(err: unknown) {
    return (
      err instanceof HttpErrorResponse && typeof err.error === 'string' && err.error.includes('AuthenticationToken')
    );
  }

  private setTokenFromResponse(event: HttpEvent<unknown>) {
    if (event instanceof HttpResponse) {
      const apiToken = event.headers.get(ApiService.TOKEN_HEADER_KEY);
      if (apiToken) {
        if (apiToken.startsWith('AuthenticationTokenOutdated') || apiToken.startsWith('AuthenticationTokenInvalid')) {
          this.store.dispatch(new ResetAPIToken());
        } else {
          this.store.dispatch(new SetAPIToken({ apiToken }));
        }
      }
    }
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      // tslint:disable-next-line:ban
      catchError(err => {
        if (AuthInterceptor.isAuthTokenError(err)) {
          this.store.dispatch(new ResetAPIToken());

          // retry request without auth token
          const retryRequest = req.clone({ headers: req.headers.delete(ApiService.TOKEN_HEADER_KEY) });
          // timer introduced for testability
          return timer(10).pipe(switchMapTo(next.handle(retryRequest)));
        }
        return throwError(err);
      }),
      tap(event => this.setTokenFromResponse(event))
    );
  }
}
