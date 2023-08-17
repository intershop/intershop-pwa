import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { first, switchMap } from 'rxjs';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';
import { getTriggerReturnType$ } from 'ish-core/identity-provider/identity-provider.interface';
import { whenTruthy } from 'ish-core/utils/operators';

export function identityProviderRegisterGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const identityProviderFactory = inject(IdentityProviderFactory);

  return identityProviderFactory.initialized$.pipe(
    whenTruthy(),
    first(),
    switchMap(() => {
      const identityProvider = identityProviderFactory.getInstance();
      if (identityProvider.triggerRegister) {
        const registerReturn$ = identityProvider.triggerRegister(route, state);
        return getTriggerReturnType$(registerReturn$);
      } else {
        const loginReturn$ = identityProvider.triggerLogin(route, state);
        return getTriggerReturnType$(loginReturn$);
      }
    })
  );
}
