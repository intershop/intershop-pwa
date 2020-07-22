import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, MonoTypeOperatorFunction, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { communicationTimeoutError, serverError } from 'ish-core/store/core/error';

@Injectable({ providedIn: 'root' })
export class ApiServiceErrorHandler {
  constructor(private store: Store) {}

  handleErrors<T>(dispatch: boolean): MonoTypeOperatorFunction<T> {
    return catchError(error => {
      if (dispatch) {
        if (error.status === 0) {
          this.store.dispatch(communicationTimeoutError({ error }));
          return EMPTY;
        } else if (error.status >= 500 && error.status < 600) {
          this.store.dispatch(serverError({ error }));
          return EMPTY;
        }
      }
      return throwError(error);
    });
  }
}
