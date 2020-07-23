import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

import { getUserCount, loadUsers } from '../store/users';

@Injectable({ providedIn: 'root' })
export class FetchUsersGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {
    return this.store.pipe(
      select(getUserCount),
      tap(count => {
        if (count <= 1 || !route.data.onlyInitialUsers) {
          this.store.dispatch(loadUsers());
        }
      }),
      mapTo(true)
    );
  }
}
