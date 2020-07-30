import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { distinctUntilChanged, map, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';

import { selectRouteParam, selectUrl } from 'ish-core/store/core/router';
import { log } from 'ish-core/utils/dev/operators';

import {
  getRequisition,
  getRequisitions,
  getRequisitionsError,
  getRequisitionsLoading,
  getRequisitionsStatus,
  loadRequisition,
  loadRequisitions,
} from '../store/requisitions';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class RequisitionManagementFacade {
  constructor(private store: Store) {}

  requisitionsError$ = this.store.pipe(select(getRequisitionsError));
  requisitionsLoading$ = this.store.pipe(select(getRequisitionsLoading));
  requisitionsStatus$ = this.store.pipe(select(getRequisitionsStatus));

  requisitions$ = this.store.pipe(
    select(selectRouteParam('status')),
    withLatestFrom(
      this.store.pipe(
        select(selectUrl),
        map(url => (url.includes('/buyer/') ? 'buyer' : 'approver'))
      )
    ),
    distinctUntilChanged(),
    log('facade requisitions'),
    tap(([status, view]) => this.store.dispatch(loadRequisitions({ view, status }))),
    switchMapTo(this.store.pipe(select(getRequisitions)))
  );

  requisition$(requisitionId: string) {
    // TODO: did not work with route selection
    // select(selectRouteParam('requisitionId')),

    this.store.dispatch(loadRequisition({ requisitionId }));
    return this.store.pipe(select(getRequisition));
  }
}
