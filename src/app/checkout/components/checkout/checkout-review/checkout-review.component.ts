import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { markAsDirtyRecursive } from '../../../../forms/shared/utils/form-utils';
import { Basket } from '../../../../models/basket/basket.model';

@Component({
  selector: 'ish-checkout-review',
  templateUrl: './checkout-review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReviewComponent implements OnInit {
  @Input() basket: Basket;

  form: FormGroup;
  submitted = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // create t&c form
    this.form = new FormGroup({
      termsAndConditions: new FormControl(false, Validators.pattern('true')),
    });
  }

  /**
   * submits order and leads to next checkout page (checkout receipt)
   */
  submitOrder() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }
    this.router.navigate(['/checkout/receipt']);
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }
}
