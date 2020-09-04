import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { once } from 'lodash-es';

import { getUserAuthorized } from 'ish-core/store/customer/user';
import { whenFalsy } from 'ish-core/utils/operators';

import { loadQuoting } from '../store/quoting';

@Injectable({ providedIn: 'root' })
export class InitializeQuotingGuard implements CanActivate, CanActivateChild {
  private init: () => void;

  constructor(store: Store) {
    store.pipe(select(getUserAuthorized), whenFalsy()).subscribe(() => {
      this.init = once(() => store.dispatch(loadQuoting()));
    });
  }

  canActivate(): boolean {
    this.init();
    return true;
  }
  canActivateChild(): boolean {
    this.init();
    return true;
  }
}
