import { HttpErrorResponse } from '@angular/common/http';

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

  private static determineErrorMessage(error: { message: string; causes: { message: string }[] }): string {
    let message = error && error.message;
    if (message && error.causes) {
      message += error.causes.map(cause => (cause.message ? ' ' + cause.message : ''));
    }
    return message || undefined; // undefined is needed to avoid null
  }
}
