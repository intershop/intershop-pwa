import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, combineLatest } from 'rxjs';
import { shareReplay, take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { CheckoutStepType } from 'ish-core/models/checkout/checkout-step.type';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';

@Component({
  selector: 'ish-checkout-shipping-page',
  templateUrl: './checkout-shipping-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutShippingPageComponent implements OnInit {
  loading$: Observable<boolean>;
  basketError$: Observable<HttpError>;
  basket$: Observable<BasketView>;
  shippingMethods$: Observable<ShippingMethod[]>;
  isBusinessCustomer$: Observable<boolean>;
  isDesiredDeliveryDate$: Observable<boolean>;

  private destroyRef = inject(DestroyRef);

  nextDisabled = false;

  constructor(
    private checkoutFacade: CheckoutFacade,
    private accountFacade: AccountFacade,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.loading$ = this.checkoutFacade.basketLoading$;
    this.basketError$ = this.checkoutFacade.basketError$;
    this.shippingMethods$ = this.checkoutFacade.eligibleShippingMethods$().pipe(shareReplay(1));
    this.isDesiredDeliveryDate$ = this.checkoutFacade.isDesiredDeliveryDateEnabled$;
    this.isBusinessCustomer$ = this.accountFacade.isBusinessCustomer$;
  }

  /**
   * Validates the basket and jumps to the next checkout step (Payment)
   */
  goToNextStep() {
    combineLatest([this.shippingMethods$, this.basket$])
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(([shippingMethods, basket]) => {
        this.nextDisabled = !basket || !shippingMethods?.length || !basket.commonShippingMethod;
        this.cd.markForCheck();
        if (!this.nextDisabled) {
          this.checkoutFacade.continue(CheckoutStepType.Payment);
        }
      });
  }
}
