import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';

import { RequisitionData } from '../../models/requisition/requisition.interface';
import { RequisitionMapper } from '../../models/requisition/requisition.mapper';
import { Requisition } from '../../models/requisition/requisition.model';

@Injectable({ providedIn: 'root' })
export class RequisitionsService {
  constructor(private apiService: ApiService, private store: Store, private requisitionMapper: RequisitionMapper) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), whenTruthy(), take(1));

  getRequisitions(): Observable<Requisition[]> {
    return combineLatest([this.currentCustomer$, this.store.pipe(select(getLoggedInUser), whenTruthy(), take(1))]).pipe(
      switchMap(([customer, user]) =>
        this.apiService.get(`customers/${customer.customerNo}/users/${user.login}/requisitions`).pipe(
          unpackEnvelope<RequisitionData>('data'),
          map(data => data.map(requisitionData => this.requisitionMapper.fromData(requisitionData)))
        )
      )
    );
  }
}
