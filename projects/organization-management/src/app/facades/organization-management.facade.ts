import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { once } from 'lodash-es';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { toObservable } from 'ish-core/utils/functions';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import { B2bUser } from '../models/b2b-user/b2b-user.model';
import { Node, NodeTree } from '../models/node/node.model';
import {
  createGroup,
  getOrganizationGroups,
  getOrganizationGroupsError,
  getOrganizationGroupsLoading,
  loadGroups,
} from '../store/organization-hierarchies';
import {
  addUser,
  deleteUser,
  getRole,
  getRoles,
  getSelectedUser,
  getSystemUserRoles,
  getUsers,
  getUsersError,
  getUsersLoading,
  setUserRoles,
  updateUser,
} from '../store/users';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class OrganizationManagementFacade {
  constructor(private store: Store) {}

  customer$ = this.store.pipe(select(getLoggedInCustomer));
  usersError$ = this.store.pipe(select(getUsersError));
  usersLoading$ = this.store.pipe(select(getUsersLoading));
  selectedUser$ = this.store.pipe(select(getSelectedUser));
  users$ = this.store.pipe(select(getUsers));

  groupsLoading$ = this.store.pipe(select(getOrganizationGroupsLoading));
  groupsError$ = this.store.pipe(select(getOrganizationGroupsError));

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

  availableRoles$ = this.store.pipe(select(getSystemUserRoles));

  setSelectedUserRoles(roleIDs: string[]) {
    this.selectedUser$
      .pipe(take(1), whenTruthy(), mapToProperty('login'))
      .subscribe(login => this.store.dispatch(setUserRoles({ login, roles: roleIDs })));
  }

  private initialize = once(() => this.store.dispatch(loadGroups()));
  groups$(): Observable<NodeTree> {
    return this.customer$.pipe(
      whenTruthy(),
      take(1),
      tap(this.initialize),
      switchMap(() => this.store.pipe(select(getOrganizationGroups)))
    );
  }

  createAndAddGroup(parent: Node, child: Node) {
    this.store.dispatch(
      createGroup({
        parent,
        child,
      })
    );
  }
}
