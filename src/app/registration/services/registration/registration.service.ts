import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { LoginCredentials } from '../../../models/credentials/credentials.model';
import { Customer } from '../../../models/customer/customer.model';
import { User } from '../../../models/user/user.model';

/**
 * The Registration Service handles the registration related interaction with the 'customers' REST API.
 */
@Injectable()
export class RegistrationService {
  constructor(private apiService: ApiService) {}

  /**
   * Sign in an existing user with the given login credentials (login, password).
   * @param loginCredentials  The users login credentials {login: 'foo', password. 'bar'}.
   * @returns                 The logged in user data.
   */
  signinUser(loginCredentials: LoginCredentials): Observable<Customer> {
    const headers = new HttpHeaders().set(
      'Authorization',
      'BASIC ' + Buffer.from(loginCredentials.login + ':' + loginCredentials.password).toString('base64')
    );
    return this.apiService.get<Customer>('customers/-', null, headers);
  }

  /**
   * Create a new user with the given customer data.
   * @param newCustomer  The user data to create a new user.
   * @returns            The created user data.
   */
  createUser(newCustomer: Customer): Observable<Customer> {
    return this.apiService.post<Customer>('customers', newCustomer).pipe(
      // TODO:see #IS-22750 - user should actually be logged in after registration
      switchMap(() => this.signinUser(newCustomer.credentials))
    );
  }

  /**
   * Get User data for the logged in Business Customer.
   * @returns The related customer user data.
   */
  getCompanyUserData(): Observable<User> {
    return this.apiService.get('customers/-/users/-');
  }
}
