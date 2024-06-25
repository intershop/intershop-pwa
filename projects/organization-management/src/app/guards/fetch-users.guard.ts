import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { getUserCount, loadUsers } from '../store/users';

/**
 * Fetch users for user management page
 */
export function fetchUsersGuard(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {
  const store = inject(Store);

  return store.pipe(
    select(getUserCount),
    tap(count => {
      if (count <= 1 || !route.data.onlyInitialUsers) {
        store.dispatch(loadUsers());
      }
    }),
    map(() => true)
  );
}
