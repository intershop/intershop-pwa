import { Injectable, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { selectRouteParam, selectUrl } from 'ish-core/store/core/router';
import { whenTruthy } from 'ish-core/utils/operators';

import { Requisition } from '../models/requisition/requisition.model';
import {
  getRequisition,
  getRequisitionsError,
  getRequisitionsLoading,
  loadRequisition,
  updateRequisitionStatus,
} from '../store/requisitions';

@Injectable()
export class RequisitionContextFacade
  extends RxState<{
    id: string;
    loading: boolean;
    error: HttpError;
    entity: Requisition;
    view: 'buyer' | 'approver';
  }>
  implements OnDestroy {
  constructor(private store: Store) {
    super();

    this.connect('id', this.store.pipe(select(selectRouteParam('requisitionId'))));

    this.connect('loading', this.store.pipe(select(getRequisitionsLoading)));

    this.connect('error', this.store.pipe(select(getRequisitionsError)));

    this.connect(
      'entity',
      this.select('id').pipe(
        whenTruthy(),
        distinctUntilChanged(),
        tap(requisitionId => this.store.dispatch(loadRequisition({ requisitionId }))),
        switchMap(requisitionId =>
          this.store.pipe(
            select(getRequisition(requisitionId)),
            whenTruthy(),
            map(entity => entity as Requisition)
          )
        ),
        whenTruthy()
      )
    );

    this.connect(
      'view',
      this.store.pipe(
        select(selectUrl),
        map(url => (url.includes('/buyer') ? 'buyer' : 'approver'))
      )
    );
  }

  approveRequisition$() {
    this.store.dispatch(updateRequisitionStatus({ requisitionId: this.get('entity', 'id'), status: 'APPROVED' }));
  }

  rejectRequisition$(comment?: string) {
    this.store.dispatch(
      updateRequisitionStatus({ requisitionId: this.get('entity', 'id'), status: 'REJECTED', approvalComment: comment })
    );
  }
}
