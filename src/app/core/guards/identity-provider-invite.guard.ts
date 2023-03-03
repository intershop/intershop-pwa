import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';

export function identityProviderInviteGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const identityProviderFactory = inject(IdentityProviderFactory);

  return identityProviderFactory.getInstance().triggerInvite
    ? identityProviderFactory.getInstance().triggerInvite(route, state)
    : false;
}
