import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { _throw } from 'rxjs/observable/throw';
import { CoreState } from '../store/core.state';
import * as errorActions from '../store/error/error.actions';

@Injectable()
export class ApiServiceErrorHandler {
  constructor(private store: Store<CoreState>) {}

  dispatchCommunicationErrors<T>(error: HttpErrorResponse): Observable<T> {
    if (error.status === 0) {
      this.store.dispatch(new errorActions.CommunicationTimeoutError(error));
      return empty();
    }
    if (error.status >= 500 && error.status < 600) {
      this.store.dispatch(new errorActions.ServerError(error));
      return empty();
    }
    return _throw(error);
  }
}
