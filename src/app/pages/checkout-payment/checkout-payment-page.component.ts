import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { filter, first, map, withLatestFrom } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { CheckoutStepType } from 'ish-core/models/checkout/checkout-step.type';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

@Component({
  selector: 'ish-checkout-payment-page',
  templateUrl: './checkout-payment-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPaymentPageComponent implements OnInit {
  basket$: Observable<BasketView>;
  basketError$: Observable<HttpError>;
  loading$: Observable<boolean>;
  paymentMethods = [] as PaymentMethod[];
  paymentMethods$: Observable<PaymentMethod[]>;
  priceType$: Observable<'gross' | 'net'>;

  private destroyRef = inject(DestroyRef);

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.basketError$ = this.checkoutFacade.basketError$;
    this.loading$ = this.checkoutFacade.basketLoading$;
    this.priceType$ = this.checkoutFacade.priceType$;

    this.paymentMethods$ = this.checkoutFacade.eligiblePaymentMethods$().pipe(
      withLatestFrom(this.basket$),
      map(([pmList, basket]) =>
        pmList?.filter(
          pm =>
            !pm.capabilities ||
            !pm.capabilities.includes('FastCheckout') ||
            (pm.capabilities &&
              pm.capabilities.includes('FastCheckout') &&
              basket?.payment?.capabilities?.includes('FastCheckout') &&
              basket.payment.paymentInstrument.id === pm.id)
        )
      )
    );

    // if there is only one eligible payment method without parameters, assign it automatically to the basket
    this.paymentMethods$
      .pipe(
        filter(methods => methods?.length === 1),
        map(methods => methods[0]),
        filter(pm => !pm.parameters),
        first(),
        withLatestFrom(this.basket$),
        filter(([, basket]) => !basket?.payment),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([pm]) => this.updateBasketPaymentMethod(pm.id));
  }

  updateBasketPaymentMethod(paymentName: string) {
    this.checkoutFacade.setBasketPayment(paymentName);
  }

  createPaymentInstrument(body: { paymentInstrument: PaymentInstrument; saveForLater: boolean }) {
    if (!body?.paymentInstrument) {
      return;
    }
    this.checkoutFacade.createBasketPayment(body.paymentInstrument, body.saveForLater);
  }

  deletePaymentInstrument(instrument: PaymentInstrument) {
    this.checkoutFacade.deleteBasketPayment(instrument);
  }

  /**
   * Validates the basket and jumps to the next checkout step (Review)
   */
  nextStep() {
    this.checkoutFacade.continue(CheckoutStepType.Review);
  }
}
