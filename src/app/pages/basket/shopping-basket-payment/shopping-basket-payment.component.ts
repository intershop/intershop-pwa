import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, shareReplay, withLatestFrom } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PriceType } from 'ish-core/models/price/price.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { PaypalComponentTypes } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';

@Component({
  selector: 'ish-shopping-basket-payment',
  templateUrl: './shopping-basket-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingBasketPaymentComponent implements OnInit, OnChanges {
  @Input({ required: true }) basket: BasketView;

  paymentMethods$: Observable<PaymentMethod[]>;
  filteredPaymentMethods$: Observable<PaymentMethod[]>;
  priceType$: Observable<PriceType>;
  redirectStatus: string;
  paypalComponentType = PaypalComponentTypes.Buttons;

  constructor(
    private checkoutFacade: CheckoutFacade,
    private featureToggleService: FeatureToggleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.priceType$ = this.checkoutFacade.priceType$;
    this.paymentMethods$ = this.checkoutFacade.eligibleFastCheckoutPaymentMethods$.pipe(shareReplay(1));

    this.filteredPaymentMethods$ = this.paymentMethods$.pipe(
      whenTruthy(),
      map(methods => methods.filter(method => !method.capabilities?.includes('PaypalCheckout')))
    );
    // if page is shown after cancelled/faulty redirect determine error message variable
    this.redirectStatus = this.route.snapshot.queryParamMap.get('redirect');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.basket &&
      (changes.basket.previousValue?.recurrence !== changes.basket.currentValue?.recurrence ||
        !changes.basket.currentValue?.recurrence) &&
      this.basket
    ) {
      this.checkoutFacade.loadEligiblePaymentMethods();
    }
  }

  fastCheckout(paymentId: string) {
    this.checkoutFacade.startFastCheckout(paymentId);
  }

  isApplicable(): boolean {
    return this.featureToggleService.enabled('guestCheckout') || !!this.basket.user;
  }

  getPayPalPaymentMethod(): Observable<PaymentMethod> {
    return this.paymentMethods$.pipe(
      withLatestFrom(this.checkoutFacade.basket$),
      map(([paymentMethods, basket]) => {
        const paypalMethod = paymentMethods.find(method => method.capabilities?.includes('PaypalCheckout'));
        // Return PayPal method if basket has no payment
        if (!basket.payment) {
          return paypalMethod;
        }
        // Return PayPal method if it's the current payment instrument and redirect is required
        if (basket.payment.paymentInstrument?.id === paypalMethod?.id && basket.payment.redirectRequired) {
          return paypalMethod;
        }
        return;
      })
    );
  }
}
