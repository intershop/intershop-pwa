import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Observable, take } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';

@Component({
  selector: 'ish-shopping-basket-payment',
  templateUrl: './shopping-basket-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingBasketPaymentComponent implements OnInit {
  @Input() paymentMethods$: Observable<PaymentMethod[]>;

  private destroyRef = inject(DestroyRef);

  basket: BasketView;
  priceType: 'gross' | 'net';
  redirectStatus: string;

  constructor(private checkoutFacade: CheckoutFacade, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.checkoutFacade.basket$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(basket => {
      this.checkoutFacade.loadEligiblePaymentMethods();
      this.basket = basket;
    });
    this.checkoutFacade.priceType$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(p => (this.priceType = p));

    // if page is shown after cancelled/faulty redirect determine error message variable
    this.route.queryParamMap.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const redirect = params.get('redirect');
      this.redirectStatus = redirect;
    });
  }

  fastCheckout(paymentId: string) {
    this.checkoutFacade.setBasketPayment(paymentId);
  }

  /**
   * Determine whether payment cost threshold has been reached
   * for usage in template
   */
  paymentCostThresholdReached(paymentMethod: PaymentMethod): boolean {
    const basketTotalPrice = PriceItemHelper.selectType(this.basket.totals.total, this.priceType);

    if (paymentMethod.paymentCostsThreshold && basketTotalPrice) {
      return (
        PriceItemHelper.selectType(paymentMethod.paymentCostsThreshold, this.priceType)?.value <= basketTotalPrice.value
      );
    }
    return false;
  }
}
