import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

/* eslint-disable @typescript-eslint/ban-types */

/**
 *  reload page when the pgid of the user has changed
 */
@Injectable()
export class PGIDChangeInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.name === 'HttpErrorResponse' &&
          error.message === 'Bad Request (The provided matrix parameter "pgid" does not match the authenticated user.)'
        ) {
          return throwError(() => window.location.reload());
        }
        return throwError(() => error);
      })
    );
  }
}
