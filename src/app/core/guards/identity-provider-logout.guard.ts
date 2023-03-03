import { inject } from '@angular/core';
import { isObservable, of } from 'rxjs';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';

export function identityProviderLogoutGuard() {
  const identityProviderFactory = inject(IdentityProviderFactory);

  const logoutReturn$ = identityProviderFactory.getInstance().triggerLogout();
  return isObservable(logoutReturn$) || isPromise(logoutReturn$) ? logoutReturn$ : of(logoutReturn$);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPromise(obj: any): obj is Promise<any> {
  return !!obj && typeof obj.then === 'function';
}
