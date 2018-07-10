import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Basket } from '../../../../models/basket/basket.model';

@Component({
  selector: 'ish-checkout-review',
  templateUrl: './checkout-review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReviewComponent {
  @Input() basket: Basket;

  constructor(private router: Router) {}

  /**
   * leads to next checkout page (checkout receipt)
   */
  nextStep() {
    this.router.navigate(['/checkout/receipt']);
  }
}
