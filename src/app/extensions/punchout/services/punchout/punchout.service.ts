import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
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
   * Gets the list of oci punchout users.
   * @returns    An array of puchout users.
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

  /**
   * Creates an oci punchout user (connection).
   * @param user    The punchout user.
   * @returns       The created punchout user.
   */
  createUser(user: PunchoutUser): Observable<PunchoutUser> {
    if (!user) {
      return throwError('createUser() of the punchout service called without punchout user');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .post(`customers/${customer.customerNo}/punchouts/oci/users`, user)
          .pipe(this.apiService.resolveLink<PunchoutUser>())
      )
    );
  }

  /**
   * Deletes an oci punchout user (connection).
   * @param login   The login of the punchout user.
   */
  deleteUser(login: string): Observable<void> {
    if (!login) {
      return throwError('deleteUser() of the punchout service called without login');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService.delete<void>(`customers/${customer.customerNo}/punchouts/oci/users/${login}`)
      )
    );
  }
}
