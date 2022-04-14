import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { isObservable, of } from 'rxjs';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';

@Injectable({ providedIn: 'root' })
export class IdentityProviderLogoutGuard implements CanActivate {
  constructor(private identityProviderFactory: IdentityProviderFactory) {}

  canActivate() {
    const logoutReturn$ = this.identityProviderFactory.getInstance().triggerLogout();
    return isObservable(logoutReturn$) || isPromise(logoutReturn$) ? logoutReturn$ : of(logoutReturn$);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPromise(obj: any): obj is Promise<any> {
  return !!obj && typeof obj.then === 'function';
}
