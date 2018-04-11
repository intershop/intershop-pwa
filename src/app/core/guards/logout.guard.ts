import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { CoreState } from '../store/core.state';
import { LogoutUser } from '../store/user';

/**
 * triggers logging out the user if the guarded route is visited
 */
@Injectable()
export class LogoutGuard implements CanActivate {
  constructor(private store: Store<CoreState>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.store.dispatch(new LogoutUser());
    return true;
  }
}
