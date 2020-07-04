import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { concatMap, map, switchMap, take } from 'rxjs/operators';

import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';

import { B2bUserMapper } from '../../models/b2b-user/b2b-user.mapper';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private apiService: ApiService, private store: Store) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), whenTruthy(), take(1));

  /**
   * Get all users of a customer. The current user is expected to have user management permission.
   * @returns               All users of the customer.
   */
  getUsers(): Observable<B2bUser[]> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService.get(`customers/${customer.customerNo}/users`).pipe(map(B2bUserMapper.fromListData))
      )
    );
  }

  /**
   * Get the data of a b2b user. The current user is expected to have user management permission.
   * @param login  The login of the user.
   * @returns      The user.
   */
  getUser(login: string): Observable<B2bUser> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService.get(`customers/${customer.customerNo}/users/${login}`).pipe(map(B2bUserMapper.fromData))
      )
    );
  }

  /**
   * Create a b2b user. The current user is expected to have user management permission.
   * @param body  The user data (customer, user, credentials, address) to create a new user.
   * @returns     The created user.
   */
  addUser(user: B2bUser): Observable<B2bUser> {
    if (!user) {
      return throwError('addUser() called without required user data');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .post<B2bUser>(`customers/${customer.customerNo}/users`, {
            type: 'SMBCustomerUserCollection',
            name: 'Users',
            elements: [
              {
                ...customer,
                ...user,
                preferredInvoiceToAddress: { urn: user.preferredInvoiceToAddressUrn },
                preferredShipToAddress: { urn: user.preferredShipToAddressUrn },
                preferredPaymentInstrument: { id: user.preferredPaymentInstrumentId },
                preferredInvoiceToAddressUrn: undefined,
                preferredShipToAddressUrn: undefined,
                preferredPaymentInstrumentId: undefined,
              },
            ],
          })
          .pipe(concatMap(() => this.getUser(user.email)))
      )
    );
  }

  /**
   * Update a b2b user. The current user is expected to have user management permission.
   * @param body  The user data (customer, user, credentials, address) to update  the user.
   * @returns     The updated user.
   */
  updateUser(user: B2bUser): Observable<B2bUser> {
    if (!user) {
      return throwError('updateUser() called without required user data');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .put<B2bUser>(`customers/${customer.customerNo}/users/${user.login}`, {
            ...customer,
            ...user,
            preferredInvoiceToAddress: { urn: user.preferredInvoiceToAddressUrn },
            preferredShipToAddress: { urn: user.preferredShipToAddressUrn },
            preferredPaymentInstrument: { id: user.preferredPaymentInstrumentId },
            preferredInvoiceToAddressUrn: undefined,
            preferredShipToAddressUrn: undefined,
            preferredPaymentInstrumentId: undefined,
          })
          .pipe(map(B2bUserMapper.fromData))
      )
    );
  }

  /**
   * Deletes the data of a b2b user. The current user is expected to have user management permission.
   * @param login  The login of the user.
   * @returns      The user.
   */
  deleteUser(login: string) {
    if (!login) {
      return throwError('deleteUser() called without customerItemUserKey/login');
    }

    return this.currentCustomer$.pipe(
      switchMap(customer => this.apiService.delete(`customers/${customer.customerNo}/users/${login}`))
    );
  }
}
