import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';

import { LogoutUser } from '../store/user';

/**
 * triggers logging out the user if the guarded route is visited
 */
@Injectable()
export class LogoutGuard implements CanActivate {
  constructor(private store: Store<{}>) {}

  canActivate() {
    this.store.dispatch(new LogoutUser());
    return true;
  }
}
