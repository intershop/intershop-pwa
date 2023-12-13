import { inject } from '@angular/core';
import { first, switchMap } from 'rxjs';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';
import { getTriggerReturnType$ } from 'ish-core/utils/functions';
import { whenTruthy } from 'ish-core/utils/operators';

export function identityProviderLogoutGuard() {
  const identityProviderFactory = inject(IdentityProviderFactory);

  return identityProviderFactory.getInitialized$().pipe(
    whenTruthy(),
    first(),
    switchMap(() => {
      const logoutReturn$ = identityProviderFactory.getInstance().triggerLogout();
      return getTriggerReturnType$(logoutReturn$);
    })
  );
}
