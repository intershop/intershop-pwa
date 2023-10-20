import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { first, switchMap } from 'rxjs';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';
import { getTriggerReturnType$ } from 'ish-core/utils/functions';
import { whenTruthy } from 'ish-core/utils/operators';

export function identityProviderLoginGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const identityProviderFactory = inject(IdentityProviderFactory);

  return identityProviderFactory.getInitialized$().pipe(
    whenTruthy(),
    first(),
    switchMap(() => {
      const loginReturn$ = identityProviderFactory.getInstance().triggerLogin(route, state);
      return getTriggerReturnType$(loginReturn$);
    })
  );
}
