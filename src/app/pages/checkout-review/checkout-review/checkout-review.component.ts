import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup, NgForm, Validators } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalAdapterTypes } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';

@Component({
  selector: 'ish-checkout-review',
  templateUrl: './checkout-review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReviewComponent implements OnInit, OnChanges {
  @Input({ required: true }) basket: Basket;
  @Input() error: HttpError;
  @Input() submitting: boolean;
  @Output() createOrder = new EventEmitter<void>();

  @ViewChild('tcForm') tcForm: NgForm;

  form = new FormGroup({});
  options: FormlyFormOptions = {};
  fields$: Observable<FormlyFieldConfig[]>;
  paypalPaymentMethod$: Observable<PaymentMethod | undefined>;

  model = { termsAndConditions: false };

  multipleBuckets = false;

  constructor(private appFacade: AppFacade, private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.fields$ = this.appFacade
      .serverSetting$<boolean>('basket.termsAndConditions')
      .pipe(map(enabled => (enabled ? this.setFields() : [])));

    this.paypalPaymentMethod$ = this.checkoutFacade.basket$.pipe(
      filter(basket => !!basket?.payment?.paymentInstrument?.id),
      switchMap(basket =>
        this.checkoutFacade.eligiblePaymentMethods$().pipe(
          map(methods => methods?.find(method => method.id === basket.payment?.paymentInstrument?.id)),
          map(method => (method?.capabilities?.includes('PaypalAlternativeWallet') ? method : undefined))
        )
      ),
      startWith(undefined),
      shareReplay(1)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.basket) {
      this.multipleBuckets = !this.basket?.commonShippingMethod || !this.basket?.commonShipToAddress;
    }
  }

  /**
   * sends an event to submit order
   */
  submitOrder() {
    if (this.form.valid && !this.multipleBuckets && !this.submitting) {
      this.createOrder.emit();
    }
  }

  hasCustomFields(): boolean {
    return this.basket?.customFields && Object.keys(this.basket.customFields).length > 0;
  }

  /**
   * Determine the PayPal adapter type based on payment method capabilities.
   */
  getPaypalAdapterType(method?: PaymentMethod): PaypalAdapterTypes {
    if (method?.capabilities?.includes('PaypalGooglePay')) {
      return 'Googlepay';
    }
    if (method?.capabilities?.includes('PaypalApplePay')) {
      return 'Applepay';
    }
    return 'Buttons';
  }

  private setFields() {
    return [
      {
        type: 'ish-checkout-review-tac-field',
        key: 'termsAndConditions',
        props: {
          required: true,
          validation: {
            show: true,
          },
        },
        validators: {
          validation: [Validators.pattern('true')],
        },
        validation: {
          messages: {
            pattern: 'checkout.tac.error.tip',
          },
        },
      },
    ];
  }
}
