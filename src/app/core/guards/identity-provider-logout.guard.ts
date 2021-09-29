import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { isObservable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';
import { RoleToggleService } from 'ish-core/utils/role-toggle/role-toggle.service';

@Injectable({ providedIn: 'root' })
export class IdentityProviderLogoutGuard implements CanActivate {
  constructor(
    private identityProviderFactory: IdentityProviderFactory,
    private roleToggleService: RoleToggleService,
    private accountFacade: AccountFacade
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.roleToggleService.hasRole(['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER']).pipe(
      take(1),
      switchMap(isPunchout => {
        if (isPunchout) {
          this.accountFacade.logoutUser();
          return of(false);
        }
        const logoutReturn$ = this.identityProviderFactory.getInstance().triggerLogout();
        return isObservable(logoutReturn$) || isPromise(logoutReturn$) ? logoutReturn$ : of(logoutReturn$);
      })
    );
  }
}

// tslint:disable-next-line: no-any
function isPromise(obj: any): obj is Promise<any> {
  return !!obj && typeof obj.then === 'function';
}
