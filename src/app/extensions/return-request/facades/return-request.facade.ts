import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { CreateReturnRequestPayload } from '../models/return-request/return-request.model';
import {
  createReturnRequest,
  getReasons,
  getReturnRequestError,
  getReturnRequestLoading,
  getReturnRequests,
  getReturnableItems,
  loadOrderReturnReasons,
  loadOrderReturnRequests,
  loadOrderReturnableItems,
} from '../store/return-request';

@Injectable({ providedIn: 'root' })
export class ReturnRequestFacade {
  constructor(private store: Store) {}

  returnRequestLoading$ = this.store.pipe(select(getReturnRequestLoading));
  returnRequestError$ = this.store.pipe(select(getReturnRequestError));

  getReturnReasons$() {
    this.store.dispatch(loadOrderReturnReasons());
    return this.store.pipe(select(getReasons));
  }

  getOrderReturnableItems$(orderId: string) {
    this.store.dispatch(loadOrderReturnableItems({ orderId }));
    return this.store.pipe(select(getReturnableItems));
  }

  getOrderReturnRequests$(orderIds: string[]) {
    this.store.dispatch(loadOrderReturnRequests({ orderIds }));
    return this.store.pipe(select(getReturnRequests));
  }

  createRequest(orderId: string, body: CreateReturnRequestPayload) {
    this.store.dispatch(createReturnRequest({ orderId, body }));
  }
}
