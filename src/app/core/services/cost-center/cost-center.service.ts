import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/customer/user';
import { log } from 'ish-core/utils/dev/operators';
import { whenTruthy } from 'ish-core/utils/operators';

@Injectable({ providedIn: 'root' })
export class CostCenterService {
  constructor(private apiService: ApiService, private store: Store) {}

  getCostCenterForBusinessUser(): Observable<CostCenter> {
    return combineLatest([
      this.store.pipe(select(getLoggedInCustomer), whenTruthy()),
      this.store.pipe(select(getLoggedInUser), whenTruthy()),
    ]).pipe(
      log(),
      switchMap(([customer, user]) =>
        this.apiService.get<CostCenter>(
          `customers/${customer.customerNo}/users/${encodeURIComponent(user.login)}/costcenters`
        )
      )
    );
  }
}
