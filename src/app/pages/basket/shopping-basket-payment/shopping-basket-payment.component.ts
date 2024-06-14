import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnChanges, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Observable, take } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

@Component({
  selector: 'ish-shopping-basket-payment',
  templateUrl: './shopping-basket-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingBasketPaymentComponent implements OnInit, OnChanges {
  @Input() basket: BasketView;

  private destroyRef = inject(DestroyRef);
  paymentMethods$: Observable<PaymentMethod[]>;

  priceType: Observable<'gross' | 'net'>;
  redirectStatus: string;

  constructor(private checkoutFacade: CheckoutFacade, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.paymentMethods$ = this.checkoutFacade.eligiblePaymentMethods$('basket');

    this.priceType = this.checkoutFacade.priceType$;

    // if page is shown after cancelled/faulty redirect determine error message variable
    this.route.queryParamMap.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const redirect = params.get('redirect');
      this.redirectStatus = redirect;
    });
  }

  ngOnChanges(): void {
    this.paymentMethods$ = this.checkoutFacade.eligiblePaymentMethods$('basket');
  }

  fastCheckout(paymentId: string) {
    this.checkoutFacade.setFastCheckoutPayment(paymentId);
  }
}
