import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';

/**
 * Fetch the newsletter subscription status for the profile settings page
 */
export function fetchUserNewsletterGuard(): boolean | Observable<boolean> {
  const accountFacade = inject(AccountFacade);

  return accountFacade.loadNewsletterSubscription().pipe(map(() => true));
}
