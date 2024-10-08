import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ErrorHandler, Injectable, InjectionToken, Injector } from '@angular/core';
import { pick } from 'lodash-es';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

/* eslint-disable @typescript-eslint/ban-types */

export interface SpecialHttpErrorHandler {
  test(error: HttpErrorResponse, request: HttpRequest<unknown>): boolean;
  map(error: HttpErrorResponse, request: HttpRequest<unknown>): Partial<HttpError>;
}

export const SPECIAL_HTTP_ERROR_HANDLER = new InjectionToken<SpecialHttpErrorHandler>('specialHttpErrorHandler');

@Injectable()
export class ICMErrorMapperInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private errorHandler: ErrorHandler) {}

  // eslint-disable-next-line complexity
  private mapError(httpError: HttpErrorResponse, request: HttpRequest<unknown>): HttpError {
    const specialHandlers = this.injector.get<SpecialHttpErrorHandler[]>(SPECIAL_HTTP_ERROR_HANDLER, []);
    const specialHandler = specialHandlers.find(handler => handler.test(httpError, request));

    const responseError: HttpError = {
      name: 'HttpErrorResponse',
      status: httpError.status,
    };

    if (specialHandler) {
      return { name: 'HttpErrorResponse', status: httpError.status, ...specialHandler.map(httpError, request) };
    }

    if (httpError.headers?.get('error-type') === 'error-missing-attributes') {
      return { ...responseError, message: httpError.error };
    }

    if (httpError.headers?.get('error-type') === 'error-invalid-attributes') {
      let message = httpError.error;
      if (typeof request.body === 'object') {
        message += JSON.stringify(pick(request.body, httpError.headers?.get('error-invalid-attributes').split(',')));
      }
      return {
        ...responseError,
        message,
      };
    }

    if (httpError.headers?.get('error-key')) {
      return {
        ...responseError,
        code: httpError.headers.get('error-key'),
      };
    }

    if (typeof httpError.error === 'string') {
      return {
        ...responseError,
        message: httpError.error,
      };
    }

    if (typeof httpError.error === 'object') {
      // handle error objects with multiple errors
      if (httpError.error?.errors?.length) {
        const errors: {
          code: string;
          message: string;
          causes?: {
            code: string;
            message: string;
            paths: string[];
          }[];
        }[] = httpError.error.errors;
        if (errors.length === 1) {
          const error = errors[0];
          if (error.causes?.length) {
            return {
              ...responseError,
              errors: httpError.error?.errors,
              message: [error.message].concat(...error.causes.map(c => c.message)).join(' '),
            };
          }
        }
        return {
          ...responseError,
          errors: httpError.error?.errors,
        };
      }
      // new ADR - used for cXML Punchout configuration
      else if (httpError.error?.messages?.length) {
        const errors: {
          code: string;
          causes?: {
            code: string;
            message: string;
          }[];
        }[] = httpError.error?.messages;
        if (errors.length === 1) {
          const error = errors[0];
          if (error.causes?.length) {
            return {
              ...responseError,
              errors: httpError.error.messages,
              message: error.causes.map(c => '<div>'.concat(c.message).concat('</div>')).join(''),
            };
          }
        }
        return {
          ...responseError,
          errors: httpError.error?.errors,
        };
      }

      // handle all other error responses with error object
      return {
        ...responseError,
        code: httpError.error?.code || httpError.statusText,
        message: httpError.error?.message || httpError.message,
      };
    }

    // handle error responses without error object
    return pick(httpError, 'name', 'status', 'message');
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (SSR) {
          this.errorHandler.handleError(error);
        }
        if (error.name === 'HttpErrorResponse') {
          return throwError(() => this.mapError(error, req));
        }
        return throwError(() => error);
      })
    );
  }
}
