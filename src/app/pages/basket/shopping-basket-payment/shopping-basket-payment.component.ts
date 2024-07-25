import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

@Component({
  selector: 'ish-shopping-basket-payment',
  templateUrl: './shopping-basket-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingBasketPaymentComponent implements OnInit, OnChanges {
  @Input({ required: true }) basket: BasketView;

  paymentMethods$: Observable<PaymentMethod[]>;

  priceType$: Observable<'gross' | 'net'>;
  redirectStatus$: Observable<string>;

  constructor(
    private checkoutFacade: CheckoutFacade,
    private featureToggleService: FeatureToggleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.priceType$ = this.checkoutFacade.priceType$;

    // if page is shown after cancelled/faulty redirect determine error message variable
    this.redirectStatus$ = this.route.queryParamMap.pipe(map(params => params.get('redirect')));
  }

  ngOnChanges(): void {
    this.paymentMethods$ = this.checkoutFacade.eligibleFastCheckoutPaymentMethods$().pipe(shareReplay(1));
  }

  fastCheckout(paymentId: string) {
    this.checkoutFacade.startFastCheckout(paymentId);
  }

  isApplicable(): boolean {
    return this.featureToggleService.enabled('guestCheckout') || this.basket.user !== undefined;
  }
}
