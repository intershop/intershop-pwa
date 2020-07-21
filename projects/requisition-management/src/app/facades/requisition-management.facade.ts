import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map, switchMapTo, tap } from 'rxjs/operators';

import { selectRouteParam, selectUrl } from 'ish-core/store/core/router';

import { getRequisitions, getRequisitionsError, getRequisitionsLoading, loadRequisitions } from '../store/requisitions';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class RequisitionManagementFacade {
  constructor(private store: Store) {}

  requisitionsError$ = this.store.pipe(select(getRequisitionsError));
  requisitionsLoading$ = this.store.pipe(select(getRequisitionsLoading));

  requisitions$ = combineLatest([
    this.store.pipe(select(selectRouteParam('state'))),
    this.store.pipe(
      select(selectUrl),
      map(url => (url.includes('/buyer/') ? 'buyer' : 'approver'))
    ),
  ]).pipe(
    tap(([status, view]) => this.store.dispatch(loadRequisitions({ view, status }))),
    switchMapTo(this.store.pipe(select(getRequisitions)))
  );
}
