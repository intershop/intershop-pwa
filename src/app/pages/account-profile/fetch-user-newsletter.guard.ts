import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { userNewsletterActions } from 'ish-core/store/customer/user/user.actions';

/**
 * Fetch the newsletter subscription status for the profile settings page
 */
export function fetchUserNewsletterGuard(): boolean | Observable<boolean> {
  const store = inject(Store);

  store.dispatch(userNewsletterActions.loadUserNewsletterSubscription());
  return of(true);
}
