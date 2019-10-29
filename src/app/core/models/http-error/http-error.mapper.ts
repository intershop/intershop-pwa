import { HttpErrorResponse } from '@angular/common/http';

import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';

import { HttpError } from './http-error.model';

export class HttpErrorMapper {
  // tslint:disable-next-line:ban-types
  static fromError(error: HttpErrorResponse): HttpError {
    const headers = !error.headers
      ? undefined
      : error.headers.keys().reduce((acc, val) => ({ ...acc, [val]: error.headers.get(val) }), {});

    return {
      name: error.name,
      message: error.message,
      errorCode: HttpErrorMapper.getErrorCode(error),
      error:
        typeof error.error === 'string'
          ? error.error
          : HttpErrorMapper.determineErrorMessage(
              error.error && error.error.errors && error.error.errors.length && error.error.errors[0]
            ),
      status: error.status,
      statusText: error.statusText,
      headers,
    };
  }

  private static determineErrorMessage(error: BasketInfo): string {
    let message = error && error.message;
    if (message && error.causes) {
      message += error.causes.map(cause => (cause.message ? ' ' + cause.message : ''));
    }
    return message || undefined; // undefined is needed to avoid null
  }

  // tslint:disable-next-line:ban-types
  private static getErrorCode(httpErrorResponse: HttpErrorResponse) {
    return (
      (httpErrorResponse &&
        httpErrorResponse.error &&
        httpErrorResponse.error.errors &&
        httpErrorResponse.error.errors[0] &&
        httpErrorResponse.error.errors[0].code) ||
      undefined
    );
  }
}
