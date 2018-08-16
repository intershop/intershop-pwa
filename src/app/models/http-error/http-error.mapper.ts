import { HttpErrorResponse } from '@angular/common/http';

import { HttpError } from './http-error.model';

export class HttpErrorMapper {
  // tslint:disable-next-line:ban-types
  static fromError(error: HttpErrorResponse): HttpError {
    const headers = !error.headers
      ? undefined
      : error.headers.keys().reduce((acc, val) => Object.assign(acc, { [val]: error.headers.get(val) }), {});

    return {
      name: error.name,
      message: error.message,
      error: JSON.stringify(error.error),
      status: error.status,
      statusText: error.statusText,
      headers,
    };
  }
}
