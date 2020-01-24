import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

@Component({
  selector: 'ish-checkout-review',
  templateUrl: './checkout-review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReviewComponent implements OnInit {
  @Input() basket: Basket;
  @Input() error: HttpError;
  @Input() submitting: boolean;
  @Output() createOrder = new EventEmitter<void>();

  form: FormGroup;
  submitted = false;

  ngOnInit() {
    // create t&c form
    this.form = new FormGroup({
      termsAndConditions: new FormControl(false, Validators.pattern('true')),
    });
  }

  /**
   * sends an event to submit order
   */
  submitOrder() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }
    this.createOrder.emit();
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }
}
