import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';

export function identityProviderPasswordGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const identityProviderFactory = inject(IdentityProviderFactory);

  return identityProviderFactory.getType() !== 'ICM' && identityProviderFactory.getInstance().triggerInvite
    ? identityProviderFactory.getInstance().triggerInvite(route, state)
    : true;
}
