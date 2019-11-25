import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { LogoutUser } from 'ish-core/store/user';

/**
 * triggers logging out the user if the guarded route is visited
 */
@Injectable({ providedIn: 'root' })
export class LogoutGuard implements CanActivate {
  constructor(private store: Store<{}>, private router: Router) {}

  canActivate() {
    this.store.dispatch(new LogoutUser());
    return this.router.createUrlTree(['/home']);
  }
}
