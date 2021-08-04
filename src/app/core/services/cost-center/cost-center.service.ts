import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/customer/user';

@Injectable({ providedIn: 'root' })
export class CostCenterService {
  constructor(private apiService: ApiService, private store: Store) {}

  getCostCenterForBusinessUser(): Observable<CostCenter> {
    return this.store.pipe(
      withLatestFrom(this.store.pipe(select(getLoggedInUser)), this.store.pipe(select(getLoggedInCustomer))),
      switchMap(([, user, customer]) =>
        this.apiService.get<CostCenter>(
          `customers/${customer.customerNo}/users/${encodeURIComponent(user.login)}/costcenters`
        )
      )
    );
  }
}
