import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, skipWhile } from 'rxjs/operators';

import { getUserPermissions } from 'ish-core/store/customer/authorization';

export function checkPermission(userPermissions: string[], permission: string | string[]): boolean {
  if (permission === 'always') {
    return true;
  } else if (permission === 'never') {
    return false;
  } else {
    // eslint-disable-next-line no-param-reassign
    permission = typeof permission === 'string' ? [permission] : typeof permission === 'undefined' ? [] : permission;
    return permission.some(id => userPermissions?.includes(id));
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
      // ignore initial undefined values
      skipWhile(permissions => permissions === undefined),
      // react on logout properly
      map(permissions => (permissions ? checkPermission(permissions, permission) : false))
    );
  }
}
