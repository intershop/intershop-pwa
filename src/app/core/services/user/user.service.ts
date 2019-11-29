import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import b64u from 'b64u';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { Credentials, LoginCredentials } from 'ish-core/models/credentials/credentials.model';
import { CustomerData } from 'ish-core/models/customer/customer.interface';
import { CustomerMapper } from 'ish-core/models/customer/customer.mapper';
import { Customer, CustomerRegistrationType, CustomerUserType } from 'ish-core/models/customer/customer.model';
import { PasswordReminderUpdate } from 'ish-core/models/password-reminder-update/password-reminder-update.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { UserMapper } from 'ish-core/models/user/user.mapper';
import { User } from 'ish-core/models/user/user.model';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';
/**
 * The User Service handles the registration related interaction with the 'customers' REST API.
 */

// request data type for create user
interface CreatePrivateCustomerType extends CustomerData {
  address: Address;
  credentials: Credentials;
}

interface CreateBusinessCustomerType extends Customer {
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
      ApiService.AUTHORIZATION_HEADER_KEY,
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

    const customerAddress = {
      ...body.address,
      mainDivision: body.address.mainDivisionCode,
    };
    let newCustomer: CreatePrivateCustomerType | CreateBusinessCustomerType;

    if (body.customer.type === 'PrivateCustomer') {
      newCustomer = {
        ...body.customer,
        ...body.user,
        address: customerAddress,
        credentials: body.credentials,
      };
    } else {
      newCustomer = {
        ...body.customer,
        user: { ...body.user },
        address: customerAddress,
        credentials: body.credentials,
      };
    }

    if (body.captchaResponse) {
      return this.apiService.post<void>('customers', newCustomer, {
        headers: this.appendCaptchaHeaders(body.captchaResponse, body.captchaAction),
      });
      // without captcha
    } else {
      return this.apiService.post<void>('customers', newCustomer);
    }
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
   * Updates the password of the currently logged in user.
   * @param customer         The current customer.
   * @param user             The current user.
   * @param password         The new password to update to.
   * @param currentPassword  The users old password for verification.
   */
  updateUserPassword(customer: Customer, user: User, password: string, currentPassword: string): Observable<void> {
    if (!customer) {
      return throwError('updateUserPassword() called without customer');
    }
    if (!user) {
      return throwError('updateUserPassword() called without user');
    }
    if (!password) {
      return throwError('updateUserPassword() called without password');
    }
    if (!currentPassword) {
      return throwError('updateUserPassword() called without currentPassword');
    }

    if (customer.type === 'PrivateCustomer') {
      return this.apiService.put('customers/-/credentials/password', { password, currentPassword });
    } else {
      return this.apiService.put('customers/-/users/-/credentials/password', { password, currentPassword });
    }
  }

  /**
   * Updates the customer data of the (currently loggedin) b2b customer.
   * @param customer  The customer data to update the customer.
   */
  updateCustomer(customer: Customer): Observable<Customer> {
    if (!customer) {
      return throwError('updateCustomer() called without customer');
    }

    if (!customer.isBusinessCustomer) {
      return throwError('updateCustomer() cannot be called for a private customer)');
    }

    return this.apiService.put('customers/-', customer).pipe(map(CustomerMapper.fromData));
  }

  /**
   * Get User data for the logged in Business Customer.
   * @returns The related customer user data.
   */
  getCompanyUserData(): Observable<User> {
    return this.apiService.get('customers/-/users/-').pipe(map(UserMapper.fromData));
  }

  /**
   * Request an email for the given datas user with a link to reset the users password.
   * @param data  The user data (email, firstName, lastName ) to identify the user.
   */
  requestPasswordReminder(data: PasswordReminder) {
    const options: AvailableOptions = {
      skipApiErrorHandling: true,
    };

    if (data.captcha) {
      options.headers = this.appendCaptchaHeaders(data.captcha, data.captchaAction);
    }

    return this.apiService.post('security/reminder', { answer: '', ...data }, options);
  }

  /**
   * set new password with data based on requestPasswordReminder generated email
   * @param data  password, userID, secureCode
   */
  updateUserPasswordByReminder(data: PasswordReminderUpdate) {
    const options: AvailableOptions = {
      skipApiErrorHandling: true,
    };
    return this.apiService.post('security/password', data, options);
  }

  // provides the request header for the appropriate captcha service
  private appendCaptchaHeaders(captcha: string, captchaAction: string): HttpHeaders {
    let headers = new HttpHeaders();
    // captcha V3
    if (captchaAction) {
      headers = headers.set(
        ApiService.AUTHORIZATION_HEADER_KEY,
        `CAPTCHA recaptcha_token=${captcha} action=${captchaAction}`
      );
      // captcha V2
    } else {
      // TODO: remove second parameter 'foo=bar' that currently only resolves a shortcoming of the server side implemenation that still requires two parameters
      headers = headers.set(ApiService.AUTHORIZATION_HEADER_KEY, `CAPTCHA g-recaptcha-response=${captcha} foo=bar`);
    }
    return headers;
  }
}
