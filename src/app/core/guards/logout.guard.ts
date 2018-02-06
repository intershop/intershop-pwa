import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { LogoutUser, State } from '../store';


@Injectable()
export class LogoutGuard implements CanActivate {

  constructor(private store: Store<State>) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.store.dispatch(new LogoutUser());
    return true;
  }
}
