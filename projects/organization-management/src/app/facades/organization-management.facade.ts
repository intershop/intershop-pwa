import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { LoadUsers, getCurrentUser, getUsers, getUsersError, getUsersLoading } from '../store/users';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class OrganizationManagementFacade {
  constructor(private store: Store) {}

  users$() {
    this.store.dispatch(new LoadUsers());
    return this.store.pipe(select(getUsers));
  }
  usersError$ = this.store.pipe(select(getUsersError));
  usersLoading$ = this.store.pipe(select(getUsersLoading));
  currentUser$ = this.store.pipe(select(getCurrentUser));
}
