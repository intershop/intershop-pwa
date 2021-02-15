import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import b64u from 'b64u';
import { pick } from 'lodash-es';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, first, map, take, withLatestFrom } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Address } from 'ish-core/models/address/address.model';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { CustomerData, CustomerType } from 'ish-core/models/customer/customer.interface';
import { CustomerMapper } from 'ish-core/models/customer/customer.mapper';
import { Customer, CustomerRegistrationType, CustomerUserType } from 'ish-core/models/customer/customer.model';
import { PasswordReminderUpdate } from 'ish-core/models/password-reminder-update/password-reminder-update.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { UserMapper } from 'ish-core/models/user/user.mapper';
import { User } from 'ish-core/models/user/user.model';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

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
  type: CustomerType;
}

/**
 * The User Service handles the registration related interaction with the 'customers' REST API.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private apiService: ApiService, private appFacade: AppFacade, private store: Store) {}

  /**
   * Sign in an existing user with the given login credentials (login, password).
   * @param loginCredentials  The users login credentials {login: 'foo', password. 'bar'}.
   * @returns                 The logged in customer data.
   *                          For private customers user data are also returned.
   *                          For business customers user data are returned by a separate call (getCompanyUserData).
   */
  signinUser(loginCredentials: Credentials): Observable<CustomerUserType> {
    const headers = new HttpHeaders().set(
      ApiService.AUTHORIZATION_HEADER_KEY,
      'BASIC ' + b64u.toBase64(b64u.encode(`${loginCredentials.login}:${loginCredentials.password}`))
    );

    return this.fetchCustomer({ headers });
  }
  /**
   * Sign in an existing user with the given token or if no token is given, using token stored in cookie.
   * @param token             The token that is used to login user.
   * @returns                 The logged in customer data.
   *                          For private customers user data are also returned.
   *                          For business customers user data are returned by a separate call (getCompanyUserData).
   */
  signinUserByToken(token?: string): Observable<CustomerUserType> {
    if (token) {
      return this.fetchCustomer({
        headers: new HttpHeaders().set(ApiService.TOKEN_HEADER_KEY, token),
      });
    } else {
      return this.fetchCustomer({ skipApiErrorHandling: true, runExclusively: true });
    }
  }

  private fetchCustomer(options?: AvailableOptions): Observable<CustomerUserType> {
    return this.apiService.get<CustomerData>('customers/-', options).pipe(
      withLatestFrom(this.appFacade.isAppTypeREST$),
      concatMap(([data, isAppTypeRest]) =>
        // ToDo: #IS-30018 use the customer type for this decision
        isAppTypeRest && !data.companyName ? this.apiService.get<CustomerData>('privatecustomers/-') : of(data)
      ),
      map(CustomerMapper.mapLoginData)
    );
  }

  /**
   * Create a new user for the given data.
   * @param body  The user data (customer, user, credentials, address) to create a new user.
   */
  createUser(body: CustomerRegistrationType): Observable<CustomerUserType> {
    if (!body || !body.customer || (!body.user && !body.userId) || !body.address) {
      return throwError('createUser() called without required body data');
    }

    const customerAddress = {
      ...body.address,
      mainDivision: body.address.mainDivisionCode,
    };

    let newCustomer$: Observable<CreatePrivateCustomerType | CreateBusinessCustomerType>;
    newCustomer$ = this.appFacade.currentLocale$.pipe(
      map(currentLocale =>
        body.customer.isBusinessCustomer
          ? {
              type: 'SMBCustomer',
              ...body.customer,
              ...(body.user
                ? {
                    user: {
                      ...body.user,
                      preferredLanguage: currentLocale.lang ?? 'en_US',
                    },
                  }
                : {
                    userId: body.userId,
                  }),
              address: customerAddress,
              credentials: body.credentials,
            }
          : {
              type: 'PrivateCustomer',
              ...body.customer,
              ...(body.user
                ? {
                    firstName: body.user.firstName,
                    lastName: body.user.lastName,
                    email: body.user.email,
                    preferredLanguage: currentLocale.lang ?? 'en_US',
                  }
                : {
                    userId: body.userId,
                  }),
              address: customerAddress,
              credentials: body.credentials,
              preferredLanguage: currentLocale.lang ?? 'en_US',
            }
      )
    );

    return this.appFacade.isAppTypeREST$.pipe(
      first(),
      withLatestFrom(newCustomer$.pipe(first())),
      concatMap(([isAppTypeRest, newCustomer]) =>
        this.apiService
          .post<void>(AppFacade.getCustomerRestResource(body.customer.isBusinessCustomer, isAppTypeRest), newCustomer, {
            captcha: pick(body, ['captcha', 'captchaAction']),
          })
          .pipe(concatMap(() => this.fetchCustomer()))
      )
    );
  }

  /**
   * Updates the data of the currently logged in user.
   * @param body  The user data (customer, user ) to update the user.
   */
  updateUser(body: CustomerUserType, credentials?: Credentials): Observable<User> {
    if (!body || !body.customer || !body.user) {
      return throwError('updateUser() called without required body data');
    }

    const headers = credentials
      ? new HttpHeaders().set(
          ApiService.AUTHORIZATION_HEADER_KEY,
          'BASIC ' + b64u.toBase64(b64u.encode(`${credentials.login}:${credentials.password}`))
        )
      : undefined;

    const changedUser: object = {
      type: body.customer.isBusinessCustomer ? 'SMBCustomer' : 'PrivateCustomer',
      ...body.customer,
      ...body.user,
      preferredInvoiceToAddress: { urn: body.user.preferredInvoiceToAddressUrn },
      preferredShipToAddress: { urn: body.user.preferredShipToAddressUrn },
      preferredPaymentInstrument: { id: body.user.preferredPaymentInstrumentId },
      preferredInvoiceToAddressUrn: undefined,
      preferredShipToAddressUrn: undefined,
      preferredPaymentInstrumentId: undefined,
      preferredLanguage: body.user.preferredLanguage || 'en_US',
    };

    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        body.customer.isBusinessCustomer
          ? this.apiService
              .put<User>('customers/-/users/-', changedUser, { headers })
              .pipe(map(UserMapper.fromData))
          : this.apiService
              .put<User>(`${restResource}/-`, changedUser, { headers })
              .pipe(map(UserMapper.fromData))
      )
    );
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

    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        this.apiService.put<void>(
          customer.isBusinessCustomer
            ? 'customers/-/users/-/credentials/password'
            : `${restResource}/-/credentials/password`,
          { password, currentPassword }
        )
      )
    );
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

    return this.apiService.put('customers/-', { ...customer, type: 'SMBCustomer' }).pipe(map(CustomerMapper.fromData));
  }

  /**
   * Get User data for the logged in Business Customer.
   * @returns The related customer user data.
   */
  getCompanyUserData(): Observable<User> {
    return this.store.pipe(
      select(getLoggedInCustomer),
      map(customer => customer?.customerNo || '-'),
      take(1),
      concatMap(customerNo => this.apiService.get(`customers/${customerNo}/users/-`).pipe(map(UserMapper.fromData)))
    );
  }

  /**
   * Request an email for the given data user with a link to reset the users password.
   * @param data  The user data (email, firstName, lastName ) to identify the user.
   */
  requestPasswordReminder(data: PasswordReminder) {
    const options: AvailableOptions = {
      skipApiErrorHandling: true,
      captcha: pick(data, ['captcha', 'captchaAction']),
    };

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
}
