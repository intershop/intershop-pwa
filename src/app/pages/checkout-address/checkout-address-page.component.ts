import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, map, take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { CheckoutStepType } from 'ish-core/models/checkout/checkout-step.type';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { User } from 'ish-core/models/user/user.model';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * The Checkout Address Page Component renders the checkout address page of a logged in user.
 *
 */
@Component({
  selector: 'ish-checkout-address-page',
  templateUrl: './checkout-address-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressPageComponent implements OnInit {
  basket$: Observable<BasketView>;
  basketError$: Observable<HttpError>;
  basketLoading$: Observable<boolean>;
  addressesError$: Observable<HttpError>;
  addressesLoading$: Observable<boolean>;
  currentUser$: Observable<User>;

  nextStepRequested = false;

  /**
   * initial basket's valid addresses in order to decide which address component should be displayed
   */
  validBasketAddresses$: Observable<boolean>;

  private destroyRef = inject(DestroyRef);

  constructor(private checkoutFacade: CheckoutFacade, private accountFacade: AccountFacade, private router: Router) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.basketError$ = this.checkoutFacade.basketError$;
    this.basketLoading$ = this.checkoutFacade.basketLoading$;
    this.addressesError$ = this.accountFacade.addressesError$;
    this.addressesLoading$ = this.accountFacade.addressesLoading$;
    this.currentUser$ = this.accountFacade.user$;

    // determine if basket addresses are available at page start
    this.validBasketAddresses$ = this.basket$.pipe(
      map(basket => !!basket && !!basket.invoiceToAddress && !!basket.commonShipToAddress),
      first()
    );

    // if all line items have been deleted go to shopping cart page
    this.basket$
      .pipe(
        whenTruthy(),
        filter(basket => !basket.lineItems?.length),
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.router.navigate(['/basket']));
  }

  /**
   * Validates the basket and jumps to the next checkout step (Shipping)
   * if an issue with the anonymous user address leads to a basket validation error checkout-address page is shown
   */
  nextStep() {
    this.nextStepRequested = true;
    this.checkoutFacade.continue(CheckoutStepType.Shipping);
  }
}
