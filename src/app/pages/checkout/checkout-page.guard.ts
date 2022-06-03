import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, race, timer } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { whenTruthy } from 'ish-core/utils/operators';

@Injectable({
  providedIn: 'root',
})
export class CheckoutPageGuard implements CanActivate {
  constructor(private checkoutFacade: CheckoutFacade, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return race(
      this.checkoutFacade.basket$.pipe(
        whenTruthy(),
        map(() => true)
      ),
      timer(4000).pipe(map(() => this.router.parseUrl('/basket')))
    );
  }
}
