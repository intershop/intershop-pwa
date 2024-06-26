import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { CreateReturnRequestPayload } from '../models/return-request/return-request.model';
import {
  createReturnRequest,
  getGuestOrders,
  getReasons,
  getReturnRequestError,
  getReturnRequestLoading,
  getReturnRequests,
  getReturnableItems,
  loadOrderByDocumentNoAndEmail,
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

  getOrderReturnableItems$(request: { orderId?: string; documentNo?: string; email?: string; isGuest: boolean }) {
    this.store.dispatch(loadOrderReturnableItems({ ...request }));
    return this.store.pipe(select(getReturnableItems));
  }

  getOrderReturnRequests$(orderIds: string[]) {
    this.store.dispatch(loadOrderReturnRequests({ orderIds }));
    return this.store.pipe(select(getReturnRequests));
  }

  createRequest(request: CreateReturnRequestPayload) {
    this.store.dispatch(createReturnRequest({ request }));
  }

  getGuestUserOrders$(documentNo: string, email: string) {
    this.store.dispatch(loadOrderByDocumentNoAndEmail({ documentNo, email }));
    return this.store.pipe(select(getGuestOrders));
  }
}
