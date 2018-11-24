import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { CheckoutReviewPageContainerComponent } from './checkout-review-page.container';
import { CheckoutReviewComponent } from './components/checkout-review/checkout-review.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CheckoutReviewComponent, CheckoutReviewPageContainerComponent],
})
export class CheckoutReviewPageModule {
  static component = CheckoutReviewPageContainerComponent;
}
