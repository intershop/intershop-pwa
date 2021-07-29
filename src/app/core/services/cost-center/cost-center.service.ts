import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UserCostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { CustomerData } from 'ish-core/models/customer/customer.interface';

import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CostCenterService {
  constructor(private apiService: ApiService, private store: Store) {}

  getCostCenterForBusinessUser(): Observable<UserCostCenter> {
    return this.store.pipe(
      select(getLoggedInCustomer),
      map(customer => customer?.customerNo || '-'),
      take(1),
      concatMap(customerNo => this.apiService.get<UserCostCenter>(`customers/${customerNo}/users/-/costcenters`))
    );
  }
}
