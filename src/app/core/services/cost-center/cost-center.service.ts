import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CustomerData } from 'ish-core/models/customer/customer.interface';

import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { concatMap, map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CostCenterService {
  constructor(private apiService: ApiService, private store: Store) {}

  getCostCenterForBusinessUser() {
    return this.store.pipe(
      select(getLoggedInCustomer),
      map(customer => customer?.customerNo || '-'),
      take(1),
      concatMap(customerNo => this.apiService.get<CustomerData>(`customers/${customerNo}/users/-/costcenters`))
    );
  }
}
