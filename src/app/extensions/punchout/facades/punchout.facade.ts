import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { PunchoutUser } from '../models/punchout-user/punchout-user.model';
import {
  addPunchoutUser,
  getPunchoutError,
  getPunchoutLoading,
  getPunchoutUsers,
  loadPunchoutUsers,
} from '../store/oci-punchout';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class PunchoutFacade {
  constructor(private store: Store) {}

  punchoutLoading$ = this.store.pipe(select(getPunchoutLoading));
  punchoutError$ = this.store.pipe(select(getPunchoutError));

  punchoutUsers$() {
    this.store.dispatch(loadPunchoutUsers());
    return this.store.pipe(select(getPunchoutUsers));
  }

  addPunchoutUser(user: PunchoutUser) {
    this.store.dispatch(addPunchoutUser({ user }));
  }
}
