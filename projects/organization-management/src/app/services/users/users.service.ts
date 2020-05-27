import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { ApiService } from 'ish-core/services/api/api.service';

import { B2bUserMapper } from '../../models/b2b-user/b2b-user.mapper';
import { B2bUser, CustomerB2bUserType } from '../../models/b2b-user/b2b-user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private apiService: ApiService) {}

  /**
   * Get all users of a customer. The current user is expected to have user management permission.
   * @returns               All users of the customer.
   */
  getUsers(): Observable<B2bUser[]> {
    return this.apiService.get(`customers/-/users`).pipe(map(B2bUserMapper.fromListData));
  }

  /**
   * Get the data of a b2b user. The current user is expected to have user management permission.
   * @param login  The login of the user.
   * @returns      The user.
   */
  getUser(login: string): Observable<B2bUser> {
    return this.apiService.get(`customers/-/users/${login}`).pipe(map(B2bUserMapper.fromData));
  }

  /**
   * Create a b2b user. The current user is expected to have user management permission.
   * @param body  The user data (customer, user, credentials, address) to create a new user.
   * @returns     The created user.
   */
  addUser(body: CustomerB2bUserType): Observable<B2bUser> {
    if (!body || !body.customer || !body.user) {
      return throwError('addUser() called without required body data');
    }

    return this.apiService
      .post<B2bUser>(`customers/${body.customer.customerNo}/users`, {
        type: 'SMBCustomerUserCollection',
        name: 'Users',
        elements: [
          {
            ...body.customer,
            ...body.user,
            preferredInvoiceToAddress: { urn: body.user.preferredInvoiceToAddressUrn },
            preferredShipToAddress: { urn: body.user.preferredShipToAddressUrn },
            preferredPaymentInstrument: { id: body.user.preferredPaymentInstrumentId },
            preferredInvoiceToAddressUrn: undefined,
            preferredShipToAddressUrn: undefined,
            preferredPaymentInstrumentId: undefined,
          },
        ],
      })
      .pipe(concatMap(() => this.getUser(body.user.email)));
  }

  /**
   * Update a b2b user. The current user is expected to have user management permission.
   * @param body  The user data (customer, user, credentials, address) to update  the user.
   * @returns     The updated user.
   */
  updateUser(body: CustomerB2bUserType): Observable<B2bUser> {
    if (!body || !body.customer || !body.user) {
      return throwError('updateUser() called without required body data');
    }

    return this.apiService
      .put<B2bUser>(`customers/${body.customer.customerNo}/users/${body.user.login}`, {
        ...body.customer,
        ...body.user,
        preferredInvoiceToAddress: { urn: body.user.preferredInvoiceToAddressUrn },
        preferredShipToAddress: { urn: body.user.preferredShipToAddressUrn },
        preferredPaymentInstrument: { id: body.user.preferredPaymentInstrumentId },
        preferredInvoiceToAddressUrn: undefined,
        preferredShipToAddressUrn: undefined,
        preferredPaymentInstrumentId: undefined,
      })
      .pipe(map(B2bUserMapper.fromData));
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

    return this.apiService.delete(`customers/-/users/${login}`);
  }
}
