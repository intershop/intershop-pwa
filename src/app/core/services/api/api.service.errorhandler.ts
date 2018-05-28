import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable, throwError } from 'rxjs';
import { CoreState } from '../../store/core.state';
import * as errorActions from '../../store/error/error.actions';

@Injectable({ providedIn: 'root' })
export class ApiServiceErrorHandler {
  constructor(private store: Store<CoreState>) {}

  dispatchCommunicationErrors<T>(error: HttpErrorResponse): Observable<T> {
    if (error.status === 0) {
      this.store.dispatch(new errorActions.CommunicationTimeoutError(error));
      return EMPTY;
    }
    if (error.status >= 500 && error.status < 600) {
      this.store.dispatch(new errorActions.ServerError(error));
      return EMPTY;
    }
    return throwError(error);
  }
}
