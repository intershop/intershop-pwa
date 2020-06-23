import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { selectQueryParam } from 'ish-core/store/core/router';
import { logoutUser } from 'ish-core/store/customer/user';

/**
 * triggers logging out the user if the guarded route is visited
 *
 * if returnUrl is supplied as a queryParam, it redirects there (default is /home)
 */
@Injectable({ providedIn: 'root' })
export class LogoutGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate() {
    this.store.dispatch(logoutUser());
    return this.store.pipe(
      select(selectQueryParam('returnUrl')),
      map(returnUrl => returnUrl || '/home'),
      map(returnUrl => this.router.parseUrl(returnUrl))
    );
  }
}
