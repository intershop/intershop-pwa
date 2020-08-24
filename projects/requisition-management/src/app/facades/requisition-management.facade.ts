import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, map, switchMapTo, tap } from 'rxjs/operators';

import { selectRouteParam, selectUrl } from 'ish-core/store/core/router';

import { RequisitionStatus, RequisitionViewer } from '../models/requisition/requisition.model';
import {
  getRequisition,
  getRequisitions,
  getRequisitionsError,
  getRequisitionsLoading,
  loadRequisition,
  loadRequisitions,
  updateRequisitionStatus,
} from '../store/requisitions';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class RequisitionManagementFacade {
  constructor(private store: Store) {}

  requisitionsError$ = this.store.pipe(select(getRequisitionsError));
  requisitionsLoading$ = this.store.pipe(select(getRequisitionsLoading));

  requisitionsStatus$ = this.store.pipe(
    select(selectRouteParam('requisitionStatus')),
    map(status => status || 'pending')
  );
  selectedRequisition$ = this.store.pipe(select(getRequisition));

  requisitions$ = combineLatest([
    this.store.pipe(select(selectRouteParam('requisitionStatus')), distinctUntilChanged()),
    this.store.pipe(
      select(selectUrl),
      map(url => (url.includes('/buyer') ? 'buyer' : 'approver')),
      distinctUntilChanged()
    ),
  ]).pipe(
    tap(([istatus, iview]) => {
      const status = (istatus as RequisitionStatus) || 'pending';
      const view = iview as RequisitionViewer;

      this.store.dispatch(loadRequisitions({ view, status }));
    }),
    switchMapTo(this.store.pipe(select(getRequisitions)))
  );

  requisition$(requisitionId: string) {
    // TODO: did not work with route selection
    // select(selectRouteParam('requisitionId')),

    this.store.dispatch(loadRequisition({ requisitionId }));
    return this.store.pipe(select(getRequisition));
  }

  approveRequisition$(requisitionId: string) {
    this.store.dispatch(updateRequisitionStatus({ requisitionId, status: 'approved' }));
    return this.store.pipe(select(getRequisition));
  }

  rejectRequisition$(requisitionId: string, comment?: string) {
    this.store.dispatch(updateRequisitionStatus({ requisitionId, status: 'rejected', approvalComment: comment }));
    return this.store.pipe(select(getRequisition));
  }
}
