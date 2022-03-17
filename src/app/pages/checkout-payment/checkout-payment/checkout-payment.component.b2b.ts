import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PaymentInstrument } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-instrument.model';
import { PaymentMethod } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-method.model';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject, distinctUntilChanged, filter, map, takeUntil, withLatestFrom } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket, BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { log } from 'ish-core/utils/dev/operators';

import { PaymentMethodProvider } from '../payment-method-provider/payment-method.provider';

/**
 * The Checkout Payment Component renders the checkout payment page. On this page the user can select a payment method. Some payment methods require the user to enter some additional data, like credit card data. For some payment methods there is special javascript functionality necessary provided by an external payment host. See also {@link CheckoutPaymentPageComponent}
 *
 */
@Component({
  selector: 'ish-checkout-payment',
  templateUrl: './checkout-payment.component.b2b.html',
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [PaymentMethodProvider],
})
export class CheckoutPaymentComponent implements OnInit, OnDestroy {
  @Input() basket: Basket;
  @Input() paymentMethods: PaymentMethod[];
  @Input() priceType: 'gross' | 'net';
  @Input() error: HttpError;

  @Output() updatePaymentMethod = new EventEmitter<string>();
  @Output() createPaymentInstrument = new EventEmitter<{
    paymentInstrument: PaymentInstrument;
    saveForLater: boolean;
  }>();
  @Output() deletePaymentInstrument = new EventEmitter<PaymentInstrument>();
  @Output() nextStep = new EventEmitter<void>();

  basket$: Observable<Basket>;

  paymentMethods$: Observable<FormlyFieldConfig[]>;
  private destroy$ = new Subject<void>();

  formGroup = new FormGroup({});
  nextSubmitted = false;

  constructor(private paymentMethodProvider: PaymentMethodProvider, private checkoutFacade: CheckoutFacade) {}

  ngOnInit(): void {
    this.basket$ = this.checkoutFacade.basket$;
    this.paymentMethods$ = this.paymentMethodProvider.getPaymentMethodConfig$().pipe(log('formly conf'));
    this.formGroup.valueChanges
      .pipe(
        map(value => value?.paymentMethodSelect),
        withLatestFrom(this.checkoutFacade.basket$),
        filter(([selected, basket]) => selected !== this.getBasketPayment(basket)),
        log(),
        distinctUntilChanged(([prevSelected], [currSelected]) => prevSelected === currSelected),
        log(),
        takeUntil(this.destroy$)
      )
      .subscribe(([selected, basket]) => {
        if (!selected && basket) {
          this.setPaymentSelectionFromBasket(basket);
        } else {
          this.checkoutFacade.setBasketPayment(selected);
        }
      });
  }

  private getBasketPayment(basket: BasketView): string {
    return basket?.payment ? basket.payment.paymentInstrument.id : undefined;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Reset payment selection with current values from basket
   * Should be used for initialization when basket data is changed
   * invoked by `ngOnChanges()`, important in case of an error
   */
  private setPaymentSelectionFromBasket(basket: BasketView) {
    this.formGroup.get('paymentMethodSelect').setValue(this.getBasketPayment(basket));
  }

  /**
   * leads to next checkout page (checkout review)
   */
  goToNextStep() {
    this.nextSubmitted = true;
    this.nextStep.emit();
    if (this.paymentRedirectRequired) {
      // do a hard redirect to payment redirect URL
      location.assign(this.basket.payment.redirectUrl);
    }
  }

  get paymentRedirectRequired() {
    if (this.basket.payment) {
      return (
        this.basket.payment.capabilities?.includes('RedirectBeforeCheckout') &&
        this.basket.payment.redirectUrl &&
        this.basket.payment.redirectRequired
      );
    }
  }

  get nextDisabled() {
    return (!this.basket || !this.basket.payment) && this.nextSubmitted;
  }
}
