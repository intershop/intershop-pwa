import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';

export function identityProviderLoginGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const identityProviderFactory = inject(IdentityProviderFactory);

  return identityProviderFactory.getInstance().triggerLogin(route, state);
}
