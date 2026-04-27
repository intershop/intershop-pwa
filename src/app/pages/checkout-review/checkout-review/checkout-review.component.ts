import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalAdapterTypes, PaypalConfigService } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';

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

  form = new FormGroup({});
  options: FormlyFormOptions = {};
  fields$: Observable<FormlyFieldConfig[]>;
  paypalPaymentMethod$: Observable<PaymentMethod | undefined>;

  model = { termsAndConditions: false };

  multipleBuckets = false;

  constructor(
    private appFacade: AppFacade,
    private checkoutFacade: CheckoutFacade,
    private paypalConfigService: PaypalConfigService
  ) {}

  ngOnInit() {
    this.fields$ = this.appFacade
      .serverSetting$<boolean>('basket.termsAndConditions')
      .pipe(map(enabled => (enabled ? this.setFields() : [])));

    this.paypalPaymentMethod$ = this.checkoutFacade.getBasketPaypalPaymentMethod();
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

  /**
   * Determine the PayPal adapter type based on payment method capabilities.
   */
  getPaypalAdapterType(method?: PaymentMethod): PaypalAdapterTypes {
    return this.paypalConfigService.getPaypalAdapterType(method);
  }

  hasCustomFields(): boolean {
    return this.basket?.customFields && Object.keys(this.basket.customFields).length > 0;
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
