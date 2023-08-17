import { inject } from '@angular/core';
import { first, isObservable, of, switchMap } from 'rxjs';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';
import { isPromise } from 'ish-core/utils/functions';
import { whenTruthy } from 'ish-core/utils/operators';

export function identityProviderLogoutGuard() {
  const identityProviderFactory = inject(IdentityProviderFactory);

  return identityProviderFactory.initialized$.pipe(
    whenTruthy(),
    first(),
    switchMap(() => {
      const logoutReturn$ = identityProviderFactory.getInstance().triggerLogout();
      return isObservable(logoutReturn$) || isPromise(logoutReturn$) ? logoutReturn$ : of(logoutReturn$);
    })
  );
}
