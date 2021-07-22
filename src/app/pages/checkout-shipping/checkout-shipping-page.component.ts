import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';

@Component({
  selector: 'ish-checkout-shipping-page',
  templateUrl: './checkout-shipping-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutShippingPageComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  basketError$: Observable<HttpError>;
  basket$: Observable<BasketView>;
  shippingMethods$: Observable<ShippingMethod[]>;
  isBusinessCustomer$: Observable<boolean>;

  private destroy$ = new Subject();

  nextDisabled = false;

  constructor(private checkoutFacade: CheckoutFacade, private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.loading$ = this.checkoutFacade.basketLoading$;
    this.basketError$ = this.checkoutFacade.basketError$;
    this.shippingMethods$ = this.checkoutFacade.eligibleShippingMethods$();
    this.isBusinessCustomer$ = this.accountFacade.isBusinessCustomer$;
  }

  /**
   * Validates the basket and jumps to the next checkout step (Payment)
   */
  goToNextStep() {
    combineLatest([this.shippingMethods$, this.basket$])
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(([shippingMethods, basket]) => {
        this.nextDisabled = !basket || !shippingMethods || !shippingMethods.length || !basket.commonShippingMethod;
        if (!this.nextDisabled) {
          this.checkoutFacade.continue(3);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
