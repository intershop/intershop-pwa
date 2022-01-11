import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { getUserPermissions } from 'ish-core/store/customer/authorization';
import { whenTruthy } from 'ish-core/utils/operators';

export function checkPermission(userPermissions: string[], permission: string | string[]): boolean {
  if (permission === 'always') {
    return true;
  } else if (permission === 'never') {
    return false;
  } else {
    // eslint-disable-next-line no-param-reassign
    permission = typeof permission === 'string' ? [permission] : typeof permission === 'undefined' ? [] : permission;
    return permission.some(id => userPermissions.includes(id));
  }
}

@Injectable({ providedIn: 'root' })
export class AuthorizationToggleService {
  private permissions$: Observable<string[]>;

  constructor(store: Store) {
    this.permissions$ = store.pipe(select(getUserPermissions));
  }

  isAuthorizedTo(permission: string | string[]): Observable<boolean> {
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
