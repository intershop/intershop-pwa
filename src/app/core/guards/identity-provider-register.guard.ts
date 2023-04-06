import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';

export function identityProviderRegisterGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const identityProviderFactory = inject(IdentityProviderFactory);

  const identityProvider = identityProviderFactory.getInstance();
  return identityProvider.triggerRegister
    ? identityProvider.triggerRegister(route, state)
    : identityProvider.triggerLogin(route, state);
}
