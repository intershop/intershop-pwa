import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { concatMap, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { PriceHelper } from 'ish-core/models/price/price.helper';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';

import { B2bRoleData } from '../../models/b2b-role/b2b-role.interface';
import { B2bRoleMapper } from '../../models/b2b-role/b2b-role.mapper';
import { B2bRole } from '../../models/b2b-role/b2b-role.model';
import { B2bUserMapper } from '../../models/b2b-user/b2b-user.mapper';
import { B2bUser } from '../../models/b2b-user/b2b-user.model';
import { UserBudget } from '../../models/user-budget/user-budget.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(
    private apiService: ApiService,
    private store: Store,
    private b2bRoleMapper: B2bRoleMapper,
    private appFacade: AppFacade
  ) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), whenTruthy(), take(1));

  /**
   * Get all users of a customer. The current user is expected to have user management permission.
   * @returns               All users of the customer.
   */
  getUsers(): Observable<B2bUser[]> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get(`customers/${customer.customerNo}/users`)
          .pipe(unpackEnvelope(), map(B2bUserMapper.fromListData))
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
      withLatestFrom(this.appFacade.currentLocale$),
      switchMap(([customer, currentLocale]) =>
        this.apiService
          .post<B2bUser>(`customers/${customer.customerNo}/users`, {
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
                preferredLanguage: currentLocale.lang ?? 'en_US',
                userBudgets: undefined,
                roleIds: undefined,
              },
            ],
          })
          .pipe(
            concatMap(() =>
              this.setUserRoles(user.email, user.roleIDs).pipe(
                concatMap(roleIDs =>
                  forkJoin([this.setUserBudget(user.email, user.userBudget), this.getUser(user.email)]).pipe(
                    map(([userBudget, newUser]) => ({ ...newUser, userBudget, roleIDs }))
                  )
                )
              )
            )
          )
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
          .put(`customers/${customer.customerNo}/users/${user.login}`, {
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

  getAvailableRoles(): Observable<B2bRole[]> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService.get(`customers/${customer.customerNo}/roles`).pipe(
          unpackEnvelope<B2bRoleData>('userRoles'),
          map(data => this.b2bRoleMapper.fromData(data))
        )
      )
    );
  }

  /**
   * set roles for given login
   *
   * @returns the set of new roles
   */
  setUserRoles(login: string, userRoles: string[]): Observable<string[]> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService.put(`customers/${customer.customerNo}/users/${login}/roles`, { userRoles }).pipe(
          unpackEnvelope<B2bRoleData>('userRoles'),
          map(data => data.map(r => r.roleID))
        )
      )
    );
  }

  /**
   * Set the budget for a given b2b user.
   * @param login   The login of the user.
   * @param budget The user's budget.
   * @returns The new budget
   */
  setUserBudget(login: string, budget: UserBudget): Observable<UserBudget> {
    if (!budget) {
      // tslint:disable-next-line: ish-no-object-literal-type-assertion
      return of({} as UserBudget);
    }
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService.put<UserBudget>(`customers/${customer.customerNo}/users/${login}/budgets`, budget)
      )
    );
  }

  getCurrentUserBudget(): Observable<UserBudget> {
    return this.apiService
      .b2bUserEndpoint()
      .get<UserBudget>('budgets')
      .pipe(
        map(budget => ({
          ...budget,
          spentBudget: budget.spentBudget ?? PriceHelper.empty(budget.budget?.currency),
        }))
      );
  }
}
