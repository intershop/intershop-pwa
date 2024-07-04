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

import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

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
  fields: FormlyFieldConfig[];
  options: FormlyFormOptions = {};

  model = { termsAndConditions: false };

  multipleBuckets = false;

  ngOnInit() {
    this.fields = this.setFields();
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
    if (this.form.valid) {
      this.createOrder.emit();
    }
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
