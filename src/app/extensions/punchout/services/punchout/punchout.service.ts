import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Link } from 'ish-core/models/link/link.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';

import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';

@Injectable({ providedIn: 'root' })
export class PunchoutService {
  constructor(private apiService: ApiService, private store: Store) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), whenTruthy(), take(1));

  /**
   * Returns the list of active baskets for the current user. The first basket is the last modified basket.
   * Use this method to check if the user has at least one active basket
   * @returns         An array of basket base data.
   */
  getUsers(): Observable<PunchoutUser[]> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get(`customers/${customer.customerNo}/punchouts/oci/users`)
          .pipe(unpackEnvelope<Link>(), this.apiService.resolveLinks<PunchoutUser>())
      )
    );
  }
}
