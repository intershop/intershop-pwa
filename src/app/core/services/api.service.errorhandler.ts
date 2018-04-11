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
    switch (error.status) {
      case 0:
        this.store.dispatch(new errorActions.CommunicationTimeoutError(error));
        return empty();
      case 500:
        this.store.dispatch(new errorActions.InternalServerError(error));
        return empty();
      case 501:
        this.store.dispatch(new errorActions.NotImplementedError(error));
        return empty();
      case 502:
        this.store.dispatch(new errorActions.BadGatewayError(error));
        return empty();
      case 503:
        this.store.dispatch(new errorActions.ServiceUnavailableError(error));
        return empty();
      case 504:
        this.store.dispatch(new errorActions.GatewayTimeoutError(error));
        return empty();
      case 505:
        this.store.dispatch(new errorActions.HttpVersionNotSupportedError(error));
        return empty();
      case 506:
        this.store.dispatch(new errorActions.VariantAlsoNegotiatesError(error));
        return empty();
      case 507:
        this.store.dispatch(new errorActions.InsufficientStorageError(error));
        return empty();
      case 508:
        this.store.dispatch(new errorActions.LoopDetectedError(error));
        return empty();
      case 509:
        this.store.dispatch(new errorActions.BandwidthLimitExceededError(error));
        return empty();
      case 510:
        this.store.dispatch(new errorActions.NotExtendedError(error));
        return empty();
      case 511:
        this.store.dispatch(new errorActions.NetworkAuthenticationRequiredError(error));
        return empty();
    }
    return _throw(error);
  }
}
