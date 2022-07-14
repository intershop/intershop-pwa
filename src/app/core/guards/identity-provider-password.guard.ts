import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';

@Injectable({ providedIn: 'root' })
export class IdentityProviderPasswordGuard implements CanActivate {
  constructor(private identityProviderFactory: IdentityProviderFactory) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.identityProviderFactory.getType() !== 'ICM' && this.identityProviderFactory.getInstance().triggerInvite
      ? this.identityProviderFactory.getInstance().triggerInvite(route, state)
      : true;
  }
}
