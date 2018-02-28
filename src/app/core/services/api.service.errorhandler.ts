import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { CommunicationTimeoutError, CoreState, GeneralError } from '../store/error';
@Injectable()
export class ApiServiceErrorHandler {

    constructor(private store: Store<CoreState>) {}

    dispatchCommunicationErrors(error: HttpErrorResponse): Observable<any> {
        if (error.status === 0) {
            this.store.dispatch(new CommunicationTimeoutError({id: 1, payload: error}));
            return empty();
        }
        if (error.status === 500) {
            this.store.dispatch(new GeneralError({id: 1, payload: error}));
            return empty();
        }
        return _throw(error);
    }
}
