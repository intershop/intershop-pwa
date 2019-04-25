import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import b64u from 'b64u';

import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { CustomerData } from 'ish-core/models/customer/customer.interface';
import { CustomerMapper } from 'ish-core/models/customer/customer.mapper';
import { UserMapper } from 'ish-core/models/user/user.mapper';
import { Credentials, LoginCredentials } from '../../models/credentials/credentials.model';
import { Customer, CustomerRegistrationType, CustomerUserType } from '../../models/customer/customer.model';
import { User } from '../../models/user/user.model';
import { ApiService } from '../api/api.service';
/**
 * The User Service handles the registration related interaction with the 'customers' REST API.
 */

// request data type for create user
declare interface CreatePrivateCustomerType extends CustomerData {
  address: Address;
  credentials: Credentials;
}

declare interface CreateBusinessCustomerType extends Customer {
  address: Address;
  credentials: Credentials;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private apiService: ApiService) {}

  /**
   * Sign in an existing user with the given login credentials (login, password).
   * @param loginCredentials  The users login credentials {login: 'foo', password. 'bar'}.
   * @returns                 The logged in customer data.
   *                          For private customers user data are also returned.
   *                          For business customers user data are returned by a separate call (getCompanyUserData).
   */
  signinUser(loginCredentials: LoginCredentials): Observable<CustomerUserType> {
    const headers = new HttpHeaders().set(
      'Authorization',
      'BASIC ' + b64u.toBase64(b64u.encode(`${loginCredentials.login}:${loginCredentials.password}`))
    );
    return this.apiService.get<CustomerData>('customers/-', { headers }).pipe(map(CustomerMapper.mapLoginData));
  }

  signinUserByToken(apiToken: string): Observable<CustomerUserType> {
    const headers = new HttpHeaders().set(ApiService.TOKEN_HEADER_KEY, apiToken);
    return this.apiService
      .get<CustomerData>('customers/-', { headers, skipApiErrorHandling: true, runExclusively: true })
      .pipe(
        map(CustomerMapper.mapLoginData),
        // tslint:disable-next-line:ban
        catchError(() => EMPTY)
      );
  }

  /**
   * Create a new user for the given data.
   * @param body  The user data (customer, user, credentials, address) to create a new user.
   */
  createUser(body: CustomerRegistrationType): Observable<void> {
    if (!body || !body.customer || !body.user || !body.credentials || !body.address) {
      return throwError('createUser() called without required body data');
    }

    if (!body.customer.type) {
      return throwError('createUser() called without required customer type (PrivateCustomer/SMBCustomer)');
    }

    let newCustomer: CreatePrivateCustomerType | CreateBusinessCustomerType;

    if (body.customer.type === 'PrivateCustomer') {
      newCustomer = {
        ...body.customer,
        ...body.user,
        address: body.address,
        credentials: body.credentials,
      };
    } else {
      newCustomer = {
        ...body.customer,
        // TODO: the addition of 'login: body.user.email' is a temporary fix for an ICM 7.10.7.3 API break
        user: { ...body.user, login: body.user.email },
        address: body.address,
        credentials: body.credentials,
      };
    }

    return this.apiService.post<void>('customers', newCustomer);
  }

  /**
   * Updates the data of the currently logged in user.
   * @param body  The user data (customer, user ) to update the user.
   */
  updateUser(body: CustomerUserType): Observable<User> {
    if (!body || !body.customer || !body.user) {
      return throwError('updateUser() called without required body data');
    }

    if (!body.customer.type) {
      return throwError('updateUser() called without required customer type (PrivateCustomer/SMBCustomer)');
    }

    const changedUser = {
      ...body.customer,
      ...body.user,
      preferredInvoiceToAddress: { urn: body.user.preferredInvoiceToAddressUrn },
      preferredShipToAddress: { urn: body.user.preferredShipToAddressUrn },
      preferredInvoiceToAddressUrn: undefined,
      preferredShipToAddressUrn: undefined,
    };

    if (body.customer.type === 'PrivateCustomer') {
      return this.apiService.put<User>('customers/-', changedUser).pipe(map(UserMapper.fromData));
    } else {
      return this.apiService.put<User>('customers/-/users/-', changedUser).pipe(map(UserMapper.fromData));
    }
  }

  /**
   * Get User data for the logged in Business Customer.
   * @returns The related customer user data.
   */
  getCompanyUserData(): Observable<User> {
    return this.apiService.get('customers/-/users/-').pipe(map(UserMapper.fromData));
  }
}
