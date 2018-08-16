import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable, throwError } from 'rxjs';

import { HttpErrorMapper } from '../../../models/http-error/http-error.mapper';
import { CoreState } from '../../store/core.state';
import { CommunicationTimeoutError, ServerError } from '../../store/error/error.actions';

@Injectable({ providedIn: 'root' })
export class ApiServiceErrorHandler {
  constructor(private store: Store<CoreState>) {}

  // tslint:disable-next-line:ban-types
  dispatchCommunicationErrors<T>(error: HttpErrorResponse): Observable<T> {
    const mappedError = HttpErrorMapper.fromError(error);

    if (error.status === 0) {
      this.store.dispatch(new CommunicationTimeoutError(mappedError));
      return EMPTY;
    }
    if (error.status >= 500 && error.status < 600) {
      this.store.dispatch(new ServerError(mappedError));
      return EMPTY;
    }
    return throwError(error);
  }
}
