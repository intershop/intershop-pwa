import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, map, race, timer } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * Checks if the user has a basket before the (checkout) page is shown, if not the user will be routed to the cart page
 */

export function checkoutPageGuard(): Observable<boolean | UrlTree> {
  const checkoutFacade = inject(CheckoutFacade);
  const router = inject(Router);

  return race(
    checkoutFacade.basket$.pipe(
      whenTruthy(),
      map(() => true)
    ),
    timer(4000).pipe(map(() => router.parseUrl('/basket')))
  );
}
