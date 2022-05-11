import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, debounceTime, map, of, switchMap, withLatestFrom } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { whenFalsy } from 'ish-core/utils/operators';

@Injectable({
  providedIn: 'root',
})
export class CheckoutPageGuard implements CanActivate {
  constructor(private checkoutFacade: CheckoutFacade, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.checkoutFacade.basket$.pipe(
      debounceTime(500),
      withLatestFrom(this.checkoutFacade.basketLoading$),
      switchMap(([basket, basketLoading]) => {
        if (basket) {
          return of(true);
        }

        if (!basketLoading) {
          return of(this.router.parseUrl('/'));
        }

        return this.checkoutFacade.basketLoading$.pipe(
          whenFalsy(),
          switchMap(() => this.checkoutFacade.basket$.pipe(map(basket => (basket ? true : this.router.parseUrl('/')))))
        );
      })
    );
  }
}
