import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';

@Injectable({ providedIn: 'root' })
export class IdentityProviderRegisterGuard implements CanActivate {
  constructor(private identityProviderFactory: IdentityProviderFactory) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const identityProvider = this.identityProviderFactory.getInstance();
    return identityProvider.triggerRegister
      ? identityProvider.triggerRegister(route, state)
      : identityProvider.triggerLogin(route, state);
  }
}
