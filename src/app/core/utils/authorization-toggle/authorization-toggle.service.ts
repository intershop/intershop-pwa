import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { getUserPermissions } from 'ish-core/store/customer/authorization';
import { whenTruthy } from 'ish-core/utils/operators';

export function checkPermission(permissions: string[], permission: string): boolean {
  if (permission === 'always') {
    return true;
  } else if (permission === 'never') {
    return false;
  } else {
    return permissions.includes(permission);
  }
}

@Injectable({ providedIn: 'root' })
export class AuthorizationToggleService {
  private permissions$: Observable<string[]>;

  constructor(store: Store) {
    this.permissions$ = store.pipe(select(getUserPermissions));
  }

  isAuthorizedTo(permission: string): Observable<boolean> {
    // special case shortcut
    if (permission === 'always' || permission === 'never') {
      return of(checkPermission([], permission));
    }
    return this.permissions$.pipe(
      // wait for permissions to be loaded
      whenTruthy(),
      map(permissions => checkPermission(permissions, permission))
    );
  }
}
