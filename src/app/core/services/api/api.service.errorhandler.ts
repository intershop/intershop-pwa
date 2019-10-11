import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable, throwError } from 'rxjs';

import { HttpErrorMapper } from 'ish-core/models/http-error/http-error.mapper';
import { CommunicationTimeoutError, ServerError } from 'ish-core/store/error';

@Injectable({ providedIn: 'root' })
export class ApiServiceErrorHandler {
  constructor(private store: Store<{}>) {}

  // tslint:disable-next-line:ban-types
  dispatchCommunicationErrors<T>(error: HttpErrorResponse): Observable<T> {
    const mappedError = HttpErrorMapper.fromError(error);

    if (error.status === 0) {
      console.error(error);
      this.store.dispatch(new CommunicationTimeoutError({ error: mappedError }));
      return EMPTY;
    }
    if (error.status >= 500 && error.status < 600) {
      console.error(error);
      this.store.dispatch(new ServerError({ error: mappedError }));
      return EMPTY;
    }
    return throwError(error);
  }
}
