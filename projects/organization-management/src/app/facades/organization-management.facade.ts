import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { differenceBy } from 'lodash-es';
import { Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { CostCenter, CostCenterBase, CostCenterBuyer } from 'ish-core/models/cost-center/cost-center.model';
import { getUserPermissions, getUserRoles } from 'ish-core/store/customer/authorization';
import { getLoggedInUser } from 'ish-core/store/customer/user';
import { toObservable } from 'ish-core/utils/functions';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import { B2bUser } from '../models/b2b-user/b2b-user.model';
import { UserBudget } from '../models/user-budget/user-budget.model';
import {
  getCurrentUserBudget,
  getCurrentUserBudgetError,
  getCurrentUserBudgetLoading,
  loadBudget,
} from '../store/budget';
import {
  addCostCenter,
  addCostCenterBuyers,
  deleteCostCenter,
  deleteCostCenterBuyer,
  getCostCenters,
  getCostCentersError,
  getCostCentersLoading,
  getSelectedCostCenter,
  loadCostCenters,
  updateCostCenter,
  updateCostCenterBuyer,
} from '../store/cost-centers';
import {
  addUser,
  deleteUser,
  getCostCenterManagers,
  getRole,
  getRoles,
  getSelectedUser,
  getSystemUserRoles,
  getUsers,
  getUsersError,
  getUsersLoading,
  loadUsers,
  setUserBudget,
  setUserRoles,
  updateUser,
} from '../store/users';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class OrganizationManagementFacade {
  constructor(private store: Store) {}

  usersError$ = this.store.pipe(select(getUsersError));
  usersLoading$ = this.store.pipe(select(getUsersLoading));
  selectedUser$ = this.store.pipe(select(getSelectedUser));
  users$ = this.store.pipe(select(getUsers));

  loggedInUserBudgetLoading$ = this.store.pipe(select(getCurrentUserBudgetLoading));
  loggedInUserBudgetError$ = this.store.pipe(select(getCurrentUserBudgetError));

  availableRoles$ = this.store.pipe(select(getSystemUserRoles));

  costCenters$ = this.store.pipe(select(getCostCenters));
  costCentersError$ = this.store.pipe(select(getCostCentersError));
  costCentersLoading$ = this.store.pipe(select(getCostCentersLoading));
  selectedCostCenter$ = this.store.pipe(select(getSelectedCostCenter));

  /**
   * user methods
   */
  loggedInUserBudget$() {
    this.store.dispatch(loadBudget());
    return this.store.pipe(select(getCurrentUserBudget));
  }

  addUser(user: B2bUser) {
    this.store.dispatch(
      addUser({
        user,
      })
    );
  }

  updateUser(user: B2bUser) {
    this.store.dispatch(
      updateUser({
        user,
      })
    );
  }

  deleteUser(login: string) {
    this.store.dispatch(deleteUser({ login }));
  }

  roles$(roleIDs: string[] | Observable<string[]>) {
    return toObservable(roleIDs).pipe(switchMap(ids => this.store.pipe(select(getRoles(ids)))));
  }

  role$(roleID: string) {
    return this.store.pipe(select(getRole(roleID)));
  }

  setSelectedUserRoles(roleIDs: string[]) {
    this.selectedUser$
      .pipe(take(1), whenTruthy(), mapToProperty('login'))
      .subscribe(login => this.store.dispatch(setUserRoles({ login, roles: roleIDs })));
  }

  setSelectedUserBudget(budget: UserBudget) {
    this.selectedUser$
      .pipe(take(1), whenTruthy(), mapToProperty('login'))
      .subscribe(login => this.store.dispatch(setUserBudget({ login, budget })));
  }

  costCenterManagerSelectOptions$() {
    return this.store.pipe(select(getUserPermissions), whenTruthy()).pipe(
      take(1),
      switchMap(permissions =>
        permissions.includes('APP_B2B_MANAGE_USERS')
          ? this.costCenterManagerSelectOptionsForAccountAdmin$()
          : this.costCenterManagerSelectOptionsForCCOwner$()
      )
    );
  }

  /**
   * cost center methods
   */
  private costCenterManagerSelectOptionsForAccountAdmin$() {
    this.store.dispatch(loadUsers());
    return this.store.pipe(
      select(getCostCenterManagers),
      whenTruthy(),
      filter(users => !!users?.length),
      map(users => users.map(user => ({ label: `${user.firstName} ${user.lastName}`, value: user.login }))),
      distinctUntilChanged()
    );
  }

  private costCenterManagerSelectOptionsForCCOwner$() {
    return this.store.pipe(
      select(getLoggedInUser),
      whenTruthy(),
      map(user => [{ label: `${user.firstName} ${user.lastName}`, value: user.login }])
    );
  }

  costCenterUnassignedBuyers$() {
    return this.store.pipe(
      select(getUsers),
      whenTruthy(),
      withLatestFrom(this.selectedCostCenter$),
      filter(([buyers, costCenter]) => !!buyers.length && !!costCenter),
      map(([buyers, costCenter]) => differenceBy(buyers, costCenter.buyers, 'login'))
    );
  }

  costCentersOfCurrentUser$() {
    this.store.dispatch(loadCostCenters());
    return this.costCenters$.pipe(
      withLatestFrom(this.store.pipe(select(getLoggedInUser))),
      map(([costCenters, currentUser]) => costCenters.filter(cc => cc.costCenterOwner.login === currentUser.login))
    );
  }

  isCostCenterEditable(costCenter$: Observable<CostCenter>) {
    return combineLatest([costCenter$, this.store.pipe(select(getLoggedInUser)), this.isAccountAdmin$]).pipe(
      filter(([costCenter, user]) => !!costCenter && !!user),
      map(([costCenter, user, isAdmin]) => isAdmin || costCenter.costCenterOwner.login === user?.login)
    );
  }

  private isAccountAdmin$ = this.store
    .pipe(select(getUserRoles))
    .pipe(map(roles => roles?.some(role => role.roleId === 'APP_B2B_ACCOUNT_OWNER')));

  addCostCenter(costCenter: CostCenterBase) {
    this.store.dispatch(
      addCostCenter({
        costCenter,
      })
    );
  }

  updateCostCenter(costCenter: CostCenterBase) {
    this.store.dispatch(
      updateCostCenter({
        costCenter,
      })
    );
  }

  deleteCostCenter(id: string) {
    this.store.dispatch(
      deleteCostCenter({
        id,
      })
    );
  }

  addBuyersToCostCenter(buyers: CostCenterBuyer[]) {
    this.selectedCostCenter$.pipe(take(1), whenTruthy(), mapToProperty('id')).subscribe(costCenterId =>
      this.store.dispatch(
        addCostCenterBuyers({
          costCenterId,
          buyers,
        })
      )
    );
  }

  updateCostCenterBuyer(buyer: CostCenterBuyer) {
    this.selectedCostCenter$.pipe(take(1), whenTruthy(), mapToProperty('id')).subscribe(costCenterId =>
      this.store.dispatch(
        updateCostCenterBuyer({
          costCenterId,
          buyer,
        })
      )
    );
  }

  removeBuyerFromCostCenter(login: string) {
    this.selectedCostCenter$.pipe(take(1), whenTruthy(), mapToProperty('id')).subscribe(costCenterId =>
      this.store.dispatch(
        deleteCostCenterBuyer({
          costCenterId,
          login,
        })
      )
    );
  }
}
