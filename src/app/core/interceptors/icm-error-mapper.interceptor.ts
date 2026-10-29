import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ErrorHandler, Injectable, InjectionToken, Injector } from '@angular/core';
import { pick } from 'lodash-es';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorHelper } from 'ish-core/models/http-error/http-error.helper';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

/* eslint-disable @typescript-eslint/no-restricted-types */

export interface SpecialHttpErrorHandler {
  test(error: HttpErrorResponse, request: HttpRequest<unknown>): boolean;
  map(error: HttpErrorResponse, request: HttpRequest<unknown>): Partial<HttpError>;
}

export const SPECIAL_HTTP_ERROR_HANDLER = new InjectionToken<SpecialHttpErrorHandler>('specialHttpErrorHandler');

@Injectable()
export class ICMErrorMapperInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private errorHandler: ErrorHandler
  ) {}

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
          parameters?: Record<string, string>;
          causes?: {
            code: string;
            message: string;
            parameters?: Record<string, string>;
            paths: string[];
          }[];
        }[] = httpError.error.errors;
        if (errors.length === 1) {
          const error = errors[0];
          if (error.causes?.length) {
            return {
              ...responseError,
              errors: httpError.error?.errors,
              message: [HttpErrorHelper.escapeParameters(error.message, error.parameters)]
                .concat(
                  ...error.causes.map(c =>
                    HttpErrorHelper.escapeParameters(c.message, { ...error.parameters, ...c.parameters })
                  )
                )
                .join(' '),
            };
          }
        }
        return {
          ...responseError,
          errors: httpError.error?.errors,
        };
      }
      // new ADR error format with messages array
      else if (httpError.error?.messages?.length) {
        const errors: {
          code: string;
          message?: string;
          parameters?: Record<string, string>;
          causes?: {
            code: string;
            message: string;
            parameters?: Record<string, string>;
          }[];
        }[] = httpError.error?.messages;
        if (errors.length > 0) {
          const error = errors[0];
          const message = HttpErrorHelper.escapeParameters(error.message, error.parameters);
          return {
            ...responseError,
            errors: httpError.error.messages,
            // if there are causes, concatenate the main message with the causes messages, otherwise use the main message
            message: (message ? '<div>'.concat(message).concat('</div>') : '').concat(
              error.causes?.length
                ? error.causes
                    .map(c =>
                      '<div>'
                        .concat(HttpErrorHelper.escapeParameters(c.message, { ...error.parameters, ...c.parameters }))
                        .concat('</div>')
                    )
                    .join('')
                : ''
            ),
          };
        }
        return {
          ...responseError,
          errors: httpError.error?.errors,
        };
      }

      // handle all other error responses with error object
      return {
        ...responseError,
        // eslint-disable-next-line @typescript-eslint/no-deprecated -- TODO: drop statusText fallback (always 'OK' under HTTP/2)
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
