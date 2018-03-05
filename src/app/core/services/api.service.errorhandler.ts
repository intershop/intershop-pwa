import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { CommunicationTimeoutError, InternalServerError, NotImplementedError, BadGatewayError, ServiceUnavailableError, GatewayTimeoutError, HttpVersionNotSupportedError, NetworkAuthenticationRequiredError, NotExtendedError, BandwidthLimitExceededError, LoopDetectedError, InsufficientStorageError, VariantAlsoNegotiatesError, CoreState } from '../store/error';
@Injectable()
export class ApiServiceErrorHandler {

  constructor(private store: Store<CoreState>) { }

  dispatchCommunicationErrors(error: HttpErrorResponse): Observable<any> {
    switch (error.status) {
      case 0:
        this.store.dispatch(new CommunicationTimeoutError(error));
        return empty();
      case 500:
        this.store.dispatch(new InternalServerError(error));
        return empty();
      case 501:
        this.store.dispatch(new NotImplementedError(error));
        return empty();
      case 502:
        this.store.dispatch(new BadGatewayError(error));
        return empty();
      case 503:
        this.store.dispatch(new ServiceUnavailableError(error));
        return empty();
      case 504:
        this.store.dispatch(new GatewayTimeoutError(error));
        return empty();
      case 505:
        this.store.dispatch(new HttpVersionNotSupportedError(error));
        return empty();
      case 506:
        this.store.dispatch(new VariantAlsoNegotiatesError(error));
        return empty();
      case 507:
        this.store.dispatch(new InsufficientStorageError(error));
        return empty();
      case 508:
        this.store.dispatch(new LoopDetectedError(error));
        return empty();
      case 509:
        this.store.dispatch(new BandwidthLimitExceededError(error));
        return empty();
      case 510:
        this.store.dispatch(new NotExtendedError(error));
        return empty();
      case 511:
        this.store.dispatch(new NetworkAuthenticationRequiredError(error));
        return empty();
    }
    return _throw(error);
  }
}
