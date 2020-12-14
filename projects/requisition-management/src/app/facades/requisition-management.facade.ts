import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, sample, startWith, switchMap } from 'rxjs/operators';

import { selectRouteParam, selectUrl } from 'ish-core/store/core/router';
import { whenTruthy } from 'ish-core/utils/operators';

import { RequisitionStatus, RequisitionViewer } from '../models/requisition/requisition.model';
import {
  getRequisition,
  getRequisitions,
  getRequisitionsError,
  getRequisitionsLoading,
  loadRequisition,
  loadRequisitions,
} from '../store/requisitions';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class RequisitionManagementFacade {
  constructor(private store: Store, private router: Router) {}

  requisitionsError$ = this.store.pipe(select(getRequisitionsError));
  requisitionsLoading$ = this.store.pipe(select(getRequisitionsLoading));

  requisitionsStatus$ = this.store.pipe(
    select(selectRouteParam('status')),
    map(status => status || 'PENDING')
  );

  selectedRequisition$ = this.store.pipe(
    select(selectRouteParam('requisitionId')),
    whenTruthy(),
    switchMap(requisitionId => this.store.pipe(select(getRequisition(requisitionId))))
  );

  requisition$(requisitionId: string) {
    this.store.dispatch(loadRequisition({ requisitionId }));
    return this.store.pipe(select(getRequisition(requisitionId)));
  }

  requisitions$(view: RequisitionViewer, status: RequisitionStatus) {
    this.store.dispatch(loadRequisitions({ view, status }));
    return this.store.pipe(select(getRequisitions(view, status)));
  }

  requisitionsByRoute$ = combineLatest([
    this.store.pipe(
      select(selectUrl),
      map(url => (url.includes('/buyer') ? 'buyer' : 'approver')),
      distinctUntilChanged()
    ),
    this.store.pipe(select(selectRouteParam('status')), distinctUntilChanged()),
  ]).pipe(
    sample(
      this.router.events.pipe(
        // only when navigation is finished
        filter(e => e instanceof NavigationEnd),
        // fire on first subscription
        startWith({})
      )
    ),
    switchMap(([view, status]) =>
      this.requisitions$(view as RequisitionViewer, (status as RequisitionStatus) || 'PENDING')
    )
  );
}
