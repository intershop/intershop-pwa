import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { PunchoutUser } from '../models/punchout-user/punchout-user.model';
import { transferPunchoutBasket } from '../store/punchout-functions';
import {
  addPunchoutUser,
  deletePunchoutUser,
  getPunchoutError,
  getPunchoutLoading,
  getPunchoutUsers,
  getSelectedPunchoutUser,
  loadPunchoutUsers,
  updatePunchoutUser,
} from '../store/punchout-users';

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
  selectedPunchoutUser$ = this.store.pipe(select(getSelectedPunchoutUser));

  addPunchoutUser(user: PunchoutUser) {
    this.store.dispatch(addPunchoutUser({ user }));
  }

  updatePunchoutUser(user: PunchoutUser) {
    this.store.dispatch(updatePunchoutUser({ user }));
  }

  deletePunchoutUser(login: string) {
    this.store.dispatch(deletePunchoutUser({ login }));
  }

  transferBasket() {
    this.store.dispatch(transferPunchoutBasket());
  }
}
