import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { OAuthService, TokenResponse } from 'angular-oauth2-oidc';
import { pick } from 'lodash-es';
import { Observable, combineLatest, defer, forkJoin, from, of, throwError } from 'rxjs';
import { concatMap, first, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Address } from 'ish-core/models/address/address.model';
import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { CustomerData, CustomerType } from 'ish-core/models/customer/customer.interface';
import { CustomerMapper } from 'ish-core/models/customer/customer.mapper';
import {
  Customer,
  CustomerLoginType,
  CustomerRegistrationType,
  CustomerUserType,
} from 'ish-core/models/customer/customer.model';
import { PasswordReminderUpdate } from 'ish-core/models/password-reminder-update/password-reminder-update.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { FetchTokenOptions, GrantType } from 'ish-core/models/token/token.interface';
import { UserCostCenter } from 'ish-core/models/user-cost-center/user-cost-center.model';
import { UserMapper } from 'ish-core/models/user/user.mapper';
import { User } from 'ish-core/models/user/user.model';
import { ApiService, AvailableOptions, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getUserPermissions } from 'ish-core/store/customer/authorization';
import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/customer/user';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { whenTruthy } from 'ish-core/utils/operators';
import { encodeResourceID } from 'ish-core/utils/url-resource-ids';

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
  constructor(
    private apiService: ApiService,
    private apiTokenService: ApiTokenService,
    private appFacade: AppFacade,
    private store: Store,
    private oauthService: OAuthService
  ) {}

  /**
   * Sign in an existing user with the given login credentials (login, password).
   *
   * @param loginCredentials  The users login credentials {login: 'foo', password. 'bar'}.
   * @returns                 The logged in customer data.
   *                          For private customers user data are also returned.
   *                          For business customers user data are returned by a separate call (getCompanyUserData).
   */
  signInUser(loginCredentials: Credentials): Observable<CustomerLoginType> {
    return defer(() =>
      loginCredentials
        ? this.fetchToken('password', { username: loginCredentials.login, password: loginCredentials.password }).pipe(
            switchMap(() => this.fetchCustomer())
          )
        : this.fetchCustomer()
    );
  }

  /**
   * Sign in an existing user with the given token or if no token is given, using token stored in cookie.
   *
   * @param token             The refresh token that is used to login user.
   * @returns                 The logged in customer data.
   *                          For private customers user data are also returned.
   *                          For business customers user data are returned by a separate call (getCompanyUserData).
   */
  signInUserByToken(token?: string): Observable<CustomerLoginType> {
    if (token) {
      return this.fetchToken('refresh_token', { refresh_token: token }).pipe(switchMap(() => this.fetchCustomer()));
    } else {
      return this.fetchCustomer({ skipApiErrorHandling: true });
    }
  }

  private fetchCustomer(options: AvailableOptions = {}): Observable<CustomerUserType> {
    return this.apiService.get<CustomerData>('customers/-', options).pipe(
      withLatestFrom(this.appFacade.isAppTypeREST$),
      concatMap(([data, isAppTypeRest]) =>
        forkJoin([
          isAppTypeRest && data.customerType === 'PRIVATE'
            ? this.apiService.get<CustomerData>('privatecustomers/-', options)
            : of(data),
          this.apiService.get<{ pgid: string }>('personalization', options).pipe(map(data => data.pgid)),
        ])
      ),
      map(([data, pgid]) => ({ ...CustomerMapper.mapLoginData(data), pgid }))
    );
  }

  /**
   * Fetches a new user token. Based on the grantType the user has to apply certain token options to the method.
   *
   * @param grantType   The given type ('anonymous', 'password', 'client_credentials', 'refresh_token') is used to specify, how the user token should be fetched.
   */
  fetchToken<T extends 'anonymous'>(grantType: T): Observable<TokenResponse>;
  fetchToken<T extends GrantType, R extends FetchTokenOptions<T>>(grantType: T, options: R): Observable<TokenResponse>;
  fetchToken<T extends GrantType, R extends FetchTokenOptions<T>>(
    grantType: T,
    options?: R
  ): Observable<TokenResponse> {
    return from(
      this.oauthService.fetchTokenUsingGrant(
        grantType,
        options ?? {},
        new HttpHeaders({ 'content-type': 'application/x-www-form-urlencoded' })
      )
    );
  }

  /**
   * Creates a new user for the given data.
   *
   * @param body  The user data (customer, user, credentials, address) to create a new user. The new user is not logged in after creation.
   */
  createUser(body: CustomerRegistrationType): Observable<CustomerUserType> {
    if (!body?.customer || (!body?.user && !body?.userId) || !body?.address) {
      return throwError(() => new Error('createUser() called without required body data'));
    }

    const customerAddress = {
      ...body.address,
      mainDivision: body.address.mainDivisionCode,
    };

    const newCustomer$: Observable<CreatePrivateCustomerType | CreateBusinessCustomerType> =
      this.appFacade.currentLocale$.pipe(
        map(currentLocale =>
          body.customer.isBusinessCustomer
            ? {
                type: 'SMBCustomer',
                ...body.customer,
                ...(body.user
                  ? {
                      user: {
                        ...body.user,
                        preferredLanguage: currentLocale,
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
                      preferredLanguage: currentLocale,
                    }
                  : {
                      userId: body.userId,
                    }),
                address: customerAddress,
                credentials: body.credentials,
                preferredLanguage: currentLocale,
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
          .pipe(map<void, CustomerUserType>(() => ({ customer: body.customer, user: body.user })))
      )
    );
  }

  /**
   * Updates the data of the currently logged in user.
   *
   * @param body  The user data (customer, user ) to update the user.
   */
  updateUser(body: CustomerUserType, credentials?: Credentials): Observable<User> {
    if (!body?.customer || !body?.user) {
      return throwError(() => new Error('updateUser() called without required body data'));
    }

    const headers = credentials
      ? new HttpHeaders().set(
          ApiService.AUTHORIZATION_HEADER_KEY,
          `BASIC ${window.btoa(`${credentials.login}:${credentials.password}`)}`
        )
      : undefined;

    const changedUser: object = {
      type: body.customer.isBusinessCustomer ? 'SMBCustomer' : 'PrivateCustomer',
      ...body.customer,
      ...body.user,
      preferredInvoiceToAddress: { urn: body.user.preferredInvoiceToAddressUrn },
      preferredShipToAddress: { urn: body.user.preferredShipToAddressUrn },
      preferredPaymentInstrument: body.user.preferredPaymentInstrumentId
        ? { id: body.user.preferredPaymentInstrumentId }
        : {},
      preferredInvoiceToAddressUrn: undefined,
      preferredShipToAddressUrn: undefined,
      preferredPaymentInstrumentId: undefined,
      preferredLanguage: body.user.preferredLanguage || 'en_US',
    };

    return this.appFacade.customerRestResource$.pipe(
      first(),
      concatMap(restResource =>
        body.customer.isBusinessCustomer
          ? this.apiService.put<User>('customers/-/users/-', changedUser, { headers }).pipe(map(UserMapper.fromData))
          : this.apiService.put<User>(`${restResource}/-`, changedUser, { headers }).pipe(map(UserMapper.fromData))
      )
    );
  }

  /**
   * Updates the password of the currently logged in user.
   *
   * @param customer         The current customer.
   * @param user             The current user.
   * @param password         The new password to update to.
   * @param currentPassword  The users old password for verification.
   */
  updateUserPassword(customer: Customer, user: User, password: string, currentPassword: string): Observable<void> {
    if (!customer) {
      return throwError(() => new Error('updateUserPassword() called without customer'));
    }
    if (!user) {
      return throwError(() => new Error('updateUserPassword() called without user'));
    }
    if (!password) {
      return throwError(() => new Error('updateUserPassword() called without password'));
    }
    if (!currentPassword) {
      return throwError(() => new Error('updateUserPassword() called without currentPassword'));
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
   * Logs out the current user associated with the specified authentication token.
   * All (refresh) tokens issued for this user will expire and become invalid.
   */
  logoutUser() {
    return this.apiService.put('token/logout').pipe(tap(() => this.apiTokenService.removeApiToken()));
  }

  /**
   * Updates the customer data of the (currently logged in) b2b customer.
   *
   * @param customer  The customer data to update the customer.
   */
  updateCustomer(customer: Customer): Observable<Customer> {
    if (!customer) {
      return throwError(() => new Error('updateCustomer() called without customer'));
    }

    if (!customer.isBusinessCustomer) {
      return throwError(() => new Error('updateCustomer() cannot be called for a private customer)'));
    }

    return this.apiService.put('customers/-', { ...customer, type: 'SMBCustomer' }).pipe(map(CustomerMapper.fromData));
  }

  /**
   * Get User data for the logged in Business Customer.
   *
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
   *
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
   *
   * @param data  password, userID, secureCode
   */
  updateUserPasswordByReminder(data: PasswordReminderUpdate) {
    const options: AvailableOptions = {
      skipApiErrorHandling: true,
    };
    return this.apiService.post('security/password', data, options);
  }

  /**
   * Get cost centers for the logged in User of a Business Customer.
   *
   * @returns The related cost centers.
   */
  getEligibleCostCenters(): Observable<UserCostCenter[]> {
    return combineLatest([
      this.store.pipe(select(getLoggedInCustomer), whenTruthy()),
      this.store.pipe(select(getLoggedInUser), whenTruthy()),
    ]).pipe(
      take(1),
      switchMap(([customer, user]) =>
        this.apiService.get(`customers/${customer.customerNo}/users/${encodeResourceID(user.login)}/costcenters`).pipe(
          unpackEnvelope(),
          map((costCenters: UserCostCenter[]) => costCenters)
        )
      )
    );
  }

  /**
   * Get cost center data of a business customer for a given cost center id. The logged in user needs permission APP_B2B_VIEW_COSTCENTER.
   *
   * @param   The Id of the cost center.
   * @returns The related cost center.
   */
  getCostCenter(id: string): Observable<CostCenter> {
    if (!id) {
      return throwError(() => new Error('getCostCenter() called without id'));
    }

    return combineLatest([
      this.store.pipe(select(getLoggedInCustomer), whenTruthy()),
      this.store.pipe(select(getUserPermissions), whenTruthy()),
    ]).pipe(
      take(1),
      switchMap(([customer, permissions]) => {
        if (permissions.includes('APP_B2B_VIEW_COSTCENTER')) {
          return this.apiService.get<CostCenter>(`customers/${customer.customerNo}/costcenters/${id}`);
        } else {
          return of(undefined);
        }
      })
    );
  }
}
