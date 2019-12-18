import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutReviewPageComponent } from './checkout-review-page.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CheckoutReviewComponent, CheckoutReviewPageComponent],
})
export class CheckoutReviewPageModule {
  static component = CheckoutReviewPageComponent;
}
