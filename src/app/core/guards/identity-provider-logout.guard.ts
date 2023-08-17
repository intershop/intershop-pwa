import { inject } from '@angular/core';
import { first, switchMap } from 'rxjs';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';
import { getTriggerReturnType$ } from 'ish-core/identity-provider/identity-provider.interface';
import { whenTruthy } from 'ish-core/utils/operators';

export function identityProviderLogoutGuard() {
  const identityProviderFactory = inject(IdentityProviderFactory);

  return identityProviderFactory.initialized$.pipe(
    whenTruthy(),
    first(),
    switchMap(() => {
      const logoutReturn$ = identityProviderFactory.getInstance().triggerLogout();
      return getTriggerReturnType$(logoutReturn$);
    })
  );
}
