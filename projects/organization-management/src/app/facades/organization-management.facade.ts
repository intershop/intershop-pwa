import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { B2bUser } from '../models/b2b-user/b2b-user.model';
import {
  addUser,
  deleteUser,
  getSelectedUser,
  getUsers,
  getUsersError,
  getUsersLoading,
  loadUsers,
  updateUser,
} from '../store/users';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class OrganizationManagementFacade {
  constructor(private store: Store) {}

  usersError$ = this.store.pipe(select(getUsersError));
  usersLoading$ = this.store.pipe(select(getUsersLoading));
  selectedUser$ = this.store.pipe(select(getSelectedUser));

  users$() {
    this.store.dispatch(loadUsers());
    return this.store.pipe(select(getUsers));
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
}
