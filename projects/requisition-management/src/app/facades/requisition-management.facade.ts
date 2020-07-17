import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getRequisitions, getRequisitionsError, getRequisitionsLoading, loadRequisitions } from '../store/requisitions';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class RequisitionManagementFacade {
  constructor(private store: Store) {}

  requisitionsError$ = this.store.pipe(select(getRequisitionsError));
  requisitionsLoading$ = this.store.pipe(select(getRequisitionsLoading));

  requisitions$() {
    this.store.dispatch(loadRequisitions());
    return this.store.pipe(select(getRequisitions));
  }
}
