import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutPageGuard implements CanActivate {
  constructor(private checkoutFacade: CheckoutFacade, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.checkoutFacade.basket$.pipe(map(basket => this.hasBasket(basket)));
  }

  private hasBasket(basket: Basket) {
    if (basket) {
      return true;
    } else {
      return this.router.parseUrl('/');
    }
  }
}
