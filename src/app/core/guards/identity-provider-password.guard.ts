import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { first, of, switchMap } from 'rxjs';

import { IdentityProviderFactory } from 'ish-core/identity-provider/identity-provider.factory';
import { getTriggerReturnType$ } from 'ish-core/identity-provider/identity-provider.interface';
import { whenTruthy } from 'ish-core/utils/operators';

export function identityProviderPasswordGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const identityProviderFactory = inject(IdentityProviderFactory);

  return identityProviderFactory.initialized$.pipe(
    whenTruthy(),
    first(),
    switchMap(() => {
      if (identityProviderFactory.getType() !== 'ICM' && identityProviderFactory.getInstance().triggerInvite) {
        const inviteReturn$ = identityProviderFactory.getInstance().triggerInvite(route, state);
        return getTriggerReturnType$(inviteReturn$);
      } else {
        return of(true);
      }
    })
  );
}
