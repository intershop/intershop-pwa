import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PaymentInstrument } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-instrument.model';
import { PaymentMethod } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-method.model';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject, distinctUntilChanged, filter, map, takeUntil } from 'rxjs';

import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

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

  constructor(private paymentMethodProvider: PaymentMethodProvider) {}

  ngOnInit(): void {
    this.paymentMethods$ = this.paymentMethodProvider.getPaymentMethodConfig$();
    this.formGroup.valueChanges
      .pipe(
        filter(() => !!this.formGroup.get('paymentMethodSelect')),
        map(value => value?.paymentMethodSelect),
        filter(selected => selected !== this.getBasketPayment()),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(selected => {
        if (!selected && this.basket) {
          this.setPaymentSelectionFromBasket();
        } else {
          this.updatePaymentMethod.emit(selected);
        }
      });
  }

  private getBasketPayment(): string {
    return this.basket?.payment ? this.basket.payment.paymentInstrument.id : undefined;
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
  private setPaymentSelectionFromBasket() {
    this.formGroup.get('paymentMethodSelect').setValue(this.getBasketPayment());
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
